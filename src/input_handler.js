import * as THREE from 'three'
import { Link } from "./game/link"

class InputHandler {
  constructor(game) {
    this.scene = game.scene
    this.state = game.state
    this.camera = game.camera
    this.raycaster = new THREE.Raycaster()
    //Note: the nodes's position should be 0, but for some reason they were'nt being
    // picked up via the raycaster. Setting the "Near" plane to -1 solved the issue
    this.raycaster.near = -1
    this.mouse = new THREE.Vector2()


    window.addEventListener('mousemove', event => { this.mouse_move(event) })
    window.addEventListener("mousedown", event => { this.mouse_down(event) })
    window.addEventListener("mouseup", event => { this.mouse_up(event) })
    window.addEventListener("wheel", event => { this.mouse_wheel(event) })
  }

  mouse_wheel = function(event) {
    //Camera Zoom
    var zoom = Math.sign(event.deltaY) * 5

    //TODO: as we get closer to the world-plane,
    // we need to scale our differential using the logistic function
    // IE: if we're zooming very close into the world plane, zoom in smaller increments
    // if we're very far away from the world plane, zoom in larger increments
    // TODO: Put the zoom events & camera events in general on a stack
    // update the camera position gradually based on sum of the stack to make this smooth
    this.camera.position.z += zoom
  }

  mouse_move = function(event) {
    if (this.state.mouse_down == true) {
      // if we've created a node_link
      var world_coordinates = this.get_world_intersection(event)
      if (this.state.is_open_link()) {
        this.state.get_open_link().draw_to_point(world_coordinates.x, world_coordinates.y)
      } else {
        // mouse down & no open link = drag navigating
        //TODO: Implement limits to drag navigation
        var x_differential = this.drag_navigation_origin_point.x -  world_coordinates.x
        var y_differential = this.drag_navigation_origin_point.y - world_coordinates.y

        this.camera.position.x += x_differential
        this.camera.position.y += y_differential
      }
    }
  }

  mouse_down = function(event) {
    var world_coordinates = this.get_world_intersection(event)

    var clicked_point = this.get_clicked_object(event)
    console.log("This is the clicked point!", clicked_point)
    if (
      clicked_point !== undefined &&
      clicked_point.can_create_outgoing_link()
      ) {
        var link = new Link()
        link.set_origin(clicked_point)
        this.state.register_open_link(link)
      } else {
        // mousedown not on a clickable object - start drag navigating
        this.drag_navigation_origin_point = world_coordinates
      }

    link.set_origin(clicked_point)
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
      // If there's no open link, end drag navigating -> consolidated to cleanup step
    }

    //Perform all cleanup here, regardless of state. Make this operation idempotent
    this.drag_navigation_origin_point = null
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
    var intersects = this.get_intersecting_objects(mouse_event, this.state.get_graph().get_clickable_objects())

    //Note this returns our game object, not the mesh
    return intersects.length === 0 ? undefined : intersects[0].object.userData.parent.node
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
