import './../style.css'
import * as THREE from 'three'
import { PointLight, PointLightHelper } from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { NodeOne, NodeTwo } from "./node"
import { NodeLink } from "./node_link"
import { InputHandler } from './input_handler'
import { State } from './state'
import { Game } from './game'



const game = new Game()

const generate_world = function() {
  const geometry = new THREE.PlaneGeometry(100, 100);
  const material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(geometry, material);
  game.add_world_plane(plane)

  game.add_node(new NodeOne(game.scene, [-9, 9], 0xFF0000))
  game.add_node(new NodeOne(game.scene, [-14, 3], 0x0000FF))
  game.add_node(new NodeOne(game.scene, [-2, 9], 0xFFFF00))

  game.add_node(new NodeTwo(game.scene, [-11, -8], 0xFF00FF))
  game.add_node(new NodeTwo(game.scene, [1, 1], 0x00FF00))
  game.add_node(new NodeTwo(game.scene, [-1, -8], 0xFF0000))
  game.add_node(new NodeTwo(game.scene, [-1, -8], 0xFFA500))

  const directionalLight = new THREE.DirectionalLight(0xffffff)
  directionalLight.position.set(10, 10, 10)
  game.add_light(directionalLight)
}

generate_world(game)


function animate() {
  requestAnimationFrame(animate)
  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;
  game.renderer.render(game.scene, game.camera)
  // controls.update()
}

animate()

