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
      if (this.state.is_open_link()) {
        var world_coordinates = this.get_world_intersection(event)

        this.state.get_open_link().draw_to_point(world_coordinates.x, world_coordinates.y)
      } else {
        // mouse down & no open link = drag navigating
        // implement drag navigating here
      }
    }
  }

  mouse_down = function(event) {
    var world_coordinates = this.get_world_intersection(event)
    console.log("Look here at the world coordinates", world_coordinates)
    var clicked_object = this.get_clicked_object(event)

    if (clicked_object !== undefined) {
      var link = new NodeLink(this.scene)
      link.set_origin(clicked_object.position.x, clicked_object.position.y)
      this.state.register_open_link(link)
    } else {
      // mousedown not on a clickable object
      // start drag navigating
    }

    this.state.mouse_down = true
  }

  mouse_up = function(event) {
    var clicked_object = this.get_clicked_object(event)

    if (this.state.is_open_link()) {
      if (clicked_object !== undefined) {
        this.state.close_link_to_point(clicked_object.position.x, clicked_object.position.y)
      } else {
        //if we're not intersecting a clickable/linkable object, let's destroy the link
        this.state.destroy_open_link()
      }
    } else {
      // If there's no open link, end drag navigating
    }

    this.state.mouse_down = false
  }

  set_mouse_coordinates(mouse_event, mouse) {
    mouse.x = (mouse_event.clientX / window.innerWidth) * 2 - 1
    mouse.y = - (mouse_event.clientY / window.innerHeight) * 2 + 1
  }

  get_world_intersection = function (mouse_event) {
    var intersects = this.get_intersecting_objects(mouse_event, [this.state.get_world_plane()])

    return intersects.length === 0 ? undefined : intersects[0].point
  }

  get_clicked_object = function(mouse_event) {
    var intersects = this.get_intersecting_objects(mouse_event, this.state.get_clickable_objects())

    return intersects.length === 0 ? undefined : intersects[0].object
  }

  get_intersecting_objects(mouse_event, objects_to_check) {
    if (!Array.isArray(objects_to_check)) {
      throw `Calculating Intersects requires an array: ${objects_to_check} is not an array`
    }
    this.set_mouse_coordinates(mouse_event, this.mouse)
    // Raycasting source: https://stackoverflow.com/a/12749287
    this.raycaster.setFromCamera(this.mouse, this.camera)

    return this.raycaster.intersectObjects(objects_to_check)
  }

}
export { InputHandler }
