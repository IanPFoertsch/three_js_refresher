import * as THREE from 'three'

class State {
  constructor() {
    this.nodes = []
    this.links = []
    this.world_plane = null
    // Raycasting source: https://stackoverflow.com/a/12749287
  }

  register_world_plane = function(plane) {
    this.world_plane = plane
  }

  register_node = function(node) {
    this.nodes.push(node)
  }

  register_link = function(link) {
    this.links.push(link)
  }

  get_world_plane = function() {
    return this.world_plane
  }

  get_clickable_objects() {
    //Make this memoized?
    return this.nodes.map(node => {
      return node.icon.mesh
    })
  }
}

export { State }