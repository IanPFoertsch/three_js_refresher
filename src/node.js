
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
    this.icon = new NodeIcon(position, color, tier, this)
    this.force_vector = null
    this.incoming_links = {} // our registries of links are dictionaries on link ID for faster look up
    this.outgoing_links = {} // our registries of links are dictionaries on link ID for faster look up
  }

  update_position_by_differential(position_differential) {
    this.position[0] += position_differential[0]
    this.position[1] += position_differential[1]
    this.icon.update_position(this.position)
    // Do we need to update the origin of our outgoing links & the destination of our incoming links?
  }

  get_clickable_component() {
    return this.icon.mesh
  }

  is_linked_to_node_with_identifier(other_node_identifier) {
    // has_outgoing_link_to_node?
    var has_outgoing_link = this.outgoing_links.map((outgoing_link) => {
      // detect if outgoing_link's destination node's identifier matches
    })

    var has_incoming_link_to_node = this.incoming_links.map((incoming_link) => {
      // detect if incoming_links's origin node's identifier matches
    })
  }

  has_existing_link() {
    // is the length of this.outgoing_links > 0?
    // is the length of this.incoming_links > 0?
  }

  can_create_outgoing_link() {
    //TODO: fill in with logic to determine if we can/can't add additional links
    return true
  }

  is_valid_link_to_destination(destination_node) {
    // Can we add a link from this node to the destination node?
    // TODO: Fill in additional logic to determine link validity

    //We are the origin node
    var color_compatible = Node.COLOR_OUTPUT[this.color].includes(destination_node.color)
    if (!color_compatible) {
      return false
    }

    var teir_compatible = (this.tier == destination_node.tier - 1)
    return teir_compatible
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

  register_incoming_link(incoming_link) {
    this.incoming_links[incoming_link.id] = incoming_link
  }

  register_outgoing_link(outgoing_link) {
    this.outgoing_link[outgoing_link.id] = outgoing_link
  }

  de_register_outgoing_link(outgoing_link) {
    this.outgoing_links[outgoing_link.id] = null
  }

  dispose() {
    //Dispose of linkpoints & propagate destroy down through them
    //TODO: Amalgamate the incoming & outgoing links into one list for easier processing
    this.incoming_links.forEach((link) => {
      link.dispose()
    })
    this.outgoing_links.forEach((link) => {
      link.dispose()
    })
    // dispose of the nodeIcon
    this.icon.dispose()
    //The node class itself has no THREE.js components,
    // so we don't need to dispose of mesh, geometry, or remove it from the scene
  }
}

export { Node }
