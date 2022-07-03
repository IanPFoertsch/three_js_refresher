import * as THREE from 'three'




class Node {
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
    FIVE: 5
  }

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

    [Node.COLORS.VIOLET]: [],
    [Node.COLORS.GREEN]: [],
    [Node.COLORS.ORANGE]: []
  }

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

  static map_tier_from_icon = function(tier, position, color, scene, parent_node) {

    switch(tier) {
      case Node.TIERS.THREE:
        return new NodeIcon(position, color, scene, tier, parent_node)
      case Node.TIERS.FOUR:
        return new NodeIcon(position, color, scene, tier, parent_node)
      case Node.TIERS.FIVE:
        return new NodeIcon(position, color, scene, tier, parent_node)
    }
  }

  constructor(scene, position, color, tier) {

    this.position = position
    this.color = color
    this.tier = tier
    this.ring = new Ring(this.position, scene)
    this.icon = Node.map_tier_from_icon(tier, position, color, scene, this)
  }

  demands_by_color() {

    if (this.tier === Node.TIERS.THREE) {
      //Three-tier nodes are producers only, accepting no inputs
      return []
    }

    return Node.COLOR_INPUT[this.color]
  }

  is_valid_link(destination_node) {
    // is the destination_nodes' color in the origin node's compatability list?
    var color_compatible = Node.COLOR_OUTPUT[this.color].includes(destination_node.color)
    return color_compatible
    // if (!color_compatible) {
    //   return false
    // }

    // FUTURE LINKAGE RULES TO IMPLEMENT
    // ------------------------------------
    // NO REPEAT LINKAGES BETWEEN NODES
    // we can't link two of the same nodes more than once (unless we support node input/output ports)
    // ------------------
    // LINKAGES BY TIER
    // Nodes can only link to the same tier and the one above.
    // 3-tier nodes can only link to 3-tier and 4-tier nodes
    // 4-tier nodes can only link to 4-tier and 5-tier nodes, etc

  }
}

class Ring {
  constructor(position, scene) {
    this.geometry = new THREE.TorusGeometry(2, 0.2, 8, 8);

    this.material = new THREE.MeshPhongMaterial({ color: 0x999999 });
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.position.set(position[0], position[1], 0)
    scene.add(this.mesh)
   }
}

class NodeIcon {

  static rotate_z_degrees = function (tier) {
    switch (tier) {
      case Node.TIERS.THREE:
        return (60 * (Math.PI / 180))
      case Node.TIERS.FOUR:
        return (45 * (Math.PI / 180))
      case Node.TIERS.FIVE:
        return (90 * (Math.PI / 180))
    }
  }

  constructor(position, color, scene, tier, node) {
    this.position = position
    this.node = node

    this.geometry = new THREE.ConeGeometry(4, 2, tier);
    this.geometry.rotateX(90 * (Math.PI / 180))
    this.geometry.rotateZ(NodeIcon.rotate_z_degrees(tier))
    this.material = new THREE.MeshPhongMaterial({ color: Node.COLOR_HEX_CODES[color] })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.userData.parent_node = this.node
    this.mesh.position.set(this.position[0], this.position[1], 0)

    scene.add(this.mesh)
  }
}

export { Node }
