import './../style.css'
import * as THREE from 'three'
import { PointLight, PointLightHelper } from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Node } from "./node"
import { Link } from "./game/link"
import { InputHandler } from './input_handler'
import { State } from './state'
import { Game } from './game'



const game = new Game()

function generate_default_start(game) {
  game.add_node(new Node(game.scene, [-9, 9], Node.COLORS.RED, Node.TIERS.THREE))
  game.add_node(new Node(game.scene, [-14, 3], Node.COLORS.BLUE, Node.TIERS.THREE))
  game.add_node(new Node(game.scene, [-2, 9], Node.COLORS.YELLOW, Node.TIERS.THREE))

  game.add_node(new Node(game.scene, [-11, -8], Node.COLORS.VIOLET, Node.TIERS.FOUR)) //RED
  game.add_node(new Node(game.scene, [1, 1], Node.COLORS.GREEN, Node.TIERS.FOUR))
  game.add_node(new Node(game.scene, [-1, -8], Node.COLORS.ORANGE, Node.TIERS.FOUR))

  game.add_node(new Node(game.scene, [-16, -12], Node.COLORS.VIOLET, Node.TIERS.FOUR)) //RED
  game.add_node(new Node(game.scene, [7, 1], Node.COLORS.GREEN, Node.TIERS.FOUR))
  game.add_node(new Node(game.scene, [-1, -15], Node.COLORS.ORANGE, Node.TIERS.FOUR))
}

const generate_world = function() {
  const geometry = new THREE.PlaneGeometry(100, 100);
  const material = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(geometry, material);
  game.add_world_plane(plane)

  generate_default_start(game)

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
  game.render()
  // controls.update()
}

animate()

