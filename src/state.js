import * as THREE from 'three'

//Should state keep track of things like the raycaster, the mouse & the camera? Or should it
//Just be tracking our internal application state, such as mouse up/down,
// our created objects and game state.
// I think it should just be gamestate.
class State {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(
      75, // field of view -> in degrees? instead of Rads
      window.innerWidth / window.innerHeight, //Aspect Ratio
      0.1, // start plane of frustrum
      1000 // end plane of frustrum
    )
    // Raycasting source: https://stackoverflow.com/a/12749287
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
  }
}

export { State }