import './style.css'
import * as THREE from 'three'
import { PointLight, PointLightHelper } from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Node, NodeFactory } from "./node"


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


// Source: https://www.youtube.com/watch?v=a0qSHBnqORU
const raycaster = new THREE.Raycaster()
const clickMouse = new THREE.Vector2()
const moveMouse = new THREE.Vector2()
var draggable = new THREE.Object3D()

window.addEventListener('click', event => {
  //source: https://threejs.org/docs/#api/en/core/Raycaster
	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components
  clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  clickMouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(clickMouse, camera)
  const found = raycaster.intersectObjects(scene.children)
  console.log(found)
})


//Draw three circles
Array.from(Array(3).keys()).forEach((i) => {
  console.log("iterating for ", i, " x, y = ", Math.sin(i))
  // var node = new Node(scene, i)
  NodeFactory.construct_triangle(scene, [20,20])
})




// Need the node class to have an inner icon and color
// Need a node shape class




//Materials == color &|| texture, a wrapping for a geometry
//Mesh basic materials require no light source bouncing off them


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
camera.position.setZ(30)


function animate() {
  requestAnimationFrame(animate)
  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;
  renderer.render(scene, camera)

  // controls.update()
}

animate()

