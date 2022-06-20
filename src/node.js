import * as THREE from 'three'



class Node {
  constructor(scene, position, color) {
    this.position = position
    this.ring = new Ring(this.position, { color: 0x999999 }, scene)
    // this.icon = new TriangleIcon(this.position, { color: 0xFF0000 }, scene)
  }
}

class NodeOne extends Node {
  constructor(scene, position, color) {
    super(scene, position)
    this.icon = new TriangleIcon(this.position, color, scene)
  }
}

class NodeTwo extends Node {
  constructor(scene, position, color) {
    super(scene, position)
    this.icon = new SquareIcon(this.position, color, scene)
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
  constructor(position, color, scene) {
    this.position = [position[0], position[1]]
  }
}

class TriangleIcon extends NodeIcon {
  constructor(position, color, scene) {
    super(position, color, scene)
    this.geometry = new THREE.ConeGeometry(4, 2, 3);
    this.geometry.rotateX(90 * (Math.PI / 180))
    this.geometry.rotateZ(60 * (Math.PI / 180))
    this.material = new THREE.MeshPhongMaterial({color: color})
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.set(this.position[0], this.position[1], 0)
    // this.mesh.rotateZ(90*(Math.PI/180))
    scene.add(this.mesh)
  }
}

class SquareIcon extends NodeIcon {
  constructor(position, color, scene) {
    super(position, color, scene)
    this.geometry = new THREE.ConeGeometry(4, 2, 4);
    this.geometry.rotateX(90 * (Math.PI / 180))
    this.geometry.rotateZ(45 * (Math.PI / 180))
    this.material = new THREE.MeshPhongMaterial({ color: color })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.position.set(this.position[0], this.position[1], 0)
    // this.mesh.rotateZ(90 * (Math.PI / 180))
    scene.add(this.mesh)
  }
}

export { NodeOne, NodeTwo }
