import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import styled from 'styled-components'

import * as GaussianSplats3D from '@mkkellogg/gaussian-splats-3d';
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


  let renderer = useRef();
  let camera = useRef();
  let scene = useRef();
  let fogCol = useRef();
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
    sobelPosIn: 0.2,
    sobelPosOut: 0.7,
    greyscalePosIn: 0.1,
    greyscalePosOut: 0.6,
    pixelPosIn: 0.7,
    pixelPosOut: 1 
  }

  let controlsOn = true;
  
  useEffect(() => {
    texLoader = new THREE.TextureLoader();
    exrLoader = new EXRLoader();

    initScene()
    if (controlsOn){  initControls()  }


    let then = 0;

    const animate = (now) => {

        //get delta time
        now *= 0.001;  // make it seconds
        let delta = now - then;
        then = now;

        if (controlsOn){
          controls.enable = true
          controls.update();
        }
        console.log(camera.position)  

        requestAnimationFrame(animate)
    }
    animate()
  }, [])

  THREE.DefaultLoadingManager.onLoad = function ( ) {
  
    console.log( 'Loading Complete!');
    //skyBoxTex.rotation = Math.PI;
    //const env = pmremGenerator.fromEquirectangular( skyBoxTex ).texture;
    skyBoxBGTex.rotation = Math.PI;
    const BGenv = pmremGenerator.fromEquirectangular( skyBoxBGTex ).texture;
    
    scene.background = BGenv;
    //scene.environment =  env;

    pmremGenerator.dispose();

    loadingscreen.classList.add( 'fade-out' );
		
		// optional: remove loader from DOM via event listener
		loadingscreen.addEventListener( 'transitionend', onTransitionEnd );
    
    };


  const initScene = () => {
    let w = threeElement.current.clientWidth
    let h = threeElement.current.clientHeight
    scene = new THREE.Scene()

    fogCol = new THREE.Color(0xffffff);
    scene.fog = new THREE.FogExp2(fogCol, 0.00005)

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(w, h)
    //renderer.setClearColor('#000')

    threeElement.current.appendChild(renderer.domElement)
    loadingscreen = document.getElementById('loading-screen')

    pmremGenerator = new THREE.PMREMGenerator( renderer );
    pmremGenerator.compileEquirectangularShader();

    camera = new THREE.PerspectiveCamera(50, w / h, .1, 50000)
    const boxColor = 0xBBBBBB;
    const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
    const boxMesh = new THREE.Mesh(boxGeometry, new THREE.MeshBasicMaterial({'color': boxColor}));
    boxMesh.position.set(0, 5, 0);
    scene.add(boxMesh);
    
    camera.position.copy(new THREE.Vector3().fromArray([-8.25, 6.6, -22]));
    camera.up = new THREE.Vector3().fromArray([0, 1, 0]).normalize();
    camera.lookAt(new THREE.Vector3().fromArray([-0.5, 6, -0.5]));
  
    const viewer = new GaussianSplats3D.Viewer({
        'threeScene': scene,
        'selfDrivenMode': true,
        'renderer': renderer,
        'camera': camera,
        'useBuiltInControls': false,
        'ignoreDevicePixelRatio': false,
        'gpuAcceleratedSort': true,
        'enableSIMDInSort': true,
        'sharedMemoryForWorkers': false,
        'integerBasedSort': true,
        'halfPrecisionCovariancesOnGPU': true,
        'dynamicScene': false,
        'webXRMode': GaussianSplats3D.WebXRMode.None,
        'renderMode': GaussianSplats3D.RenderMode.OnChange,
        'sceneRevealMode': GaussianSplats3D.SceneRevealMode.Gradual,
        'antialiased': false,
        'focalAdjustment': 1.0,
        'logLevel': GaussianSplats3D.LogLevel.None,
        'sphericalHarmonicsDegree': 0,
        'enableOptionalEffects': false,
        'plyInMemoryCompressionLevel': 2,
        'freeIntermediateSplatData': false
    });

    //skyBoxTex = exrLoader.load( '/textures/Skybox2k_zip.exr'); 
    skyBoxBGTex = texLoader.load( '/textures/MtTildeSkybox.png');
  
    viewer.addSplatScene('mttilde_postshot_cleaned.splat', {
      'format': GaussianSplats3D.SceneFormat.Splat,
      'rotation': [0, 0, 0, 0],
      'scale': [1, -1, 1],
      'position': [0, 0, 0],
      'progressiveLoad':true
    })
    .then(() => {
        viewer.start();
    });
    // viewer.addSplatScene("mttilde_postshot_cleaned.splat")
    // .then(() => {
    //     viewer.start();
    // });
   
    // window.addEventListener('resize', () => {
    //   resize()
    // })
    // window.addEventListener( 'mousemove', onMouseMove, false );


    // initGUI()
  }

  const initControls = () => {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5
    controls.screenSpacePanning = false
    controls.enableZoom = false

    // controls.minDistance = 100
    // controls.maxDistance = 200

    controls.maxPolarAngle = Math.PI // 2
    controls.panSpeed = 1
    //controls.target = shape.position
    //camera.position.set(camPosHome)
    // camera.lookAt(camPos1)

    // camera.rotation.set(0.11984934600336096, -6.12323399573676, -0.992792090149074)
    controls.update()
    
  }

  const resize = () => {
    let w = threeElement.current.clientWidth
    let h = threeElement.current.clientHeight
    renderer.setSize(w, h)

    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  
  function onTransitionEnd( event ) {

    event.target.remove();
    
  } 

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