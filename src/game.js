import * as THREE from 'three'
import { State } from './state'
import { InputHandler } from './input_handler'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { Economy } from './economy';
import { Node } from './node'


class Game {
  constructor() {
    this.scene = new THREE.Scene()
    this.state = new State()

    window.state = this.state


    this.camera = new THREE.PerspectiveCamera(
      75, // field of view -> in degrees? instead of Rads
      window.innerWidth / window.innerHeight, //Aspect Ratio
      0.1, // start plane of frustrum
      1000 // end plane of frustrum
    )
    this.camera.position.setZ(30)

    this.input_handler = new InputHandler(this)

    this.renderer = new THREE.WebGLRenderer({
      // canvas: document.querySelector('#bg')
    })
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)


    this.currency_score = document.querySelector("#info #currency")
    this.currency_score.innerHTML = 100
    window.setInterval(() => {

      this.update_economy()
    }, 1000)




    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(this.labelRenderer.domElement);

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  update_economy = function() {
    var player_income = 0
    this.state.links.forEach(link => {
      player_income += link.get_link_value()
    });

    var player_currency = parseInt(this.currency_score.innerHTML)
    player_currency = player_currency + player_income
    this.currency_score.innerHTML = player_currency

    var colors_supplied = Object.values(Node.COLORS).reduce((supply_for_color, color) => {

      supply_for_color[color] = 0
      return supply_for_color
    }, {})

    this.state.links.forEach(link => {
      colors_supplied[link.get_color_supplied()] += link.get_quantity_supplied()
    })

    this.state.economy.set_prices(colors_supplied)
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