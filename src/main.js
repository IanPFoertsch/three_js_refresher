import './../style.css'
import * as THREE from 'three'
import { PointLight, PointLightHelper } from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Node, NodeFactory } from "./node"
import { NodeLink } from "./node_link"
import { InputHandler } from './input_handler'
import { State } from './state'


const scene = new THREE.Scene()
const state = new State()
const handler = new InputHandler(scene, state)


//Renderer renders to scene
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg')
})

var objects = []
const geometry = new THREE.PlaneGeometry(100, 100);
const material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
const plane = new THREE.Mesh(geometry, material);
scene.add(plane)
objects.push(plane)





//Draw six circles
Array.from(Array(6).keys()).forEach((i) => {

  // var node = new Node(scene, i)
  NodeFactory.construct_triangle(scene, [20,20])
})

// const pointLight = new THREE.PointLight(0xffffff)

// const ambientLight = new THREE.AmbientLight(0xffffff)
const directionalLight = new THREE.DirectionalLight(0xffffff)
directionalLight.position.set(10,10,10)

// pointLight.position.set(5, 5, 5)
// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50)

// const controls = new OrbitControls(camera, renderer.domElement)


scene.add(directionalLight)

// scene.add(pointLight)
// scene.add(ambientLight)
// scene.add( gridHelper)
renderer.setPixelRatio(window.devicePixelRatio)

renderer.setSize(window.innerWidth, window.innerHeight)
state.camera.position.setZ(30)


function animate() {
  requestAnimationFrame(animate)
  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;
  renderer.render(scene, state.camera)

  // controls.update()
}

animate()

