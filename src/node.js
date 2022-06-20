import * as THREE from 'three'

class Node {
  constructor(scene, position) {
    this.position = position
    this.ring = new Ring(this.position, { color: 0x999999 }, scene)
    this.icon = new TriangleIcon(this.position, { color: 0xFF0000 }, scene)
  }
}

class NodeFactory {

  static #position_n = 0

  static construct_triangle = function(scene, bounds) {
    var position = this.fixed_position(bounds)
    return  new Node(scene, position)
  }

  static fixed_position = function() {
    this.#position_n += 1
    var coordinates = [
      Math.cos(this.#position_n) * -10,
      Math.sin(this.#position_n) * 10
    ]
    // console.log(coordinates)
    return coordinates
  }

  static random_position = function(bounds) {
    return [this.random_coordinate(bounds[0]), this.random_coordinate(bounds[1])]
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
  constructor() {}
}

class TriangleIcon extends NodeIcon {
  constructor(position, color, scene) {

    // const geometry = new
    // const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    // const cone = new THREE.Mesh(geometry, material);
    // scene.add(cone);
    super()
    this.position = [position[0], position[1]]
    this.geometry = new THREE.ConeGeometry(4, 2, 3);
    this.geometry.rotateX(90 * (Math.PI / 180))
    this.geometry.rotateZ(90 * (Math.PI / 180))
    this.material = new THREE.MeshPhongMaterial(color)
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.set(this.position[0], this.position[1], 0)
    this.mesh.rotateZ(90*(Math.PI/180))
    scene.add(this.mesh)
  }
}

export { Node, NodeFactory }
