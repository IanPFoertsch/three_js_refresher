var standoff_distance = 15

const config = {
  //TODO: Implement a less brittle form of feature flagging
  graph: {
    create_nodes: true,
    destroy_nodes: true,
    random_node_creation: true,
    enable_force_directed_graph: true,
    node_spacing: {
      STANDOFF_DISTANCE: standoff_distance,
      MAX_ATTRACTION_DISTANCE: standoff_distance + 1,
      //If we're comparing all nodes instead of just nearest neighbors, we need to repulse more strongly than we attact,
      // otherwise at the edges of the graph nodes become clumped as the net attraction is higher than the repulsion
      // to nodes they're near
      MIN_REPULSION_DISTANCE: standoff_distance - 6
    }

  },
}

export { config }