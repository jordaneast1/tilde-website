import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import styled from 'styled-components'

import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import {OutlinePass} from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { LuminosityShaderWithOpacity } from './Shaders/LuminosityShaderWithOpacity';
import { SobelWithOpacity } from '../common/Shaders/SobelWithOpacity';
// import { PixelShader } from 'three/examples/jsm/shaders/PixelShader.js';
import { PixelShader } from './Shaders/PixelShader.js';
import {EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'



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
  let loader = useRef()
  let exrLoader = useRef();

  let viewer = useRef();
  let renderer = useRef();
  let camera = useRef();
  let scene = useRef();
  let mouse = useRef()
  let target = useRef()

  let shape = useRef()

  let fogCol = useRef();
  let composer = useRef()
  let effectSobel = useRef()
  let effectGrayScale = useRef()
  let effect1 = useRef()
  let effectPixel = useRef();
  let skyBoxTex = useRef();
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

  useEffect(() => {
    texLoader = new THREE.TextureLoader();
    exrLoader = new EXRLoader();

    initScene()
    initSnow()

    if (controlsOn){  initControls()  }

    then = 0;

    //animate()
  }, [])

  const animate = (now) => {

    //get delta time
    now *= 0.001;  // make it seconds
    let delta = now - then;
    then = now;
    // update shaders using smoothed scroll position
    scrollPos = THREE.MathUtils.lerp( scrollPos, targetScrollPos, 0.05 );
    // gets clamped time between in and out points
    //add intro fade in
    const fadeInPercentage = THREE.MathUtils.clamp(-0.1 + 2* ((viewer.splatMesh.visibleRegionBufferRadius > 0) ? (viewer.splatMesh.visibleRegionFadeStartRadius / viewer.splatMesh.visibleRegionBufferRadius) : 0), 0, 1);
    let sobelTime = THREE.MathUtils.smoothstep( scrollPos, transitions.sobelPosIn, transitions.sobelPosOut )  + (1 - fadeInPercentage)
    // finds that point on the animation curve
    const sobelPos = sobelCurve.getPoint(sobelTime).y
    params.sobelOpacity = sobelPos;

    const greyscaleTime = THREE.MathUtils.smoothstep(scrollPos, transitions.greyscalePosIn, transitions.greyscalePosOut)
    const greyscalePos = greyscaleCurve.getPoint(greyscaleTime).y;
    params.greyscaleOpacity = greyscalePos;

    // console.log(pos.toFixed(2), greyscaleTime.toFixed(2), greyscalePos.toFixed(2))
    const pixelTime = THREE.MathUtils.smoothstep(scrollPos, transitions.pixelPosIn, transitions.pixelPosOut)
    const pixelPos = pixelCurve.getPoint(pixelTime).y
    const pixelSize = THREE.MathUtils.mapLinear(pixelPos, 0, 1, 1, 32)
    params.greyscaleOpacity = pixelSize;
    
    effectSobel.uniforms[ 'opacity' ].value = sobelPos;
    effectGrayScale.uniforms[ 'opacity' ].value = greyscalePos;
    effectPixel.uniforms[ "pixelSize" ].value = pixelSize;

    // console.log(scrollPos)

    //turn off if at top
    viewer.update();
    //viewer.render(); 
    //composer.render();

    if (( params.enable === true )){

      composer.render();

    } else {

      viewer.render(); 

    }


    if (controlsOn){
      controls.enable = true
      controls.update();
    }
    //console.log(camera.position)  
    animateSnow()


    requestAnimationFrame(animate)
}


  const initScene = () => {
    let w = threeElement.current.clientWidth
    let h = threeElement.current.clientHeight
    scene = new THREE.Scene()

    fogCol = new THREE.Color(0xffffff);
    scene.fog = new THREE.FogExp2(fogCol, 0.00005)

    renderer = new THREE.WebGLRenderer({ antialias: true })
    //renderer.setAnimationLoop()
    renderer.setSize(w, h)
    renderer.setClearColor('#0000')
    renderer.autoClear = true;


    threeElement.current.appendChild(renderer.domElement)
    loadingscreen = document.getElementById('loading-screen')

    pmremGenerator = new THREE.PMREMGenerator( renderer );
    pmremGenerator.compileEquirectangularShader();

    camera = new THREE.PerspectiveCamera(50, w / h, .1, 50000)
    const boxColor = 0xBBBBBB;
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const boxMesh = new THREE.Mesh(boxGeometry, new THREE.MeshBasicMaterial({'color': boxColor}));
    boxMesh.position.set(0, 5, 0);
    // scene.add(boxMesh);
    
    camera.position.copy(new THREE.Vector3().fromArray([-8.25, 6.6, -22]));
    camera.up = new THREE.Vector3().fromArray([0, 1, 0]).normalize();
    camera.lookAt(new THREE.Vector3().fromArray([-0.5, 6, -0.5]));

   //SPLAT STUFF
   viewer = new GaussianSplats3D.Viewer({
      
    'threeScene': scene,
    'selfDrivenMode': false,
    'renderer': renderer,
    'camera': camera,
    'useBuiltInControls': false,
    'ignoreDevicePixelRatio': false,
    'gpuAcceleratedSort': true,
    'enableSIMDInSort': true,
    'sharedMemoryForWorkers': false,
    'integerBasedSort': false,
    'halfPrecisionCovariancesOnGPU': true,
    'dynamicScene': false,
    'webXRMode': GaussianSplats3D.WebXRMode.None,
    'renderMode': GaussianSplats3D.RenderMode.OnChange,
    'sceneRevealMode': GaussianSplats3D.SceneRevealMode.Gradual,
    'antialiased': true,
    'focalAdjustment': 1.0,
    'logLevel': GaussianSplats3D.LogLevel.None,
    'sphericalHarmonicsDegree': 0,
    'enableOptionalEffects': false,
    'plyInMemoryCompressionLevel': 2,
    'freeIntermediateSplatData': false
});

    // postprocessing

    composer = new EffectComposer( viewer.renderer );
    //const scenePass = new RenderPass( scene, camera );
    //composer.addPass( scenePass );

    // const splatPass = new RenderPass(viewer.splatMesh, camera);
    // composer.addPass(splatPass);



    // effect1 = new ShaderPass( DotScreenShader );
    // effect1.uniforms['scale'].value = 4
		// composer.addPass( effect1 );

    // color to grayscale conversion

    effectGrayScale = new ShaderPass( LuminosityShaderWithOpacity );
    effectGrayScale.uniforms[ 'opacity' ].value = 1//params.greyscaleOpacity;

    //composer.addPass( effectGrayScale );

    // you might want to use a gaussian blur filter before
    // the next pass to improve the result of the Sobel operator

    // Sobel operator

    effectSobel = new ShaderPass( SobelWithOpacity );
    effectSobel.uniforms[ 'resolution' ].value.x = window.innerWidth * window.devicePixelRatio;
    effectSobel.uniforms[ 'resolution' ].value.y = window.innerHeight * window.devicePixelRatio;
    effectSobel.uniforms[ 'opacity' ].value = params.sobelOpacity;
    // composer.addPass( effectSobel );

    effectPixel = new ShaderPass( PixelShader );
    effectPixel.uniforms[ "resolution" ].value = new THREE.Vector2( window.innerWidth, window.innerHeight );
    effectPixel.uniforms[ "resolution" ].value.multiplyScalar( window.devicePixelRatio );
    // composer.addPass( effectPixel );

 

    //skyBoxTex = exrLoader.load( '/textures/Skybox2k_zip.exr'); 
    skyBoxBGTex = texLoader.load( '/textures/MtTildeSkybox.png');
  
    viewer.addSplatScene('mttilde_postshot_cleaned.splat', {
      'format': GaussianSplats3D.SceneFormat.Splat,
      'rotation': [0, 0, 0, 0],
      'scale': [1, -1, 1],
      'position': [0, 0, 0],
      'progressiveLoad':true,
      'showLoadingUI':false
    })
    .then(() => {
      //renderer.setAnimationLoop( animate );
       animate()
    });

    // viewer.addSplatScene("mttilde_postshot_cleaned.splat")
    // .then(() => {
    //     viewer.start();
    // });
   
    window.addEventListener('resize', () => {
      resize(threeElement)
    })
    // window.addEventListener( 'mousemove', onMouseMove, false );

    window.addEventListener('scroll', handleScroll)


  }

  const initControls = () => {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.075
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.3
    controls.screenSpacePanning = false
    controls.enableZoom = false

    // controls.minDistance = 100
    // controls.maxDistance = 200

    controls.maxPolarAngle = Math.PI / 2.2
    controls.panSpeed = 1
    //controls.target = shape.position
    //camera.position.set(camPosHome)
    // camera.lookAt(camPos1)

    // camera.rotation.set(0.11984934600336096, -6.12323399573676, -0.992792090149074)
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
    // console.log("target pos: "+targetScrollPos.toFixed(3) + ", lerped pos: "+scrollPos.toFixed(3));
  }
  
  const getVerticalScrollNormalised = ( elm ) => {
    var p = elm.parentNode
    return (elm.scrollTop || p.scrollTop) / (p.scrollHeight - p.clientHeight )
  }


  
  function onTransitionEnd( event ) {

    event.target.remove();
    
  } 

  //LOADING

  THREE.DefaultLoadingManager.onLoad = function ( ) {
  
    console.log( 'Loading Complete!');
    //skyBoxTex.rotation = Math.PI;
    //const env = pmremGenerator.fromEquirectangular( skyBoxTex ).texture;
    skyBoxBGTex.rotation = Math.PI;
    const BGenv = pmremGenerator.fromEquirectangular( skyBoxBGTex ).texture;
    //scene.background = BGenv;
    viewer.renderer.autoClear = true
    scene.add(viewer.splatMesh)
    const splatPass = new RenderPass(scene, camera);
    
    //const outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
   // outlinePass.renderToScreen = true;
    // splatPass.renderToScreen = false;

    // outlinePass.selectedObjects = selectedObjects;
    
    scene.background = BGenv;
    const skyPass = new RenderPass(scene, camera);

    composer.addPass( skyPass)

    composer.addPass( splatPass)

   // composer.addPass(outlinePass)

    composer.addPass( effectSobel );
    composer.addPass( effectPixel );

    pmremGenerator.dispose();

    loadingscreen.classList.add( 'fade-out' );
		
		// optional: remove loader from DOM via event listener
		loadingscreen.addEventListener( 'transitionend', onTransitionEnd );
    
    };

  THREE.DefaultLoadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {

    // console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
  
  };
    
  
  THREE.DefaultLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
  
    // console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
  
  };
  
  THREE.DefaultLoadingManager.onError = function ( url ) {
  
    console.log( 'There was an error loading ' + url );
  
  };

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

//create loading screen
// loadingscreen = document.createElement('section')
// loadingscreen.className = 'loading-screen'
// threeElement.current.appendChild(loadingscreen)
// var loadingscreenicon = document.createElement('div')
// loadingscreenicon.className = 'loader'
// loadingscreen.appendChild(loadingscreenicon)
// var svg = document.createElement('img')
// svg.classList = 'svg-icon'
// svg.src = '/tilde-logo.svg'
// loadingscreenicon.appendChild(svg)