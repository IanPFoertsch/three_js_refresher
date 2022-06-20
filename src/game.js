import * as THREE from 'three'
import { State } from './state'
import { InputHandler } from './input_handler'

class Game {
  constructor() {
    this.scene = new THREE.Scene()
    this.state = new State()

    this.camera = new THREE.PerspectiveCamera(
      75, // field of view -> in degrees? instead of Rads
      window.innerWidth / window.innerHeight, //Aspect Ratio
      0.1, // start plane of frustrum
      1000 // end plane of frustrum
    )
    this.camera.position.setZ(30)

    this.input_handler = new InputHandler(this)

    this.renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#bg')
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  add_world_plane = function(plane) {
    this.scene.add(plane)
    this.state.register_world_plane(plane)
  }

  add_node = function(node) {
    // this.scene.add(node)
    this.state.register_node(node)
  }

  add_light = function(light) {
    this.scene.add(light)
  }

}

export { Game }