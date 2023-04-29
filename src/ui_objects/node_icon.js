import * as THREE from 'three'
import { Node } from "../node"


class NodeIcon {

  static rotate_z_degrees = function (tier) {
    switch (tier) {
      case Node.TIERS.THREE:
        return (60 * (Math.PI / 180))
      case Node.TIERS.FOUR:
        return (45 * (Math.PI / 180))
      case Node.TIERS.FIVE:
        return (90 * (Math.PI / 180))
      default:
        return (90 * (Math.PI / 180))

    }
  }

  constructor(position, color, tier, node) {
    this.node = node

    this.geometry = new THREE.ConeGeometry(4, 2, tier);
    this.geometry.rotateX(90 * (Math.PI / 180))
    this.geometry.rotateZ(NodeIcon.rotate_z_degrees(tier))
    this.material = new THREE.MeshPhongMaterial({ color: Node.COLOR_HEX_CODES[color] })
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.update_position(position)
    window.scene.add(this.mesh)
  }

  update_position(new_position) {
    this.position = new_position
    this.mesh.position.set(this.position[0], this.position[1], 0)
  }

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
    window.scene.remove(this.mesh)
  }
}

export { NodeIcon }
