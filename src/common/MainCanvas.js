 
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js'
import styled from 'styled-components'
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader'


import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { LuminosityShaderWithOpacity } from './Shaders/LuminosityShaderWithOpacity';
import { SobelWithOpacity } from '../common/Shaders/SobelWithOpacity';
import { PixelShader } from 'three/examples/jsm/shaders/PixelShader.js';
// import { PMREMGenerator } from 'three/examples/jsm/environments'
import { Color, Object3D } from 'three/build/three.module'
import {Text} from 'troika-three-text'
import {EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'


const StyledDiv = styled.div`
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
  
`

const MainCanvas = () => {

  const threeElement = useRef()
  let texLoader = useRef();
  let loader = useRef()
  let renderer = useRef()
  let camera = useRef()
  let controls = useRef()
  let scene = useRef()
  let shape = useRef()
  let sky = useRef()
  let sunParameters = useRef()
  let sunLight = useRef()
  let cubeCamera = useRef()
  let mouse = useRef()
  let target = useRef()
  let fogCol = useRef()
  let composer = useRef()
  let effectSobel = useRef()
  let effectGrayScale = useRef()
  let effectPixel = useRef();
  let skyBoxTex = useRef();
  let pmremGenerator = useRef();
  let landscape = useRef();
  let text1 = useRef();
  let exrLoader = useRef();

  const params = {
    enable: true,
    sobelOpacity: 0.0,
    greyscaleOpacity: 0.0,
    pixelSize: 2.0,
    enableOrbitControls: true
  };

  const transitions = {
    sobelPosIn: 0.2,
    sobelPosOut: 0.7,
    greyscalePosIn: 0.1,
    greyscalePosOut: 0.6,
    pixelPosIn: 0.7,
    pixelPosOut: 1 
  }

  let controlsOn = false;

  let targetScrollPos = 0;
  let scrollPos = 0;

  const sobelCurve = new THREE.CubicBezierCurve(new THREE.Vector2(0,0),new THREE.Vector2(0,1.5),new THREE.Vector2(0,2),new THREE.Vector2(0,0));
  const greyscaleCurve = new THREE.CubicBezierCurve(new THREE.Vector2(0,0),new THREE.Vector2(0,1),new THREE.Vector2(0,1),new THREE.Vector2(0,0));
  const pixelCurve = new THREE.CubicBezierCurve(new THREE.Vector2(0,0),new THREE.Vector2(0,1),new THREE.Vector2(0,1),new THREE.Vector2(0,1));

  let selectedObject = null;
  let group;
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();

  let pos1 = new THREE.Object3D();
  let pos2 = new THREE.Object3D();
  let pos3 = new THREE.Object3D();
  pos1.position.set(100,550,-4000);
  pos2.position.set(-300,150,-1000);
  pos3.position.set(3500,150,-6000);

  let raycasted = []


  useEffect(() => {

    mouse = new THREE.Vector2();
    target = new THREE.Vector2();

    loader = new FBXLoader();
    texLoader = new THREE.TextureLoader();
    exrLoader = new EXRLoader();


    initScene()
    initLights()
    initInteraction()
    initGeo()
    initLandscape()
    initText()
    if (controlsOn){  initControls()  }
    loadPlane()
    //initTerrain()
    //initSky()

    let then = 0;
    const animate = (now) => {

      //get delta time
      now *= 0.001;  // make it seconds
      let delta = now - then;
      then = now;

      // update shaders using smoothed scroll position
      scrollPos = THREE.MathUtils.lerp( scrollPos, targetScrollPos, 0.05 );
      // gets clamped time between in and out points
      const sobelTime = THREE.MathUtils.smoothstep( scrollPos, transitions.sobelPosIn, transitions.sobelPosOut ) 
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

      //console.log(sobelTime)

      //turn off if at top
      if (( params.enable === true ) && (sobelTime > 0)){

        composer.render();

      } else {

        renderer.render( scene, camera );

      }

      shape.rotation.y += 0.002

      //updateSun()

      //  let target = new THREE.Vector2();
      // target.x = ( 1 - mouse.x ) * 0.002;
      // target.y = ( 1 - mouse.y ) * 0.002;
      
      // camera.rotation.x += .005  * ( target.y - camera.rotation.x );
      // camera.rotation.y += .005  * ( target.x - camera.rotation.y );
      var vec = new THREE.Vector3();
      camera.getWorldDirection(vec)

      if (controlsOn){
        controls.enable = params.enableOrbitControls
        controls.update();
      }
      text1.setRotationFromMatrix(camera.matrix)
      text1.sync()

      TWEEN.update()
      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  THREE.DefaultLoadingManager.onLoad = function ( ) {
  
    console.log( 'Loading Complete!');
    skyBoxTex.rotation = Math.PI;
    const env = pmremGenerator.fromEquirectangular( skyBoxTex ).texture;
    
    scene.background = env;
    scene.environment =  env;
    
    landscape.traverse( function ( child ) {

      if ( child.isMesh ) {
        child.material.envMap = env;
        child.material.needsUpdate = true
        console.log(child.name, child.material.color)

      }
    });

    pmremGenerator.dispose();
  
  };

  const initScene = () => {
    let w = threeElement.current.clientWidth
    let h = threeElement.current.clientHeight
    scene = new THREE.Scene()

    fogCol = new THREE.Color(0xffffff);
    scene.fog = new THREE.FogExp2(fogCol, 0.00015)

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(w, h)
    //renderer.setClearColor('#000')

    pmremGenerator = new THREE.PMREMGenerator( renderer );
    pmremGenerator.compileEquirectangularShader();

    skyBoxTex = exrLoader.load( '/textures/Skybox2k_zip.exr');

    //camera
    camera = new THREE.PerspectiveCamera(50, w / h, .01, 20000)
   
    threeElement.current.appendChild(renderer.domElement)
    window.addEventListener('resize', () => {
      resize()
    })
    // window.addEventListener( 'mousemove', onMouseMove, false );
    window.addEventListener('scroll', handleScroll)

    // postprocessing

    composer = new EffectComposer( renderer );
    const renderPass = new RenderPass( scene, camera );
    composer.addPass( renderPass );

    // color to grayscale conversion

    effectGrayScale = new ShaderPass( LuminosityShaderWithOpacity );
    effectGrayScale.uniforms[ 'opacity' ].value = params.greyscaleOpacity;

    composer.addPass( effectGrayScale );

    // you might want to use a gaussian blur filter before
    // the next pass to improve the result of the Sobel operator

    // Sobel operator

    effectSobel = new ShaderPass( SobelWithOpacity );
    effectSobel.uniforms[ 'resolution' ].value.x = window.innerWidth * window.devicePixelRatio;
    effectSobel.uniforms[ 'resolution' ].value.y = window.innerHeight * window.devicePixelRatio;
    effectSobel.uniforms[ 'opacity' ].value = params.sobelOpacity;
    composer.addPass( effectSobel );

    effectPixel = new ShaderPass( PixelShader );
    effectPixel.uniforms[ "resolution" ].value = new THREE.Vector2( window.innerWidth, window.innerHeight );
    effectPixel.uniforms[ "resolution" ].value.multiplyScalar( window.devicePixelRatio );
    composer.addPass( effectPixel );

    initGUI()
  }

  const initGUI = () => {
    const gui = new GUI();

    gui.add( params, 'enable' );
    var sobelOpacitySlider =  gui.add( params, 'sobelOpacity', 0, 1);
    var greyscaleOpacitySlider = gui.add( params, 'greyscaleOpacity', 0, 1);
    var pixelSlider = gui.add( params, 'pixelSize' ).min( 2 ).max( 32 ).step( 2 );

    const camFolder = gui.addFolder('Camera')
    const camPos = camFolder.addFolder('Position')
    const camRot = camFolder.addFolder('Rotation')
    camFolder.add( params, 'enableOrbitControls' );
    camRot.add(camera.rotation, 'x', 0, Math.PI * 2).step(0.1)
    camRot.add(camera.rotation, 'y', 0, Math.PI * 2).step(0.1)
    camRot.add(camera.rotation, 'z', 0, Math.PI * 2).step(0.1)
    camPos.add(camera.position, 'x', -3000, 3000).step(0.1)
    camPos.add(camera.position, 'y', -3000, 3000).step(0.1)
    camPos.add(camera.position, 'z', -3000, 3000).step(0.1)
    
    // const objFolder = gui.addFolder('Objects')
    // objFolder.add(pos1.position, 'x', -3000, 3000).step(0.1)
    // objFolder.add(pos1.position, 'y', -3000, 3000).step(0.1)
    // objFolder.add(pos1.position, 'z', -3000, 3000).step(0.1)

    gui.open();
    
    sobelOpacitySlider.onChange(function(value){
      effectSobel.uniforms[ 'opacity' ].value = params.sobelOpacity;
    });

    greyscaleOpacitySlider.onChange(function(value){
      effectGrayScale.uniforms[ 'opacity' ].value = params.greyscaleOpacity;
    });

    pixelSlider.onChange(function(value){
      effectPixel.uniforms[ 'pixelSize' ].value = params.pixelSize;
    });
  }


  const initInteraction = () => {
    group = new THREE.Group();
    scene.add( group );
    const spriteTex = texLoader.load( '/textures/Circle1.png' );
		const sprite1 = new THREE.Sprite( new THREE.SpriteMaterial( { map: spriteTex, color: '#fff' , sizeAttenuation: false} ) );
    sprite1.position.set(0,10,10);
    sprite1.scale.set( .07, .07 ,.07 );
    pos1.add( sprite1 );
    group.add( pos1 )

    const sprite2 = new THREE.Sprite( new THREE.SpriteMaterial( { map: spriteTex, color: '#fff', sizeAttenuation: false } ) );
    sprite2.material.rotation = Math.PI / 3 * 4;
    sprite2.position.set( 8, - 2, 2 );
    sprite2.center.set( 0.5, 0 );
    sprite2.scale.set(.1, .1, .1 );
    pos2.add( sprite2 );
    group.add( pos2 )

    const sprite3 = new THREE.Sprite( new THREE.SpriteMaterial( {map: spriteTex, color: '#fff' , sizeAttenuation: false} ) );
    sprite3.position.set( 0, 2, 5 );
    sprite3.scale.set( .1, .1, .1 );
    sprite3.center.set( - 0.1, 0 );
    sprite3.material.rotation = Math.PI / 3;
    pos3.add( sprite3 );
    group.add( pos3 )

    raycasted = [sprite1,sprite2,sprite3]
    document.addEventListener( 'pointermove', onPointerMove );

  }

  //pointer interaction
  function onPointerMove( event ) {

    if ( selectedObject ) {
      selectedObject.material.color.set( '#fff' );
      selectedObject = null;
    }

    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( pointer, camera );
    const intersects = raycaster.intersectObjects( raycasted, true );

    if ( intersects.length > 0 ) {
      const res = intersects.filter( function ( res ) {
        return res && res.object;
      } )[ 0 ];
      if ( res && res.object ) {
        selectedObject = res.object;
        selectedObject.material.color.set( '#69f' );
        
        let tweener = {x:.1}
        new TWEEN.Tween(tweener).to({x:.2}, 1000).easing(TWEEN.Easing.Quadratic.Out).onUpdate(() => {
          //selectedObject.scale.set(tweener.x,tweener.x,tweener.x)
        })
        .start() // Start the tween immediately.


      }
    }
  }

  const initText = () => {
    const robotolight = "/Roboto-Light.ttf"//https://fonts.googleapis.com/css2?family=Roboto:wght@300"
    text1 = new Text()
    pos1.add(text1)
    text1.position.set(0,450,0)
    // Set properties to configure:
    text1.text = 'WORK'
    text1.anchorX = 'center'
    text1.fontSize = 200
    text1.color = 0xFFFFFF
    text1.letterSpacing = .2
    text1.font = robotolight
    text1.setRotationFromMatrix(camera.matrix)
    text1.sync()
  }

  //init functions

  const initControls = () => {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05
    controls.autoRotate = false

    controls.screenSpacePanning = false
    controls.enableZoom = false

    controls.minDistance = 100
    controls.maxDistance = 200

    controls.maxPolarAngle = Math.PI // 2
    controls.panSpeed = 10
    //controls.target = shape.position
    camera.position.set(282.7908329, 1.21828,  -40.18255)
    camera.rotation.set(0.11984934600336096, -6.12323399573676, -0.992792090149074)
    controls.update()
    
  }

  const initLights = () => {
    //lights
    const lightA = new THREE.DirectionalLight( new THREE.Color("rgb(255,216,148)"), .7);
    lightA.castShadow = true;
    lightA.position.set(85.473, 223, 256)
    scene.add(lightA)

  }

  const initGeo = () => {
    //geo
    shape = new Object3D();

		loader.load( '/models/TildeLogo2.fbx', function ( object ) {
      
      const tildealbedo = texLoader.load( '/textures/tefmajbn_4K_Albedo.jpg');
      const tilderoughness = texLoader.load( '/textures/tefmajbn_4K_Roughness.jpg' );
      // console.log(texture)
      shape.add(object);
      // const material = new THREE.MeshPhysicalMaterial({roughness:0.8, map:tildealbedo, metalness: 0.5, reflectivity: 0.6})
      // object.material = material;
      object.traverse( function ( child ) {

        if ( child.isMesh ) {
          const material = new THREE.MeshPhysicalMaterial({color: new THREE.Color(0x4), roughness:0.9, roughnessMap: tilderoughness, map:tildealbedo, metalness: 0.3, reflectivity: 0.1})
          child.material = material // assign your diffuse texture here
      
        }
      });
    });
    shape.scale.set(7,7,7)
    shape.position.set(0,350,-3500)

    scene.add(shape)

  }

  const initLandscape = () => {
    //geo
    landscape = new Object3D();

    texLoader.load( '/textures/MtTildeSliced_Albedo.jpg', function (landscapeAlbedo) {
      const ao = texLoader.load( '/textures/MtTilde_AO.jpg')
      const normal = texLoader.load( '/textures/MtTilde_Normal.jpg')

      loader.load( '/models/MtTildeSliced.fbx', function ( object ) {
                
        console.log(landscapeAlbedo)
        landscapeAlbedo.wrapS = THREE.RepeatWrapping;
        landscapeAlbedo.wrapT = THREE.RepeatWrapping;
        landscape.add(object);
        object.traverse( function ( child ) {

          if ( child.isMesh ) {
            const material = new THREE.MeshPhysicalMaterial(
              { color: new THREE.Color('white'), 
                aoMap: ao, aoMapIntensity: 1,
                normalMap: normal, normalScale: new THREE.Vector2(.3,.3), 
                envMapIntensity:1, 
                roughness:1, 
                map:landscapeAlbedo, 
                metalness:0, 
                reflectivity: 0}
            )
            material.receiveShadow = true
            child.material = material // assign your diffuse texture here
            child.material.needsUpdate = true
          }
        });

      });

      landscape.scale.set(10,10,10)
      landscape.rotation.set(0,0,0)
      landscape.position.set(0,0,0)
    

      scene.add(landscape)
    });

  }

  

  const loadPlane = () => {
    const planeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xaa99bb,
      metalness: 0,
      roughness: 0.6,
      opacity: 1,
      side: THREE.DoubleSide,
      transparent: false,
      envMapIntensity: 3,
      premultipliedAlpha: true,
    })
    const geometry = new THREE.PlaneBufferGeometry(400, 400)
    const planeMesh = new THREE.Mesh(geometry, planeMaterial)
    planeMesh.receiveShadow = true
    planeMesh.rotation.set(THREE.MathUtils.degToRad(90), 0, 0)
    //scene.add(planeMesh)
  }

  const initSky = () => {
    sunLight = new THREE.DirectionalLight(0xffffff, 1)
    scene.add(sunLight)

    sky = new Sky()

    var uniforms = sky.material.uniforms

    uniforms['turbidity'].value = 10
    uniforms['rayleigh'].value = 2
    // uniforms['luminance'].value = 1
    uniforms['mieCoefficient'].value = 0.005
    uniforms['mieDirectionalG'].value = 0.8

    sunParameters = {
      distance: 400,
      inclination: 0.2,
      azimuth: 0,
    }
    var cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 128, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );
    cubeCamera = new THREE.CubeCamera(0.1, 1, cubeRenderTarget)
    cubeCamera.renderTarget.texture.generateMipmaps = true
    cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter

    scene.background = cubeCamera.renderTarget

    updateSun()
  }

  const updateSun = () => {
    //day/night cycle
    sunParameters.azimuth = scrollPos;//(sunParameters.azimuth+0.0002)%1;
    var t = 1 - sunParameters.azimuth;
    // console.log(t); 

    
    fogCol = new THREE.Color(scrollPos,scrollPos,scrollPos);
    //scene.fog.color.set(fogCol)

    var theta = Math.PI * (sunParameters.inclination - 0.5)
    var phi = 2 * Math.PI * (sunParameters.azimuth - 0.5)

    sunLight.position.x = sunParameters.distance * Math.cos(phi)
    sunLight.position.y =
      sunParameters.distance * Math.sin(phi) * Math.sin(theta)
    sunLight.position.z =
      sunParameters.distance * Math.sin(phi) * Math.cos(theta)

    sky.material.uniforms['sunPosition'].value = sunLight.position.copy(
      sunLight.position
    )

    cubeCamera.update(renderer, sky)
  }

// UTILITY FNCT
  const onMouseMove = (event) => {
    let w = threeElement.current.clientWidth
    let h = threeElement.current.clientHeight
    let windowHalf = ( w / 2, h / 2 );
    mouse.x = ( event.clientX - windowHalf );
    mouse.y = ( event.clientY - windowHalf );
    //console.log(mouse.x, mouse.y)
  
  }
  
  const handleScroll = () => { 
    targetScrollPos = getVerticalScrollNormalised(document.body)
    //console.log("target pos: "+targetScrollPos.toFixed(3) + ", lerped pos: "+scrollPos.toFixed(3));
  }
  
  const getVerticalScrollNormalised = ( elm ) => {
    var p = elm.parentNode
    return (elm.scrollTop || p.scrollTop) / (p.scrollHeight - p.clientHeight )
  }

 


  const resize = () => {
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


  THREE.DefaultLoadingManager.onStart = function ( url, itemsLoaded, itemsTotal ) {

    console.log( 'Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
  
  };
    
  
  THREE.DefaultLoadingManager.onProgress = function ( url, itemsLoaded, itemsTotal ) {
  
    console.log( 'Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.' );
  
  };
  
  THREE.DefaultLoadingManager.onError = function ( url ) {
  
    console.log( 'There was an error loading ' + url );
  
  };

  return <StyledDiv className="App" ref={threeElement} />
}

export default MainCanvas
