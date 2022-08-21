import * as THREE from 'three'

import { LinkPoint } from "./link_point"
import { NodeIcon } from "./ui_objects/node_icon"

class Node {
  static node_count = 0
  static COLORS = {
    RED: "RED",
    BLUE: "BLUE",
    YELLOW: "YELLOW",

    VIOLET: "VIOLET",
    GREEN: "GREEN",
    ORANGE: "ORANGE"
  }

  static COLOR_HEX_CODES = {
    RED: 0xFF0000,
    BLUE: 0x0000FF,
    YELLOW: 0xFFFF00,

    VIOLET: 0xFF00FF,
    GREEN: 0x00FF00,
    ORANGE: 0xFFA500
  }
  static TIERS = {
    // ideally we'd start at 1, but this is internal
    // and mapping tiers to the icons is easier if the
    // tier == number of points in the icon geometry
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
    SIX: 6,
    SEVEN: 7,
    EIGHT: 8,
    NINE: 9,
    TEN: 10
  }

  static generate_identifier = function() {
    return Node.node_count += 1
  }

  //[output color] => [list of colors that accept this as an input]
  static COLOR_OUTPUT = {
    [Node.COLORS.RED]:  [
        Node.COLORS.RED,
        Node.COLORS.ORANGE,
        Node.COLORS.VIOLET,
      ],
    [Node.COLORS.BLUE]: [
      Node.COLORS.BLUE,
      Node.COLORS.GREEN,
      Node.COLORS.VIOLET,
      ],
    [Node.COLORS.YELLOW]: [
      Node.COLORS.YELLOW,
      Node.COLORS.GREEN,
      Node.COLORS.ORANGE,
    ],

    [Node.COLORS.VIOLET]: [Node.COLORS.VIOLET],
    [Node.COLORS.GREEN]: [Node.COLORS.GREEN],
    [Node.COLORS.ORANGE]: [Node.COLORS.ORANGE]
  }

  //[input_color] => [ list of colors that this color accepts inputs from]
  static COLOR_INPUT = {
    [Node.COLORS.RED]: [Node.COLORS.RED],
    [Node.COLORS.BLUE]: [Node.COLORS.BLUE],
    [Node.COLORS.YELLOW]: [Node.COLORS.YELLOW],

    [Node.COLORS.VIOLET]: [
      Node.COLORS.RED,
      Node.COLORS.BLUE,
      Node.COLORS.VIOLET
    ],
    [Node.COLORS.GREEN]: [
      Node.COLORS.YELLOW,
      Node.COLORS.BLUE,
      Node.COLORS.GREEN
    ],
    [Node.COLORS.ORANGE]: [
      Node.COLORS.RED,
      Node.COLORS.YELLOW,
      Node.COLORS.ORANGE
    ]
  }

  constructor(position, color, tier) {
    this.position = position
    this.color = color
    this.tier = tier
    this.identifier = Node.generate_identifier()
    this.link_points = this.create_link_points()
    this.icon = new NodeIcon(position, color, tier, this)
    this.force_vector = null
  }

  update_position_by_differential(position_differential) {
    this.position[0] += position_differential[0]
    this.position[1] += position_differential[1]
    this.icon.update_position(this.position)
    this.link_points.map((link_point) => {
      link_point.update_position(this.position)
    })
  }

  get_link_points() {
    return this.link_points.map(link_point => {
      return link_point.mesh
    })
  }

  is_linked_to(other_node) {
    var linked_node_identifiers = this.link_points.map((link_point) => {
      return link_point.get_linked_nodes().map((node) => {
        return node.identifier
      })
    }).flat()

    return linked_node_identifiers.includes(other_node.identifier)
  }

  has_existing_link() {
    return this.link_points.some(link_point => {
      return link_point.has_existing_link()
    })
  }

  create_link_points() {
    var number_of_connections = 1
    switch(this.tier) {
      case Node.TIERS.THREE:
        number_of_connections = 3
        break;
      case Node.TIERS.FOUR:
        number_of_connections = 2
        break;
      default:
        number_of_connections = 1
        break;
    }

    return [...Array(number_of_connections).keys()].map((connection_number) => {
      return new LinkPoint(this.position, connection_number, this)
    });
  }


  //What color inputs does our node demand?
  demands_by_color() {
    if (this.tier === Node.TIERS.THREE) {
      //Three-tier nodes are producers only, accepting no inputs
      return []
    }

    return Node.COLOR_INPUT[this.color]
  }

  accepts_input_color(input_color) {
    this.demands_by_color().includes(input_color)
  }

  is_linkable_to_origin(origin_link_point) {
    //We are the destination node
    var color_compatible = Node.COLOR_INPUT[this.color].includes(origin_link_point.parent_node.color)
    return color_compatible
    // if (!color_compatible) {
    //   return false
    // }

    // ------------------
    // LINKAGES BY TIER
    // Nodes can only link to the same tier and the one above.
    // 3-tier nodes can only link to 3-tier and 4-tier nodes
    // 4-tier nodes can only link to 4-tier and 5-tier nodes, etc

  }

  dispose() {
    //Dispose of linkpoints & propagate destroy down through them
    this.link_points.forEach((link_point) => {
      link_point.dispose()
    })
    // dispose of the nodeIcon
    this.icon.dispose()
    //The node class itself has no THREE.js components,
    // so we don't need to dispose of mesh, geometry, or remove it from the scene
  }
}

export { Node }
