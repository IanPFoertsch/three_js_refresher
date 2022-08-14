import * as THREE from 'three'
import { Economy } from './economy'
import { Node } from './node'
import { Graph } from './game/graph'

class State {
  constructor() {
    this.world_plane = null
    this.open_link = null
    this.economy = new Economy()
    this.graph = new Graph()
  }

  get_graph = function() {
    return this.graph
  }

  register_world_plane = function(plane) {
    this.world_plane = plane
  }

  register_node = function(node) {
    this.graph.register_node(node)
  }

  deregister_node = function(node_to_deregister) {
    this.graph.deregister_node(node_to_deregister)
  }

  register_open_link = function(link) {
    this.open_link = link
  }

  close_link_to_node = function (destination_link_point) {
    this.open_link.link_to_link_point(destination_link_point)
    this.graph.add_link(this.open_link)
    this.open_link = null
  }

  destroy_open_link = function() {
    if ( this.is_open_link() ) {
      this.open_link.dispose()
    }
    this.open_link = null
  }

  is_open_link = function() {
    //TODO: Maybe we can refactor this UI representation back into the input handler?
    return this.get_open_link() !== null
  }

  get_open_link = function() {
    return this.open_link
  }

  get_world_plane = function() {
    return this.world_plane
  }

  get_nodes = function() {
    return this.graph.get_nodes()
  }

  get_links = function() {
    return this.graph.get_links()
  }
}

export { State }