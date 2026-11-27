import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import styled from 'styled-components'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { LuminosityShaderWithOpacity } from './Shaders/LuminosityShaderWithOpacity';
import { SobelWithOpacity } from '../common/Shaders/SobelWithOpacity';
import { PixelShader } from './Shaders/PixelShader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Splat scene, served from /static
const SPLAT_URL = '/mttilde_Cleanup.ply'

// Transform for the splat. The rotation quaternion is deliberately NOT
// normalised: the previous renderer composed its matrix from these exact
// values, so composing them the same way keeps the framing identical.
// The y position compensates for mttilde_Cleanup.ply being exported
// ~4.55 units higher (in file space) than the old .splat.
const SPLAT_POSITION = new THREE.Vector3(0, 5.9, 0)
const SPLAT_ROTATION = new THREE.Quaternion(0, -0.6, 0, 0.707)
const SPLAT_SCALE = new THREE.Vector3(1.3, -1.3, 1.3)

// Seconds for the splat to fade in once loaded
const SPLAT_FADE_IN = 2.5

const StyledDiv = styled.div`
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;

`

const MainCanvas = () => {


  const threeElement = useRef();
  let loadingscreen = useRef()
  let texLoader = useRef();

  let splat = useRef();
  let splatRenderer = useRef();
  let renderer = useRef();
  let camera = useRef();
  let scene = useRef();

  let fogCol = useRef();
  let composer = useRef()
  let effectSobel = useRef()
  let effectGrayScale = useRef()
  let effectPixel = useRef();
  let skyBoxBGTex = useRef();
  let pmremGenerator = useRef();

  let controls = useRef()


  const params = {
    enable: true,
    sobelOpacity: 0.0,
    greyscaleOpacity: 0.0,
    pixelSize: 2.0,
    enableOrbitControls: true,
    sizeScalar: .035
  };

  const transitions = {
    sobelPosIn: 0.05,
    sobelPosOut: 0.9,
    greyscalePosIn: 0.05,
    greyscalePosOut: 0.6,
    pixelPosIn: 0.8,
    pixelPosOut: 1
  }

  let controlsOn = true;


  let targetScrollPos = 0;
  let scrollPos = 0;

  const sobelCurve = new THREE.CubicBezierCurve(new THREE.Vector2(0,0),new THREE.Vector2(0,1.5),new THREE.Vector2(0,2),new THREE.Vector2(0,0));
  const greyscaleCurve = new THREE.CubicBezierCurve(new THREE.Vector2(0,0),new THREE.Vector2(0,1),new THREE.Vector2(0,1),new THREE.Vector2(0,0));
  const pixelCurve = new THREE.CubicBezierCurve(new THREE.Vector2(0,0),new THREE.Vector2(0,1),new THREE.Vector2(0,1),new THREE.Vector2(0,1));

  //particle system stuff

  let frame = 0
  let geometry = new THREE.BufferGeometry();
  let particleMaterial = new THREE.PointsMaterial()
  let particleSystem = new THREE.Points(geometry,particleMaterial)
  const PARTICLE_COUNT = 3000

  let then = 0;
  let fadeInPercentage = 0;

  useEffect(() => {
    texLoader = new THREE.TextureLoader();

    initScene()
    initSnow()

    if (controlsOn){  initControls()  }

    then = 0;
  }, [])

  const animate = (now = 0) => {

    //get delta time
    now *= 0.001;  // make it seconds
    let delta = then ? now - then : 0;
    then = now;

    // fade the splat in after loading; the sobel edge effect fades with it
    fadeInPercentage = Math.min(1, fadeInPercentage + delta / SPLAT_FADE_IN);
    splat.opacity = fadeInPercentage;

    // update shaders using smoothed scroll position
    scrollPos = THREE.MathUtils.lerp( scrollPos, targetScrollPos, 0.05 );
    // gets clamped time between in and out points
    let sobelTime = THREE.MathUtils.smoothstep( scrollPos, transitions.sobelPosIn, transitions.sobelPosOut )  + (1 - fadeInPercentage)
    // finds that point on the animation curve
    const sobelPos = sobelCurve.getPoint(sobelTime).y
    params.sobelOpacity = sobelPos;

    const greyscaleTime = THREE.MathUtils.smoothstep(scrollPos, transitions.greyscalePosIn, transitions.greyscalePosOut)
    const greyscalePos = greyscaleCurve.getPoint(greyscaleTime).y;
    params.greyscaleOpacity = greyscalePos;

    const pixelTime = THREE.MathUtils.smoothstep(scrollPos, transitions.pixelPosIn, transitions.pixelPosOut)
    const pixelPos = pixelCurve.getPoint(pixelTime).y
    const pixelSize = THREE.MathUtils.mapLinear(pixelPos, 0, 1, 1, 32)
    params.greyscaleOpacity = pixelSize;

    effectSobel.uniforms[ 'opacity' ].value = sobelPos;
    effectGrayScale.uniforms[ 'opacity' ].value = greyscalePos;
    effectPixel.uniforms[ "pixelSize" ].value = pixelSize;

    if (controlsOn){
      controls.enable = true
      controls.update();
    }

    // the splat renderer updates and sorts automatically on each render
    if (( params.enable === true )){

      composer.render();

    } else {

      renderer.render(scene, camera);

    }

    animateSnow()


    requestAnimationFrame(animate)
}


  const initScene = () => {
    let w = threeElement.current.clientWidth
    let h = threeElement.current.clientHeight
    scene = new THREE.Scene()

    fogCol = new THREE.Color(0xffffff);
    scene.fog = new THREE.FogExp2(fogCol, 0.00005)

    // gaussian-splat-lite recommends antialias off: MSAA slows splats down
    // without improving them
    renderer = new THREE.WebGLRenderer({ antialias: false })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(w, h)
    renderer.setClearColor('#0000')
    renderer.autoClear = true;


    threeElement.current.appendChild(renderer.domElement)
    loadingscreen = document.getElementById('loading-screen')

    pmremGenerator = new THREE.PMREMGenerator( renderer );
    pmremGenerator.compileEquirectangularShader();

    camera = new THREE.PerspectiveCamera(50, w / h, .1, 50000)

    camera.position.copy(new THREE.Vector3().fromArray([-8.25, 6.6, -22]));
    camera.up = new THREE.Vector3().fromArray([0, 1, 0]).normalize();
    camera.lookAt(new THREE.Vector3().fromArray([-0.5, 6, -0.5]));

    // postprocessing

    composer = new EffectComposer( renderer );

    // color to grayscale conversion
    effectGrayScale = new ShaderPass( LuminosityShaderWithOpacity );
    effectGrayScale.uniforms[ 'opacity' ].value = 1//params.greyscaleOpacity;

    // Sobel operator
    effectSobel = new ShaderPass( SobelWithOpacity );
    effectSobel.uniforms[ 'resolution' ].value.x = window.innerWidth * window.devicePixelRatio;
    effectSobel.uniforms[ 'resolution' ].value.y = window.innerHeight * window.devicePixelRatio;
    effectSobel.uniforms[ 'opacity' ].value = params.sobelOpacity;

    effectPixel = new ShaderPass( PixelShader );
    effectPixel.uniforms[ "resolution" ].value = new THREE.Vector2( window.innerWidth, window.innerHeight );
    effectPixel.uniforms[ "resolution" ].value.multiplyScalar( window.devicePixelRatio );

    window.addEventListener('resize', () => {
      resize(threeElement)
    })

    window.addEventListener('scroll', handleScroll)

    loadScene()
  }

  //SPLAT STUFF
  const loadScene = async () => {
    // Imported here (browser only) so Gatsby's server-side render never
    // evaluates the library.
    const { GaussianSplatRenderer, SplatMesh } = await import('gaussian-splat-lite')

    // encodeLinear: false keeps the splat colours in sRGB, matching how the
    // skybox and the (OutputPass-free) post-processing chain handle colour.
    splatRenderer = new GaussianSplatRenderer({ renderer, encodeLinear: false })
    scene.add(splatRenderer)

    splat = new SplatMesh({ url: SPLAT_URL, maxSh: 0 })
    splat.matrixAutoUpdate = false
    splat.matrix.compose(SPLAT_POSITION, SPLAT_ROTATION, SPLAT_SCALE)
    splat.opacity = 0
    scene.add(splat)

    const skyLoad = texLoader.loadAsync('/textures/MtTildeSkybox.png')

    try {
      const [skyTex] = await Promise.all([skyLoad, splat.initialized])
      skyBoxBGTex = skyTex
      onSceneLoaded()
      animate()
    } catch (error) {
      console.log('There was an error loading the scene', error)
    }
  }

  const initControls = () => {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.075
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.3
    controls.screenSpacePanning = false
    controls.enableZoom = false

    controls.maxPolarAngle = Math.PI / 2.2
    controls.panSpeed = 1
    controls.update()

  }

  const initSnow = () => {
    // Load the snowflake texture
    var snowflakeTexture = texLoader.load('/textures/snowflake.png');

    // Define constants
    const x = 40;
    const y = 50;
    const z = 40;

    // Create an array to hold the positions of the particles
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);

    // Initialize the particle positions and velocities
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = Math.random() * x - x / 2;
      positions[i * 3 + 1] = Math.random() * y - y / 2;
      positions[i * 3 + 2] = Math.random() * z - z / 2;

      velocities[i * 3] = 3;
      velocities[i * 3 + 1] = -0.2;
      velocities[i * 3 + 2] = 0;
    }

    // Create a BufferGeometry and set the positions attribute
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));


    // Create the particle material
    const particleMaterial = new THREE.PointsMaterial({
      color: '#FFF',
      map: snowflakeTexture,
      size: 0.05,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    // Create the particle system
    particleSystem = new THREE.Points(geometry, particleMaterial);
    particleSystem.position.set(0, 0, 0);
    scene.add(particleSystem);
  };

  const animateSnow = () => {
    // Update the rotation of the particle system
    particleSystem.rotation.y = -frame / 200;

    // Get the position and velocity attributes and their arrays
    const positions = particleSystem.geometry.attributes.position.array;
    const velocities = particleSystem.geometry.attributes.velocity.array;

    // Update the positions of the particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      if (positions[i * 3 + 1] < -10) {
        positions[i * 3 + 1] =  Math.random()*25 + 50;
      }
      positions[i * 3 + 1] += velocities[i * 3 + 1] / 7;
    }

    // Mark the position attribute as needing an update
    particleSystem.geometry.attributes.position.needsUpdate = true;

    // Increment the frame counter
    frame++;
  };

  const resize = (threeElement) => {
    let w = threeElement.current.clientWidth
    let h = threeElement.current.clientHeight
    renderer.setSize(w, h)
    composer.setSize( w, h);

    effectSobel.uniforms[ 'resolution' ].value.x = w * window.devicePixelRatio * 64;
    effectSobel.uniforms[ 'resolution' ].value.y = h * window.devicePixelRatio * 64;

    effectPixel.uniforms[ "resolution" ].value.set( window.innerWidth, window.innerHeight ).multiplyScalar( window.devicePixelRatio );

    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  const handleScroll = () => {
    targetScrollPos = getVerticalScrollNormalised(document.body)
  }

  const getVerticalScrollNormalised = ( elm ) => {
    var p = elm.parentNode
    return (elm.scrollTop || p.scrollTop) / (p.scrollHeight - p.clientHeight )
  }



  function onTransitionEnd( event ) {

    event.target.remove();

  }

  //LOADING

  const onSceneLoaded = () => {
    skyBoxBGTex.rotation = Math.PI;
    const BGenv = pmremGenerator.fromEquirectangular( skyBoxBGTex ).texture;
    scene.background = BGenv;

    composer.addPass( new RenderPass(scene, camera) )
    composer.addPass( effectSobel );
    composer.addPass( effectPixel );

    pmremGenerator.dispose();

    loadingscreen.classList.add( 'fade-out' );

		// optional: remove loader from DOM via event listener
		loadingscreen.addEventListener( 'transitionend', onTransitionEnd );
  }

  return <div>
  <StyledDiv className="App" ref={threeElement}>
  <section id = 'loading-screen' className='loading-screen'>
    <div className='loader'>
      <img className='svg-icon' src='/tilde-logo.svg'/>
    </div>
  </section>
  </StyledDiv>
  </div>
}

export default MainCanvas
