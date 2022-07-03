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

  register_open_link = function(link) {
    this.open_link = link
  }

  close_link_to_node = function (destination_node) {

    this.open_link.link_to_node(destination_node)
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

  get_clickable_objects() {
    //Make this memoized?
    return this.nodes.map(node => {
      return node.icon.mesh
    })
  }

  get_current_demand() {

    var demand_by_color = {}
    this.nodes.forEach(node => {
      //get the node's color and increment the
      console.log("iterating for node color", node.color, "inputs: ", node.demands_by_color())
      node.demands_by_color().forEach(color_demanded => {
        if (demand_by_color[color_demanded] === undefined) {
          demand_by_color[color_demanded] = 0
        }
        demand_by_color[color_demanded] += 10
      })


    })
    console.log(demand_by_color)
  }
}

export { State }