class InputHandler {
  constructor(scene, state) {
    console.log("creating!")
    this.scene = scene
    this.state = state
    console.log(this.mouse_move)
    window.addEventListener('mousemove', event => { this.mouse_move(event) })
    window.addEventListener("mousedown", event => { this.mouse_down(event) })
    window.addEventListener("mouseup", event => { this.mouse_up(event) })
  }


  mouse_move = function(event) {
    console.log(this)
    if (this.state.mouse_down == true) {
      var world_coordinates = this.get_world_intersection(event)
      link.update_destination(world_coordinates.x, world_coordinates.y)
    }
  }

  mouse_down = function(event) {
    var world_coordinates = this.get_world_intersection(event)

    if (link == undefined) {
      link = new NodeLink(this.scene)
    }
    link.update_origin(world_coordinates.x, world_coordinates.y)

    this.state.mouse_down = true
  }

  mouse_up = function(event) {
    var world_coordinates = this.get_world_intersection(event)
    this.state.mouse_down = false
  }

  get_world_intersection = function (mouse_event) {
    this.state.mouse.x = (mouse_event.clientX / window.innerWidth) * 2 - 1
    this.state.mouse.y = - (mouse_event.clientY / window.innerHeight) * 2 + 1

    this.state.raycaster.setFromCamera(this.state.mouse, this.state.camera)
    //TODO: We can massively simplify by storing references to important
    // objects in the world
    var world_plane = this.scene.children.find(mesh => { return mesh.geometry.type == "PlaneGeometry" })
    var intersects = this.state.raycaster.intersectObjects([world_plane])
    if (intersects.length > 0) {
      //Currently just selecting the world plane intersection
      //We need to expand this to filter out non-world plane objects
      // We also need to add non-world-plane objects to the object list
      // to make them clickable in an expanded event handler
      return intersects[0].point
    }
  }
}
export { InputHandler }
