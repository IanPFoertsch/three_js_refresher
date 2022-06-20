import * as THREE from 'three'

//Should state keep track of things like the raycaster, the mouse & the camera? Or should it
//Just be tracking our internal application state, such as mouse up/down,
// our created objects and game state.
// I think it should just be gamestate.
class State {
  constructor() {
    this.nodes = []
    this.links = []
    this.world_plane = null
    // Raycasting source: https://stackoverflow.com/a/12749287
  }
}

export { State }