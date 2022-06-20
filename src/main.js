import './../style.css'
import * as THREE from 'three'
import { PointLight, PointLightHelper } from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Node, NodeFactory } from "./node"
import { NodeLink } from "./node_link"
import { InputHandler } from './input_handler'
import { State } from './state'


const init_game_state = function() {
  const game = {}

  game.scene = new THREE.Scene()
  game.state = new State()

  game.camera =  new THREE.PerspectiveCamera(
    75, // field of view -> in degrees? instead of Rads
    window.innerWidth / window.innerHeight, //Aspect Ratio
    0.1, // start plane of frustrum
    1000 // end plane of frustrum
  )
  game.camera.position.setZ(30)

  game.input_handler = new InputHandler(game)

  game.renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg')
  })
  game.renderer.setPixelRatio(window.devicePixelRatio)
  game.renderer.setSize(window.innerWidth, window.innerHeight)

  return game
}

const game = init_game_state()


const generate_world = function() {
  const geometry = new THREE.PlaneGeometry(100, 100);
  const material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(geometry, material);
  game.scene.add(plane)


  Array.from(Array(6).keys()).forEach((i) => {
    NodeFactory.construct_triangle(game.scene, [20, 20])
  })

  const directionalLight = new THREE.DirectionalLight(0xffffff)
  directionalLight.position.set(10, 10, 10)
  game.scene.add(directionalLight)
}

generate_world(game)


function animate() {
  requestAnimationFrame(animate)
  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;
  game.renderer.render(game.scene, game.camera)

  // controls.update()
}

animate()

