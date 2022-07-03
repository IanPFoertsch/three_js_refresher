import {Node } from "./node"

class GlobalSupply {
  //maybe this should just be derived from linkages?
  constructor() {
    this.color_supply = {}
    Object.values(Node.COLORS).forEach(color => {
      this.color_supply[color] = 0
    })
  }

  increase_supply_for_color(color, amount_supplied) {
    this.color_supply[color] += amount_supplied
  }

  get_supply_for_color(color) {
    return this.color_supply[color]
  }
}


class DemandCurve {
  constructor(color) {
    this.color = color
    //These intercepts are how our demand curve raises & lowers
    // we need to derive the intercept from a function of how
    // many nodes accepting our color there are on the board.
    this.intercept = 30

  }

  nodes_accepting_color = function() {
    var demand_by_color = {}
    window.state.nodes.forEach(node => {
      //get the node's color and increment the
      console.log(node.demands_by_color)
    })
  }

  //This is the demand curve function
  //This.intercept  = y-intercept of graph
  price_at_quantity = function(quantity) {
    return (-quantity) + this.intercept
  }
}

class Commodity {
  constructor(color) {
    this.color = color
    this.demand_curve = new DemandCurve(color)
  }

  //This is tricky -> We're not calculating the price for a given amount we're supplying,
  //We're calculating the global price for a commodity at a current global supply level
  // so the parameter is the _GLOBAL_ amount of commodity x being supplied accross the entire economy
  //
  get_current_price_at_global_supply(global_supply) {
    return this.demand_curve.price_at_quantity(global_supply)
  }
}

class Economy {
  //The economy is the public interface here, everything except the global supply update
  //should be private
  constructor() {
    this.commodities = {}
    this.global_supply = new GlobalSupply()


    Object.keys(Node.COLORS).forEach((color) => {
      var commodity = new Commodity(color)
      this.commodities[color] = commodity
    })
  }

  get_price_for_color(color) {
    return this.commodities[color].get_current_price_at_global_supply(
      this.global_supply.get_supply_for_color(color)
    )
  }

  update_global_supply(global_supply) {
    this.global_supply = global_supply
  }
}

export { Economy, GlobalSupply }