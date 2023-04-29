import { UILink } from '../ui_objects/ui_link'

class Link {
  constructor() {
    this.rendered = false
    this.ui_representation = new UILink()
    this.origin = null
    this.destination = null
    this.id = crypto.randomUUID()
  }

  get_quantity_supplied() {
    //TODO: Make these values derived from the market
    return 10
  }

  get_color_supplied() {
    return this.origin.color
  }

  get_link_value() {
    //We should find a better way of accessing global entities than
    // storing it on the state. This causes a tight linkage between a node
    // link and a completely different entity
    return window.state.economy.get_price_for_color(this.origin.color) *
      this.get_quantity_supplied()
  }

  add_label() {
    this.ui_representation.add_label(
      this.get_link_value()
    )
  }

  is_valid_link(destination) {
    return this.origin.is_valid_link_to_destination(destination)
  }

  is_closed_link() {
    return this.destination !== null
  }

  get_origin_node() {
    if (this.origin) {
      return this.origin.get_parent_node()
    }
    return null
  }

  get_destination_node() {
    if (this.destination) {
      return this.destination.get_parent_node()
    }
    return null

  }

  set_origin(origin_object) {
    this.origin = origin_object
    this.origin.register_outgoing_link(this)

    this.update_render()
  }

  link_to_node(destination_node) {
    this.destination_node = destination_node
    destination_node.register_incoming_link(this)
    this.add_label()
    this.update_render()
  }

  draw_to_point(x, y) {
    this.ui_representation.draw_to_point(x, y)
  }

  update_render() {
    this.ui_representation.set_origin(
      this.origin.position[0],
      this.origin.position[1]
    )

    if (this.destination !== null) {
      this.draw_to_point(
        this.destination.position[0],
        this.destination.position[1]
      )
    }
  }

  dispose() {
    this.origin.de_register_outgoing_link(this.id)
    if (this.destination !== null) {
      this.destination.de_register_incoming_link()
    }
    this.ui_representation.dispose()
  }
}

export { Link }