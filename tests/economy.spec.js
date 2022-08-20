import { Economy } from '../src/economy'
// import HelloWorld from './HelloWorld.vue'

const generate_mock_nodes = function(demanded_colors) {
  return demanded_colors.map((color_in_demand) => {
    return {
      demands_by_color: function () {
        return [color_in_demand]
      }
    }
  })
}

const generate_default_graph = function(nodes_demanding_colors) {

  return {
    get_links: function () { return [] },
    get_nodes: function () { return generate_mock_nodes(nodes_demanding_colors) }
  }
}


describe('Economy', () => {
  let state
  let economy
  let graph
  const jestConsole = console
  var nodes_demanding_colors = ["RED", "YELLOW", "BLUE", "ORANGE", "GREEN", "VIOLET"]

  beforeEach(() => {
    global.console = require('console');
    graph = generate_default_graph(nodes_demanding_colors)
    window.state = { get_graph: function() { return graph }}
  });

  afterEach(() => {
    global.console = jestConsole;
    window.state = undefined
  });

  describe("get_node_creation", () => {
    describe("with no colors supplied", () => {
      it('generates no new nodes', () => {
        economy = new Economy()
        economy.update()
        expect(economy.get_node_creation()).toEqual([])
      })
    })

    describe("with a single color being supplied", () => {
      it('generates a new node for the single color with a zero price', () => {
        graph.get_links = function() {
          return [{
            get_color_supplied: function () { return "RED" },
            get_quantity_supplied: function () { return 10 }
          }]
        }

        economy = new Economy()
        economy.update()

        expect(economy.get_node_creation()).toEqual(["RED"])
      })
    })

    describe("with multiple color being supplied", () => {
      it('generates a new node for each color at a low price', () => {
        graph = generate_default_graph(nodes_demanding_colors)
        graph.get_links = function() {
          return [
            {
              get_color_supplied: function () { return "RED" },
              get_quantity_supplied: function () { return 10 }
            },
            {
              get_color_supplied: function () { return "YELLOW" },
              get_quantity_supplied: function () { return 10 }
            }
          ]
        }

        economy = new Economy()
        economy.update()
        expect(economy.get_node_creation().sort()).toEqual(["YELLOW", "RED"].sort())
      })
    })

    describe("with colors supplied fractionally", () => {
      it('generates a new node for each color at a low price', () => {
        graph = generate_default_graph(nodes_demanding_colors)
        graph.get_links = function() {
          return [
            {
              get_color_supplied: function () { return "RED" },
              get_quantity_supplied: function () { return 5 }
            }
          ]
        }

        economy = new Economy()
        economy.update()
        expect(economy.get_node_creation().sort()).toEqual(["RED"].sort())
      })
    })
  })

  describe("get_node_deletion", () => {
    describe("all colors non-supplied", () => {
      it('triggers deletion of no new nodes', () => {
        graph = generate_default_graph(nodes_demanding_colors)
        economy = new Economy()
        economy.update()
        expect(economy.get_node_deletion()).toEqual([])
      })
    })

    describe("with a single color in high demand", () => {
      it('indicates deletion of the color in high demand', () => {
        graph = generate_default_graph(nodes_demanding_colors)

        var original_nodes = graph.get_nodes()

        graph.get_nodes = function() {
          return original_nodes.concat(generate_mock_nodes(["RED", "RED", "RED"]))
        }

        economy = new Economy()
        economy.update()
        expect(economy.get_node_deletion()).toEqual(["RED"])
      })
    })

    describe("multiple colors in high demand", () => {
      it('indicates deletion of each color in high demand', () => {
        graph = generate_default_graph(nodes_demanding_colors)
        var expanded_node_list = graph.get_nodes().concat(
          generate_mock_nodes(["RED", "RED", "RED"])
        ).concat(
          generate_mock_nodes(["BLUE", "BLUE", "BLUE"])
        )

        graph.get_nodes = function () {
          return expanded_node_list
        }


        economy = new Economy()
        economy.update()
        expect(economy.get_node_deletion()).toEqual(["RED", "BLUE"])
      })
    })
  })
})