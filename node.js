import * as THREE from 'three'

class Node {
  constructor(scene, position) {
    this.position = position
    this.inner_icon = new NodeIcon()
    this.outer_ring_geometry = new THREE.RingGeometry(2, 2.2, 20);
    this.ring_material = new THREE.MeshToonMaterial({ color: 0x666666 });
    this.ring = new THREE.Mesh(this.outer_ring_geometry, this.ring_material);
    this.ring.position.set(this.position[0], this.position[1], 0)

    this.icon = new TriangleIcon(this.position, { color: 0xFF0000 }, scene)
    scene.add(this.ring)
  }
}

class NodeFactory {
  static construct_triangle = function(scene, bounds) {
    console.log(Math.random * bounds[1])
    var position = [this.random_coordinate(bounds[0]),this.random_coordinate(bounds[1])]
    console.log(position)
    var node = new Node(scene, position)
  }

  static random_coordinate = function(bound) {
    return (Math.random() * bound) - bound / 2
  }

  static random_primary_color = function() {
    ["#0000FF", "#FF0000", "#00FF00"][(Math.random() * 3 | 0)]
  }
}

//Need a NodeFactory to produce nodes
//How to organize shapes before adding them to a scene?
// rotate the geometry to get it right side up

class NodeIcon {
  constructor() {}
}

class TriangleIcon extends NodeIcon {
  constructor(position, color, scene) {
    super()
    this.position = [position[0], position[1]]
    this.geometry = new THREE.CircleGeometry(2, 3)
    this.material = new THREE.MeshToonMaterial(color)
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.set(this.position[0], this.position[1], 0)
    this.mesh.rotateZ(90*(Math.PI/180))
    scene.add(this.mesh)
  }
}

export { Node, NodeFactory }
