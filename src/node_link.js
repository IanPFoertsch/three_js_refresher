import * as THREE from 'three'
const MAX_POINTS = 2
class NodeLink {
  constructor(scene) {
    this.rendered = false
    this.scene = scene
    this.positions = new Float32Array(MAX_POINTS * 3)

    this.geometry = new THREE.BufferGeometry()
    //only draw 2 points - origin and destination
    this.geometry.setDrawRange(0, 2)
    // set three vertices per point
    this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));

    this.material = new THREE.LineBasicMaterial({ color: 0xFFFF00 })
    this.mesh = new THREE.Line(this.geometry, this.material);

    // scene.add(this.line)
  }

  is_valid_link(destination_node) {
    //get the color and tier of the originating node
    // compare it to the color and tier of the destination node

  }

  set_origin(origin_node) {

    this.origin_node = origin_node

    this.positions[0] = this.origin_node.position.x
    this.positions[1] = this.origin_node.position.y
    console.log(this.positions[0], this.positions[1])
    // this.line.geometry.attributes.position.needsUpdate = true
  }

  draw_to_point(x, y) {
    //TODO: we need a better way to track if objects are currently added
    // to the scene
    if (this.rendered === false) {
      this.scene.add(this.mesh)
      this.rendered = true
    }
    this.positions[3] = x
    this.positions[4] = y
    //TODO: can we simplify this access?
    this.mesh.geometry.attributes.position.needsUpdate = true
  }

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
    this.scene.remove(this.mesh)
  }
}

export { NodeLink }