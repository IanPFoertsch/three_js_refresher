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
    this.line = new THREE.Line(this.geometry, this.material);

    // scene.add(this.line)
  }

  set_origin(x, y) {
    this.positions[0] = x
    this.positions[1] = y
    //TODO: can we simplify this access?
    // this.line.geometry.attributes.position.needsUpdate = true
  }

  draw_to_point(x, y) {
    //TODO: we need a better way to track if objects are currently added
    // to the scene
    if (this.rendered === false) {
      this.scene.add(this.line)
      this.rendered = true
    }
    this.positions[3] = x
    this.positions[4] = y
    //TODO: can we simplify this access?
    this.line.geometry.attributes.position.needsUpdate = true
  }
}

export { NodeLink }