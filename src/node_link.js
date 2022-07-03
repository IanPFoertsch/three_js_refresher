import * as THREE from 'three'
const MAX_POINTS = 2
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';



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

  get_quantity_supplied() {
    //TODO: Make these values derived from the market
    return 10
  }

  get_color_supplied() {
    return this.origin_node.color
  }

  get_link_value() {
    //We should find a better way of accessing global entities than
    // storing it on the state. This causes a tight linkage between a node
    // link and a completely different entity
    return window.state.economy.get_price_for_color(this.origin_node.color) *
      this.get_quantity_supplied()
  }


  add_label() {
    this.div = document.createElement("div")
    this.div.className = 'label'
    //the link value is an economy-aware entity.
    this.div.textContent = this.get_link_value()
    this.div.style.marginTop = '-1em'
    this.div.style.color = 'green'
    this.label = new CSS2DObject(this.div)

    //Place the label halfway between the source & destination positions.
    this.label.position.set(
      (this.positions[0] + this.positions[3]) / 2,
      (this.positions[1] + this.positions[4]) / 2
    );
    this.mesh.add(this.label)
    this.label.layers.set(0)
  }

  is_valid_link(destination_node) {
    return this.origin_node.is_valid_link(destination_node)
  }

  set_origin(origin_node) {
    this.origin_node = origin_node

    this.positions[0] = this.origin_node.position[0]
    this.positions[1] = this.origin_node.position[1]

    // this.line.geometry.attributes.position.needsUpdate = true
  }

  link_to_node(destination_node) {
    this.draw_to_point(destination_node.position[0], destination_node.position[1])
    this.add_label()
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