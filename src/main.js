import './../style.css'
import * as THREE from 'three'
import { PointLight, PointLightHelper } from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Node, NodeFactory } from "./node"
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


  //TODO: stop using this stupid way to setup a game state, get a real map creation method going.
  Array.from(Array(6).keys()).forEach((i) => {
    //TODO: do we still need to pass the scene to the node construction? ->
    // -> yes, because our js object is adding itself to the scene
    game.add_node(NodeFactory.construct_triangle(game.scene, [20, 20]))
  })

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

