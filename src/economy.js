import { Node } from "./node"

class GlobalSupply {
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

class GlobalDemand {
  constructor() {
    this.color_demand = {}
    Object.values(Node.COLORS).forEach(color => {
      this.color_demand[color] = 0
    })
  }

  increase_demand_for_color(color, amount_supplied) {
    this.color_demand[color] += amount_supplied
  }

  get_demand_for_color(color) {
    return this.color_demand[color]
  }
}

class Commodity {
  constructor(color) {
    this.color = color
  }

  //This is the global demand curve function
  // y = -x + intercept
  // ------------------------
  // y = price
  // x = _globally_ supplied quantity
  // intercept => A determinant of the height of the demand curve
  // -- Higher intercept = market demands more of this color,
  // -- Lower intercept = market demands less of this color
  get_current_price_at_global_supply(global_supply) {
    return (-global_supply) + window.state.economy.get_demand_for_color(this.color)
  }
}

class Economy {
  //The economy is the public interface here, everything except the global supply update
  //should be private
  constructor() {
    this.commodities = {}
    this.global_supply = new GlobalSupply()
    this.global_demand = new GlobalDemand()


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

  get_demand_for_color(color) {
    return this.global_demand.get_demand_for_color(color)
  }

  //Update the economy's supply and demand from the current state of the board
  update(state) {
    //Update supply
    var current_supply = new GlobalSupply()
    state.links.forEach(link => {
      current_supply.increase_supply_for_color(
        link.get_color_supplied(),
        link.get_quantity_supplied()
      )
    })
    this.global_supply = current_supply

    //Update demand
    var current_demand = new GlobalDemand()
    state.nodes.forEach(node => {
      node.demands_by_color().forEach(color_demanded => {
        current_demand.increase_demand_for_color(color_demanded, 10)
      })
    })
    this.global_demand = current_demand
  }
}

export { Economy, GlobalSupply }