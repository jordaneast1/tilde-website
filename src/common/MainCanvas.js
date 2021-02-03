import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Sky } from 'three/examples/jsm/objects/Sky.js'
import styled from 'styled-components'
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const StyledDiv = styled.div`
  overflow: hidden;
  position: fixed;
  width: 100%;
  height: 100%;
  
`

const MainCanvas = () => {
  const threeElement = useRef()
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

  useEffect(() => {

    mouse = new THREE.Vector2();
    target = new THREE.Vector2();

    initScene()
    initGeo()
    initControls()
    initLights()
    loadPlane()
    initTerrain()
    initSky()

    const animate = () => {
      renderer.render(scene, camera)
      shape.rotation.x += 0.01
      shape.rotation.y += 0.02
      updateSun()

      //  let target = new THREE.Vector2();
      // target.x = ( 1 - mouse.x ) * 0.002;
      // target.y = ( 1 - mouse.y ) * 0.002;
      
      // camera.rotation.x += .005  * ( target.y - camera.rotation.x );
      // camera.rotation.y += .005  * ( target.x - camera.rotation.y );
      controls.update();

      requestAnimationFrame(animate)
    }
    animate()
  }, [])

  const resize = () => {
    let w = threeElement.current.clientWidth
    let h = threeElement.current.clientHeight
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  const initScene = () => {
    let w = threeElement.current.clientWidth
    let h = threeElement.current.clientHeight
    scene = new THREE.Scene()
    fogCol = new THREE.Color(0xffffff);
    scene.fog = new THREE.FogExp2(fogCol, 0.0005)

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(w, h)
    renderer.setClearColor('#000')

    //camera
    camera = new THREE.PerspectiveCamera(50, w / h, 1, 10000)

    threeElement.current.appendChild(renderer.domElement)
    window.addEventListener('resize', () => {
      resize()
    })
    window.addEventListener( 'mousemove', onMouseMove, false );
  }

  const initControls = () => {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05
    controls.autoRotate = true

    controls.screenSpacePanning = false
    controls.enableZoom = false

    controls.minDistance = 300
    controls.maxDistance = 1000

    controls.maxPolarAngle = Math.PI / 2

    camera.position.y = 5000
    camera.position.z = 1000
    controls.target = shape.position
    controls.update()
  }

  const initLights = () => {
    //lights
    const lightA = new THREE.PointLight(0xffffff, 0.25)
    lightA.position.set(500, 500, 500)
    scene.add(lightA)

    const lightB = new THREE.PointLight(0xffffff, 0.25)
    lightB.position.set(-500, -500, -500)
    scene.add(lightB)
  }

  const initGeo = () => {
    //geo
    const geometry = new THREE.SphereGeometry(50, 20, 10)
    const material = new THREE.MeshPhongMaterial({ flatShading: true })
    shape = new THREE.Mesh(geometry, material)
    shape.position.set(0,500,0)
    scene.add(shape)
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
    scene.add(planeMesh)
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
    sunParameters.azimuth = (sunParameters.azimuth+0.0005)%1;
    var t = 1 - sunParameters.azimuth;
    //console.log(t); 
    fogCol = new THREE.Color(t,t,t)
    scene.fog = new THREE.FogExp2(fogCol, 0.0005)
    

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

  function generateHeight(width, height) {
    var size = width * height,
      data = new Uint8Array(size),
      perlin = new ImprovedNoise(),
      quality = 1,
      z = Math.random() * 100

    for (var j = 0; j < 4; j++) {
      for (var i = 0; i < size; i++) {
        var x = i % width,
          y = ~~(i / width)
        data[i] += Math.abs(
          perlin.noise(x / quality, y / quality, z) * quality * 1.75
        )
      }

      quality *= 5
    }

    return data
  }

  function generateTexture(data, width, height) {
    var canvas, canvasScaled, context, image, imageData, vector3, sun, shade

    vector3 = new THREE.Vector3(0, 0, 0)

    sun = new THREE.Vector3(1, 1, 1)
    sun.normalize()

    canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    context = canvas.getContext('2d')
    context.fillStyle = '#000'
    context.fillRect(0, 0, width, height)

    image = context.getImageData(0, 0, canvas.width, canvas.height)
    imageData = image.data

    for (var i = 0, j = 0, l = imageData.length; i < l; i += 4, j++) {
      vector3.x = data[j - 2] - data[j + 2]
      vector3.y = 2
      vector3.z = data[j - width * 2] - data[j + width * 2]
      vector3.normalize()

      shade = vector3.dot(sun)

      imageData[i] = (96 + shade * 128) * (0.5 + data[j] * 0.007)
      imageData[i + 1] = (32 + shade * 96) * (0.5 + data[j] * 0.007)
      imageData[i + 2] = shade * 96 * (0.5 + data[j] * 0.007)
    }

    context.putImageData(image, 0, 0)

    // Scaled 4x

    canvasScaled = document.createElement('canvas')
    canvasScaled.width = width * 4
    canvasScaled.height = height * 4

    context = canvasScaled.getContext('2d')
    context.scale(4, 4)
    context.drawImage(canvas, 0, 0)

    image = context.getImageData(0, 0, canvasScaled.width, canvasScaled.height)
    imageData = image.data

    var seed = 0.1;
    for (var i = 0, l = imageData.length; i < l; i += 4) {
      var v = ~~(seed)

      imageData[i] += v
      imageData[i + 1] += v
      imageData[i + 2] += v
    }

    context.putImageData(image, 0, 0)

    return canvasScaled
  }

  const initTerrain = () => {
    var worldWidth = 256,
      worldDepth = 256
    var worldHalfWidth = worldWidth / 2
    var worldHalfDepth = worldDepth / 2
    var data = generateHeight(worldWidth, worldDepth)

    camera.position.y =
      data[worldHalfWidth + worldHalfDepth * worldWidth] * 10 + 500

    var geometry = new THREE.PlaneBufferGeometry(
      7500,
      7500,
      worldWidth - 1,
      worldDepth - 1
    )
    geometry.rotateX(-Math.PI / 2)

    var vertices = geometry.attributes.position.array

    for (var i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      vertices[j + 1] = data[i] * 10
    }

    var texture = new THREE.CanvasTexture(
      generateTexture(data, worldWidth, worldDepth)
    )
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping

    var mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({ map: texture })
    )
    scene.add(mesh)
  }

  const onMouseMove = (event) => {
    let w = threeElement.current.clientWidth
    let h = threeElement.current.clientHeight
    let windowHalf = ( w / 2, h / 2 );
    mouse.x = ( event.clientX - windowHalf );
    mouse.y = ( event.clientY - windowHalf );
    //console.log(mouse.x, mouse.y)
  
  }

  return <StyledDiv className="App" ref={threeElement} />
}

export default MainCanvas
