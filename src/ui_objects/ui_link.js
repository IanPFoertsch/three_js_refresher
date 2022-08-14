import * as THREE from 'three'
const MAX_POINTS = 2
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';


class UILink {
  constructor(scene) {
    this.rendered = false
    this.scene = window.scene
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

  set_origin(x, y) {
    this.positions[0] = x
    this.positions[1] = y
  }

  draw_to_point(x, y) {
    //TODO: we need a better way to track if objects are currently added
    // to the scene
    if (this.rendered === false) {
      window.scene.add(this.mesh)
      this.rendered = true
    }
    this.positions[3] = x
    this.positions[4] = y
    //TODO: can we simplify this access?

    this.update_render()
  }

  update_render() {
    if (this.label !== undefined ) {
      this.update_label_position()
    }
    this.mesh.geometry.attributes.position.needsUpdate = true
  }

  add_label(text_content) {
    this.div = document.createElement("div")
    this.div.className = 'label'
    //the link value is an economy-aware entity.
    this.div.textContent = text_content
    this.div.style.marginTop = '-1em'
    this.div.style.color = 'green'
    this.label = new CSS2DObject(this.div)

    //Place the label halfway between the source & destination positions.
    this.update_label_position()
    this.mesh.add(this.label)
    this.label.layers.set(0)
  }

  update_label_position() {
    this.label.position.set(
      (this.positions[0] + this.positions[3]) / 2,
      (this.positions[1] + this.positions[4]) / 2
    );
  }

  dispose() {
    this.geometry.dispose()
    this.material.dispose()
    window.scene.remove(this.mesh)
  }
}

export { UILink }