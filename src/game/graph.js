// import { config } from '../app.config'


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
    //Make this memoized?
    return this.nodes.map(node => {
      return node.get_link_points()
    }).flat()
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
      //How are we going to store the node forces?
      // Add a vector to the nodes? Nodes have a direction & speed?
      // The vector = sum of all forces acting on the node
      // Force between the nodes =
      //calculate the force between the nodes
      // for each node in the pair, increment the node's force vector by that amount
      //get distance between nodes
      var vector = this.get_vector_between_nodes(pair_of_nodes[0], pair_of_nodes[1])
      var magnitude = this.get_vector_magnitude(vector)
      var unit_vector = vector.map((element) => {
        return element / magnitude
      })

      var force = this.universal_node_spacer(magnitude)
      var force_vector = unit_vector.map((element) => {
        return element * force
      })

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
        this.add_vector(total_force, force_vector)
        return total_force
      })

      //Why is the vector increasing? it should be decreasing as the nodes get closer together

      var node = this.get_nodes().find((node) => { return node.identifier == node_identifier })
      node.update_position_by_differential(vector)
    })
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
    var vector = get_vector_between_nodes(node_1, node_2)
    var magnitude = get_vector_magnitude(vector)

    return vector.map((element) => {
      return element / magnitude
    })
  }

  universal_node_spacer = function (magnitude) {
    // TODO: make these values configurable
    var STANDOFF_DISTANCE = 15
    var max_distance = STANDOFF_DISTANCE + 2
    //If we're comparing all nodes instead of just nearest neighbors, we need to repulse more strongly than we attact,
    // otherwise at the edges of the graph nodes become clumped as the net attraction is higher than the repulsion
    // to nodes they're near
    var min_distance = STANDOFF_DISTANCE - 6

    if (magnitude > max_distance) {
      //TODO: Memoize these values
      magnitude = max_distance
    } else if (magnitude < min_distance) {
      //TODO: Memoize these values
      magnitude = min_distance
    }
    // function = f(x) = ((distance - Standoff distance) ^ 3) / Dampening force
    return Math.pow(magnitude - (STANDOFF_DISTANCE), 3) / Math.pow(STANDOFF_DISTANCE, 2)
  }

  invert_vector = function (vector) {
    return vector.map((element) => {
      return - element
    })
  }

  add_vector = function (vector_one, vector_two) {
    // TODO: This way of doing this is and error prone
    // but maybe memory efficient b/c we're not creating
    // throwaway arrays
    vector_one[0] += vector_two[0]
    vector_one[1] += vector_two[1]
  }
}


export { Graph }