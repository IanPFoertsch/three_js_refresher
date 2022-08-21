import * as THREE from 'three'
class LinkPoint {
  static offset = 3
  static calculated_offsets = {}
  static calculate_offset = function (rotation) {
    if (LinkPoint.calculated_offsets[rotation] === undefined) {

      LinkPoint.calculated_offsets[rotation] = [
        (Math.cos((rotation * 60) * (Math.PI / 180)) * LinkPoint.offset),
        (Math.sin((rotation * 60) * (Math.PI / 180)) * LinkPoint.offset)
      ]

    }

    return LinkPoint.calculated_offsets[rotation]
  }

  constructor(position, connection_number, parent_node) {
    this.geometry = new THREE.CircleGeometry(.5, 10);
    this.material = new THREE.MeshPhongMaterial({ color: 0xFFFFFF });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.userData.parent = this
    this.parent_node = parent_node
    this.connection_number = connection_number
    this.position = [0,0]
    this.incoming_link = null
    this.outgoing_link = null
    this.update_position(position)
    window.scene.add(this.mesh)
  }

  update_position(new_position) {
    this.position[0] = new_position[0] + LinkPoint.calculate_offset(this.connection_number)[0]
    this.position[1] = new_position[1] + LinkPoint.calculate_offset(this.connection_number)[1]

    if (this.incoming_link !== null) {
      this.incoming_link.update_render()
    }

    if (this.outgoing_link !== null) {
      this.outgoing_link.update_render()
    }

    this.mesh.position.set(this.position[0], this.position[1], 0)
  }

  is_linked_to_node_with_identifier(other_node_identifier) {
    return this.get_linked_nodes().map((linked_node) => {
      return linked_node.identifier
    }).includes(other_node_identifier)
  }

  get_linked_nodes() {
    var nodes = []
    if (this.incoming_link) {
      nodes.push(this.incoming_link.get_origin_node())
    }

    if (this.outgoing_link && this.outgoing_link.is_closed_link()) {
      nodes.push(this.outgoing_link.get_destination_node())
    }

    return nodes
  }

  has_existing_link() {
    return this.incoming_link !== null || this.outgoing_link !== null
  }

  get_node_color() {
    this.parent_node.color
  }

  //Can we just cut out the middleman here?
  //This is a bad pattern -> We need to consolidate the link validity logic into
  // one place so we're not chasing it all over multiple classes & Files
  is_valid_link_to_destination(destination_link_point) {
    //are we linking to a destination that already has a registered input?
    // Does the destination node tell us we're compatible?
    return destination_link_point.is_valid_link_to_origin(this)
  }

  is_valid_link_to_origin(origin_link_point) {
    return this.incoming_link === null &&
      this.parent_node.is_linkable_to_origin(origin_link_point)
  }

  get_node_color() {
    return this.parent_node.color
  }

  get_parent_node() {
    return this.parent_node
  }

  register_incoming_link(incoming_link) {
    this.incoming_link = incoming_link
  }

  register_outgoing_link(outgoing_link) {
    this.outgoing_link = outgoing_link
  }

  de_register_outgoing_link() {
    this.outgoing_link = null
  }

  de_register_incoming_link() {
    this.incoming_link = null
  }

  can_create_outgoing_link() {
    return this.outgoing_link === null
  }

  dispose() {
    if (this.incoming_link != null ) {
      //This is possibly backward as the links themselves call back to the
      // linkpoints to set the incoming or outgoing link variables to null
      // TODO: Refactor this
      this.incoming_link.dispose()
    }

    if (this.outgoing_link != null) {
      //This is possibly backward as the links themselves call back to the
      // linkpoints to set the incoming or outgoing link variables to null
      // TODO: Refactor this
      this.outgoing_link.dispose()
    }

    this.geometry.dispose()
    this.material.dispose()
    window.scene.remove(this.mesh)
  }
}


export { LinkPoint }