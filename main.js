import './style.css'
import * as THREE from 'three'
import { PointLight, PointLightHelper } from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  75, // field of view -> in degrees? instead of Rads
  window.innerWidth / window.innerHeight, //Aspect Ratio
  0.1, // start plane of frustrum
  1000 // end plane of frustrum
)

//Renderer renders to scene
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
})
//geometry == shape basically
const geometry = new THREE.TorusGeometry(10,3,16,20)
//Materials == color &|| texture, a wrapping for a geometry
//Mesh basic materials require no light source bouncing off them

const material = new THREE.MeshStandardMaterial({ color: 0xFF6437})
const pointLight = new THREE.PointLight(0xffffff)
const torus = new THREE.Mesh(geometry, material)
const ambientLight = new THREE.AmbientLight(0xffffff)
pointLight.position.set(5, 5, 5)
const lightHelper = new THREE.PointLightHelper(pointLight)
const gridHelper = new THREE.GridHelper(200, 50)

const controls = new OrbitControls(camera, renderer.domElement)

scene.add(torus)
scene.add(pointLight)
scene.add(ambientLight)
scene.add(lightHelper, gridHelper)
renderer.setPixelRatio(window.devicePixelRatio)

renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.setZ(30)


function animate() {
  requestAnimationFrame(animate)
  // torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  renderer.render(scene, camera)

  controls.update()
}

animate()

