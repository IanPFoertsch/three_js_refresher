import './style.css'
import * as THREE from 'three'
import { PointLight, PointLightHelper } from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Node, NodeFactory } from "./node"
import { NodeLink } from "./node_link"


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


// Raycasting source: https://stackoverflow.com/a/12749287
const raycaster = new THREE.Raycaster()
const clickMouse = new THREE.Vector2()
const mouse = new THREE.Vector2()


var objects = []
const geometry = new THREE.PlaneGeometry(100, 100);
const material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
const plane = new THREE.Mesh(geometry, material);
scene.add(plane)
objects.push(plane)
var link;
var state = {}

window.addEventListener('mousemove', event => {

  if (state.mouse_down == true) {
    var world_coordinates = get_world_intersection(event)
    link.update_destination(world_coordinates.x, world_coordinates.y)

  }
})

window.addEventListener("mousedown", event => {
  var world_coordinates = get_world_intersection(event)

  if (link == undefined) {
    link = new NodeLink(scene)
  }
  link.update_origin(world_coordinates.x, world_coordinates.y)

  state.mouse_down = true
})

window.addEventListener("mouseup", event => {
  var world_coordinates = get_world_intersection(event)
  state.mouse_down = false
})

const get_world_intersection = function(mouse_event) {
  mouse.x = (mouse_event.clientX / window.innerWidth) * 2 - 1
  mouse.y = - (mouse_event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)
  var intersects = raycaster.intersectObjects(objects)
  if (intersects.length > 0) {
    //Currently just selecting the world plane intersection
    //We need to expand this to filter out non-world plane objects
    // We also need to add non-world-plane objects to the object list
    // to make them clickable in an expanded event handler
    return intersects[0].point
  }
}



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

