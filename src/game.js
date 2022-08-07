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
    this.scene = new THREE.Scene()
    window.scene = this.scene
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

    window.setInterval(() => {
      this.update_economy()
      this.update_information_panel()
    }, 1000)


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

  get_distance_between_nodes = function(node_1, node_2) {
    var vector = this.get_vector_between_nodes(node_1, node_2)

    return Math.sqrt((x_diff * x_diff) + (y_diff * y_diff));
  }

  get_vector_between_nodes = function (node_1, node_2) {
    var x_diff = node_2.position[0] - node_1.position[0]
    var y_diff = node_2.position[1] - node_1.position[1]
    return [x_diff, y_diff]
  }

  update_node_forces = function () {
    //for each node, calculate their forces.
    //All nodes repel all other nodes (this is an n-factorial operation, we'll need to implement k nearest neighbors or something)
    //  node repulsion is high at short distances, low or non-existent at long distances
    var nodes = this.state.get_nodes()
    var all_pairs = nodes.flatMap(
      (v, i) => nodes.slice(i + 1).map(w => [v, w])
    );
    var node_forces = {}
    all_pairs.forEach((pair_of_nodes) => {
      //How are we going to store the node forces?
      // Add a vector to the nodes? Nodes have a direction & speed?
      // The vector = sum of all forces acting on the node
      // Force between the nodes =
      //calculate the force between the nodes
      // for each node in the pair, increment the node's force vector by that amount
      //get distance between nodes
      var distance_between_nodes = this.get_distance_between_nodes(pair_of_nodes[0], pair_of_nodes[1])
      var force = Math.log(distance_between_nodes)
      var direction_vector = this.get_vector_between_nodes(pair_of_nodes[0], pair_of_nodes[1])
      console.log(direction_vector)
      //we have both a force and a vector. The vector for each pair points to the other node


    })

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

    if (config.graph.enable_force_directed_graph) {
      this.update_node_forces()
    }

  }

  generate_new_nodes() {s
    //Can we consolidate this logic somewhere. Is there a better abstraction for economic updates?
    var nodes_to_create = this.state.economy.get_node_creation()
    nodes_to_create.forEach((node_color) => {
      var colors_demanding = Node.COLOR_OUTPUT[node_color]

      var random_color = colors_demanding[Math.floor(Math.random() * colors_demanding.length)]

      //create a new node at a random location... what teir exactly? just make it tier 4
      //TODO: Nodes will be placed randomly but should move via a force directed graph algorithm
      this.add_node(
        new Node(
          this.scene,
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
    this.state.links.forEach(link => {
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
    this.renderer.render(this.scene, this.camera)
    this.labelRenderer.render(this.scene, this.camera)
  }

  add_world_plane = function(plane) {
    this.scene.add(plane)
    this.state.register_world_plane(plane)
  }

  add_node = function(node) {
    this.state.register_node(node)
  }

  add_light = function(light) {
    this.scene.add(light)
  }

}

export { Game }