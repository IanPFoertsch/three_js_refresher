import './../style.css'
import * as THREE from 'three'
import { PointLight, PointLightHelper } from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Node } from "./node"
import { Link } from "./game/link"
import { InputHandler } from './input_handler'
import { State } from './state'
import { Game } from './game'
import { config } from '../app.config'



const game = new Game()

function generate_default_start(game) {
  game.add_node(new Node([-10, 10], Node.COLORS.RED, Node.TIERS.THREE))
  game.add_node(new Node([10, -10], Node.COLORS.BLUE, Node.TIERS.THREE))
  game.add_node(new Node([-2, 9], Node.COLORS.YELLOW, Node.TIERS.THREE))

  game.add_node(new Node([-11, -8], Node.COLORS.VIOLET, Node.TIERS.FOUR))
  game.add_node(new Node([1, 1], Node.COLORS.GREEN, Node.TIERS.FOUR))
  game.add_node(new Node([-1, -8], Node.COLORS.ORANGE, Node.TIERS.FOUR))

  game.add_node(new Node([-16, -12], Node.COLORS.VIOLET, Node.TIERS.FIVE))
  game.add_node(new Node([7, 1], Node.COLORS.GREEN, Node.TIERS.FIVE))
  game.add_node(new Node([-1, -15], Node.COLORS.ORANGE, Node.TIERS.FIVE))

  game.add_node(new Node([-22, -18], Node.COLORS.RED, Node.TIERS.SIX))
  game.add_node(new Node([14, 1], Node.COLORS.GREEN, Node.TIERS.SIX))
  game.add_node(new Node([-1, -25], Node.COLORS.ORANGE, Node.TIERS.SIX))
}

const generate_world = function(game) {
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
  game.render()
}



animate()

