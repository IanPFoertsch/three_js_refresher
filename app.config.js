const config = {
  //TODO: Implement a less brittle form of feature flagging
  graph: {
    create_nodes: false,
    destroy_nodes: false,
    enable_force_directed_graph: true
  },
  STANDOFF_DISTANCE: 2,
  MAX_ATTRACTIVE_FORCE: 2,
  MAX_MAGNITUDE_VALUE: 3,
}

export { config }