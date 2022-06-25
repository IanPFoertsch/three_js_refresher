import * as THREE from 'three'
import { State } from './state'
import { InputHandler } from './input_handler'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';


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

    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(this.labelRenderer.domElement);

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  render = function() {
    this.renderer.render(this.scene, this.camera)
    this.labelRenderer.render(this.scene, this.camera)
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