import * as THREE from 'three'
import { Economy } from './economy'
import { Node } from './node'

class State {
  constructor() {
    this.nodes = []
    this.links = []
    this.world_plane = null
    this.open_link = null
    this.economy = new Economy()
  }

  register_world_plane = function(plane) {
    this.world_plane = plane
  }

  register_node = function(node) {
    this.nodes.push(node)
  }

  deregister_node = function(node_to_deregister) {
    // console.log("deregistering node!", this.nodes.length)
    // console.log(node_to_deregister)
    this.nodes = this.nodes.filter((node) => {
      // console.log("comparing node", node.color, node.position, " with", node_to_deregister.color, node_to_deregister.position)
      return node !== node_to_deregister
    })
  }

  register_open_link = function(link) {
    this.open_link = link
  }

  close_link_to_node = function (destination_link_point) {
    this.open_link.link_to_link_point(destination_link_point)
    this.links.push(this.open_link)
    this.open_link = null
  }

  destroy_open_link = function() {
    if ( this.is_open_link() ) {
      this.open_link.dispose()
    }
    this.open_link = null
  }

  is_open_link = function() {
    return this.get_open_link() !== null
  }

  get_open_link = function() {
    return this.open_link
  }

  get_world_plane = function() {
    return this.world_plane
  }

  get_nodes = function() {
    return this.nodes
  }

  get_clickable_objects() {
    //Make this memoized?
    return this.nodes.map(node => {
      return node.get_link_points()
    }).flat()
  }
}

export { State }