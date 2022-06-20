import * as THREE from 'three'
import { NodeLink } from "./node_link"

class InputHandler {
  constructor(game) {
    this.scene = game.scene
    this.state = game.state
    this.camera = game.camera
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()


    window.addEventListener('mousemove', event => { this.mouse_move(event) })
    window.addEventListener("mousedown", event => { this.mouse_down(event) })
    window.addEventListener("mouseup", event => { this.mouse_up(event) })
  }


  mouse_move = function(event) {

    if (this.state.mouse_down == true) {

      // if we've created a node_link
      if (this.link !== undefined) {
        var world_coordinates = this.get_world_intersection(event)
        console.log(this.link.geometry.attributes.position.array)
        this.link.draw_to_point(world_coordinates.x, world_coordinates.y)
      }
      // link.update_destination(world_coordinates.x, world_coordinates.y)

    }
  }

  mouse_down = function(event) {
    var world_coordinates = this.get_world_intersection(event)
    //Make selection
    var clicked_object = this.get_clicked_object(event)
    // notes on == vs ===
    // == => determines equality by value comparison using type coersion
    //    thus 77 == '77' is true
    // === => determines equality by value and type comparison, with
    //    no type coersion, therefore 77 === '77' is false
    if (clicked_object !== undefined) {
      console.log("found an object intersect")
      console.log(clicked_object)
      var link = new NodeLink(this.scene)
      link.set_origin(clicked_object.position.x, clicked_object.position.y)
      // set the link origin as = the object's position
      this.link = link
    }
    // if (link == undefined) {
    //   link = new NodeLink(this.scene)
    // }
    // link.update_origin(world_coordinates.x, world_coordinates.y)

    this.state.mouse_down = true
  }

  mouse_up = function(event) {
    var world_coordinates = this.get_world_intersection(event)
    this.state.mouse_down = false
  }

  set_mouse_coordinates(mouse_event, mouse) {
    mouse.x = (mouse_event.clientX / window.innerWidth) * 2 - 1
    mouse.y = - (mouse_event.clientY / window.innerHeight) * 2 + 1
  }

  get_world_intersection = function (mouse_event) {
    this.set_mouse_coordinates(mouse_event, this.mouse)

    this.raycaster.setFromCamera(this.mouse, this.camera)
    //TODO: We can massively simplify by storing references to important
    // objects in the world
    var world_plane = this.scene.children.find( mesh => {
      //TODO: make this more specific, possibly by adding user data on the
      // world plane
      return mesh.geometry.type == "PlaneGeometry"
    })
    var intersects = this.raycaster.intersectObjects([world_plane])
    if (intersects.length > 0) {
      //Currently just selecting the world plane intersection
      //We need to expand this to filter out non-world plane objects
      // We also need to add non-world-plane objects to the object list
      // to make them clickable in an expanded event handler
      return intersects[0].point
    }
  }

  get_clicked_object = function(mouse_event) {
    this.set_mouse_coordinates(mouse_event, this.mouse)

    this.raycaster.setFromCamera(this.mouse, this.camera)
    var non_world_plane_objects = this.scene.children.filter((mesh) => {
      if (mesh.geometry !== undefined) {
        return mesh.geometry.type != "PlaneGeometry"
      } else {
        return false
      }

    })
    var intersects = this.raycaster.intersectObjects(non_world_plane_objects)
    return intersects.length === 0 ? undefined : intersects[0].object
  }
}
export { InputHandler }
