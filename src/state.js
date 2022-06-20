import * as THREE from 'three'

class State {
  constructor() {
    this.nodes = []
    this.links = []
    this.world_plane = null
    this.open_link = null
    // Raycasting source: https://stackoverflow.com/a/12749287
  }

  register_world_plane = function(plane) {
    this.world_plane = plane
  }

  register_node = function(node) {
    this.nodes.push(node)
  }

  register_open_link = function(link) {
    this.open_link = link
  }

  close_link_to_point = function (x, y) {
    this.open_link.draw_to_point(x, y)
    this.links.push(this.open_link)
    this.open_link = null
  }

  destroy_open_link = function() {
    this.open_link.dispose()
    this.open_link = null
  }

  is_open_link = function() {
    return this.get_open_link() !== undefined
  }

  get_open_link = function() {
    return this.open_link
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