import {Node } from "./node"

class DemandCurve {
  constructor(color) {
    this.color = color
    this.intercept = 30
  }

  //This is the demand curve function
  //This.intercept  = y-intercept of graph
  price_at_quantity = function(quantity) {
    return (-quantity) + this.intercept
  }
}

class Economy {
  constructor() {
    this.demand_curves = {}
    this.prices = {}
    //TODO: I need to figure out a better way to manage working with the color constants
    // I constantly mismatch the colors & hex codes

    //initialize demand curves for colors
    Object.keys(Node.COLORS).forEach((color) => {
      var demand_curve_for_color = new DemandCurve(color)
      this.demand_curves[Node.COLORS[color]] = demand_curve_for_color
      this.prices[Node.COLORS[color]] = demand_curve_for_color.price_at_quantity(0)
    })
  }

  get_price_for_quantity_of_color(quantity, color) {
    return this.prices[color] * quantity
  }

  //seperate concepts of delivering color at a price, and calculating a new price according to the demand curve
  demand_curve_price_for_quantity_and_color(quantity, color) {
    return this.demand_curves[color].price_at_quantity(quantity)
  }

  //We need to feed quantities supplied to the economy so it can set the new prices
  //Create a supply update class?
  // Accepts a hash of colors => quantities supplied
  set_prices(supply_update) {
    Object.keys(supply_update).forEach(color => {
      this.prices[color] = this.demand_curve_price_for_quantity_and_color(supply_update[color], color)
    })
  }

}

export { Economy }