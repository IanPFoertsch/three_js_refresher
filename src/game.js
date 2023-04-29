import * as THREE from 'three'
import { State } from './state'
import { InputHandler } from './input_handler'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { Economy, GlobalSupply } from './economy';
import { Node } from './node'
import { config } from '../app.config'


class Game {
  constructor() {
    this.node_counter = 0;
    window.scene = new THREE.Scene()
    this.state = new State()
    window.state = this.state
    window.game = this
    this.camera = new THREE.PerspectiveCamera(
      75, // field of view -> in degrees? instead of Rads
      window.innerWidth / window.innerHeight, //Aspect Ratio
      0.1, // start plane of frustrum
      1000 // end plane of frustrum
    )
    this.camera.position.setZ(30)

    this.input_handler = new InputHandler(this)

    this.renderer = new THREE.WebGLRenderer({})
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(this.renderer.domElement)


    this.currency_score = document.querySelector("#info #currency")
    this.currency_score.innerHTML = 100
    console.log("setting the update_economy interval")
    window.setInterval(() => {
      this.update_economy()
      this.update_information_panel()
    }, 3000)

    //TODO: Ideally we'll be performing these graph updates
    // on the animation loop to make them smoother.
    // Also, we should offload the force calculations to a separate thread to improve

    window.setInterval(() => {
      if (config.graph.enable_force_directed_graph) {
        this.state.get_graph().update_node_forces()
      }
    }, 10)


    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(this.labelRenderer.domElement);

    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)

    //TODO: This belongs in some kind of view manager class
    window.addEventListener('resize', this.on_window_resize.bind(this), false);
  }

  on_window_resize = function () {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);

  }

  //TODO: rename to "Update game state" as we
  // are doing more than economic updates now
  update_economy = function() {
    this.state.economy.update(this.state)

    //TODO: We should build this functionally on initialization, as these config values won't be changing
    // within a particular game run
    if (config.graph.create_nodes) {
      this.generate_new_nodes()
    }

    if (config.graph.destroy_nodes) {
      this.eliminate_unsupplied_nodes()
    }
  }

  generate_new_nodes() {
    //Can we consolidate this logic somewhere. Is there a better abstraction for economic updates?
    var nodes_to_create = this.state.economy.get_node_creation()
    nodes_to_create.forEach((node_color) => {
      var colors_demanding = Node.COLOR_OUTPUT[node_color]

      var random_color = colors_demanding[Math.floor(Math.random() * colors_demanding.length)]

      //create a new node at a random location... what teir exactly? just make it tier 4
      //TODO: Nodes will be placed randomly but should move via a force directed graph algorithm
      this.add_node(
        new Node(
          [(Math.random() * 20 - 10), (Math.random() * 20 - 10)],
          random_color,
          Node.TIERS.FOUR
        )
      )
    })
  }

  eliminate_unsupplied_nodes() {
    var overpriced_colors = this.state.economy.get_node_deletion()

    //get all unsupplied nodes demanding that color
    var colors_to_destroy = [
      ...new Set(
        overpriced_colors.map((node_color) => {
          return Node.COLOR_OUTPUT[node_color]
        }).flat()
      )
    ]

    //select nodes with a color within the colors to destroy
    var nodes_to_destroy = this.state.get_nodes().filter((node) => {
      return colors_to_destroy.includes(node.color) && node.tier !== Node.TIERS.THREE && !node.has_existing_link()
    })

    //randomly select a node to destroy
    if (nodes_to_destroy.length > 0) {
      var node_to_destroy = nodes_to_destroy[Math.floor(Math.random() * nodes_to_destroy.length)]
      this.state.deregister_node(node_to_destroy)
      node_to_destroy.dispose()
    }
  }

  update_information_panel() {
    var player_income = 0
    //Note: this long linkage doesn't make sense... the game should have a reference to the graph in particular
    // Are we just replacing the state with the graph?
    this.state.get_links().forEach(link => {
      player_income += link.get_link_value()
    });

    var player_currency = parseInt(this.currency_score.innerHTML)
    player_currency = player_currency + player_income
    this.currency_score.innerHTML = player_currency

    //for each node color, query the DOM & recover that dom element & update it's current price
    Object.keys(Node.COLORS).forEach(color => {
      document.querySelector(`#${color}`).innerHTML = this.state.economy.get_price_for_color(color)
    })
  }

  render = function() {
    this.renderer.render(window.scene, this.camera)
    this.labelRenderer.render(window.scene, this.camera)
  }

  add_world_plane = function(plane) {
    window.scene.add(plane)
    this.state.register_world_plane(plane)
  }

  add_node = function(node) {
    this.state.register_node(node)
  }

  add_light = function(light) {
    window.scene.add(light)
  }

}

export { Game }