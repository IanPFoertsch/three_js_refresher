import * as THREE from 'three'




class Node {
  static COLORS = {
    RED: 0xFF0000, //RED
    BLUE: 0x0000FF, // BLUE
    YELLOW: 0xFFFF00, // YELLOW

    VIOLET: 0xFF00FF, //violet/magenta
    GREEN: 0x00FF00, //GREEN
    ORANGE: 0xFFA500 // ORANGE
  }
  static TIERS = {
    // ideally we'd start at 1, but this is internal
    // and mapping tiers to the icons is easier if the
    // tier == number of points in the icon geometry
    THREE: 3,
    FOUR: 4,
    FIVE: 5
  }

  static map_tier_from_icon = function(tier, position, color, scene) {
    console.log("mapping for tier", tier)

    switch(tier) {
      case Node.TIERS.THREE:
        return new NodeIcon(position, color, scene, tier)
      case Node.TIERS.FOUR:
        return new NodeIcon(position, color, scene, tier)
      case Node.TIERS.FIVE:
        return new NodeIcon(position, color, scene, tier)
    }
  }

  constructor(scene, position, color, tier) {
    this.position = position
    this.color = color
    this.tier = tier
    this.ring = new Ring(this.position, { color: 0x999999 }, scene)
    this.icon = Node.map_tier_from_icon(tier,position, color, scene)
  }

  get_icon_for_tier() {

  }
}

class Ring {
  constructor(position, color, scene) {
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

  constructor(position, color, scene, tier) {
    this.position = position

    this.geometry = new THREE.ConeGeometry(4, 2, tier);
    this.geometry.rotateX(90 * (Math.PI / 180))
    this.geometry.rotateZ(NodeIcon.rotate_z_degrees(tier))
    this.material = new THREE.MeshPhongMaterial({ color: color })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.set(this.position[0], this.position[1], 0)

    scene.add(this.mesh)
  }
}

export { Node }
