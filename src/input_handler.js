import * as THREE from 'three'
import { Link } from "./link"

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

    var clicked_point = this.get_clicked_object(event)
    if (
      clicked_point !== undefined &&
      clicked_point.can_create_outgoing_link()
      ) {
      var link = new Link()

      link.set_origin(clicked_point)
      this.state.register_open_link(link)
    } else {
      // mousedown not on a clickable object
      // start drag navigating
    }

    this.state.mouse_down = true
  }

  mouse_up = function(event) {
    var clicked_point = this.get_clicked_object(event)

    if (this.state.is_open_link()) {
      if (clicked_point !== undefined) {

        if (this.state.get_open_link().is_valid_link(clicked_point)) {
          //Only create a link to the destination object if it's valid to do so
          //This is a violation of tell, don't ask, and lifts login into the input handler
        // Ideally we'd push this down somehow, but I can't think of an easy way to do this at this time
          this.state.close_link_to_node(clicked_point)
        }
      } else {
        //if we're not intersecting a clickable/linkable object, let's destroy the link
      }
    } else {
      // If there's no open link, end drag navigating
    }

    //Perform all cleanup here, regardless of state. Make this operations idempotent
    this.state.destroy_open_link()
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
    //Note this returns our game object, not the mesh
    return intersects.length === 0 ? undefined : intersects[0].object.userData.parent
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
