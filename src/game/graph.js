import { Node } from '../node'
import { config } from '../../app.config'

class Graph {
  constructor() {

    this.nodes = []
    this.links = []
  }

  register_node = function (node) {
    this.nodes.push(node)
  }

  deregister_node = function (node_to_deregister) {
    this.nodes = this.nodes.filter((node) => {
      return node !== node_to_deregister
    })
  }

  add_link = function (link_to_add) {
    this.links.push(link_to_add)
  }

  get_clickable_objects = function() {
    return this.nodes.map((node) => {
      return node.get_clickable_component()
    })
  }

  get_nodes = function() {
    return this.nodes
  }

  get_links = function() {
    return this.links
  }

  update_node_forces = function () {
    //for each node, calculate their forces.
    //All nodes repel all other nodes (this is an n-factorial operation, we'll need to implement k nearest neighbors or something)
    //  node repulsion is high at short distances, low or non-existent at long distances
    var nodes = this.get_nodes()
    var all_pairs = nodes.flatMap(
      (v, i) => nodes.slice(i + 1).map(w => [v, w])
    );

    var node_forces = nodes.reduce((node_forces, node) => {
      node_forces[node.identifier] = []
      return node_forces
    }, {})


    all_pairs.forEach((pair_of_nodes) => {

      var force_vector = this.calculate_force_between_nodes(pair_of_nodes[0], pair_of_nodes[1])

      //for node 0, add the force vector,
      node_forces[pair_of_nodes[0].identifier].push(force_vector)
      //for node 1, add the inverted force vector
      node_forces[pair_of_nodes[1].identifier].push(this.invert_vector(force_vector))
    })

    //At the moment, our node forces array only has 1 element, so we just need to update the node's positions
    // Are we updating the movement vector?
    // With every tick, update position by force vector / ticks per second
    Object.keys(node_forces).forEach((node_identifier) => {
      var vector = node_forces[node_identifier].reduce((total_force, force_vector) => {
        return this.add_vector(total_force, force_vector)
      })

      var node = this.get_nodes().find((node) => { return node.identifier == node_identifier })
      node.update_position_by_differential(vector)
    })
  }

  calculate_force_between_nodes(node_1, node_2) {
    var vector = this.get_vector_between_nodes(node_1, node_2)
    var unit_vector = this.get_unit_vector_between_nodes(node_1, node_2)
    var magnitude = this.get_vector_magnitude(vector)

    var spacing_force = this.universal_node_spacer(magnitude, unit_vector) // forces should be a Vector, not a number
    var link_force = this.node_link_force(node_1, node_2, unit_vector)

    return this.sum_vectors([spacing_force, link_force])
  }

  sum_vectors = function(vectors) {
    return vectors.reduce((summed_vector, component_vector) => {
      return this.add_vector(summed_vector, component_vector)
    }, [0,0])
  }


  node_link_force = function (node_1, node_2, unit_vector) {
    // is node_1 linked to node_2?
    var link_attraction = (node_1.is_linked_to_node_with_identifier(node_2.identifier) ? 0.05 : 0)
    return this.scalar_vector_multiply(link_attraction, unit_vector)
  }


  //TODO: We need to consolidate this to a linear algebra library
  get_vector_between_nodes = function (node_1, node_2) {
    var x_diff = node_2.position[0] - node_1.position[0]
    var y_diff = node_2.position[1] - node_1.position[1]
    return [x_diff, y_diff]
  }

  get_vector_magnitude = function (vector) {
    return Math.sqrt((vector[0] * vector[0]) + (vector[1] * vector[1]))
  }


  get_unit_vector_between_nodes = function (node_1, node_2) {
    var vector = this.get_vector_between_nodes(node_1, node_2)
    var magnitude = this.get_vector_magnitude(vector)

    return vector.map((element) => {
      return element / magnitude
    })
  }

  universal_node_spacer = function (magnitude, unit_vector) {
    if (magnitude > config.graph.node_spacing.MAX_ATTRACTION_DISTANCE) {
      magnitude = config.graph.node_spacing.MAX_ATTRACTION_DISTANCE
    } else if (magnitude < config.graph.node_spacing.MIN_REPULSION_DISTANCE) {
      magnitude = config.graph.node_spacing.MIN_REPULSION_DISTANCE
    }


    // function = f(x) = ((distance - Standoff distance) ^ 3) / Dampening force
    var spacing_force = Math.pow(magnitude - (config.graph.node_spacing.STANDOFF_DISTANCE), 3) /
      Math.pow(config.graph.node_spacing.STANDOFF_DISTANCE, 3)

    return this.scalar_vector_multiply(spacing_force, unit_vector)
  }

  invert_vector = function (vector) {
    return vector.map((element) => {
      return - element
    })
  }

  add_vector = function (vector_one, vector_two) {
    return [
      vector_one[0] + vector_two[0],
      vector_one[1] + vector_two[1]
    ]
  }

  scalar_vector_multiply = function(scalar, vector) {
    return vector.map((element) => {
      return element * scalar
    })
  }
}


export { Graph }