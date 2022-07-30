import { Economy } from '../src/economy'
// import HelloWorld from './HelloWorld.vue'

const generate_default_state = function() {
  return {
    links: [],
    nodes: [
      {
        demands_by_color: function () {
          return ["RED"]
        }
      },
      {
        demands_by_color: function () {
          return ["YELLOW"]
        }
      },
      {
        demands_by_color: function () {
          return ["BLUE"]
        }
      },
      {
        demands_by_color: function () {
          return ["ORANGE"]
        }
      },
      {
        demands_by_color: function () {
          return ["GREEN"]
        }
      },
      {
        demands_by_color: function () {
          return ["VIOLET"]
        }
      }
    ]
  }
}

describe('Economy', () => {
  let state
  let economy
  const jestConsole = console


  beforeEach(() => {
    global.console = require('console');
  });

  afterEach(() => {
    global.console = jestConsole;
  });

  describe("node_creation", () => {
    describe("with no colors supplied", () => {
      it('generates no new nodes', () => {
        state = generate_default_state()
        economy = new Economy()
        economy.update(state)
        expect(economy.node_creation()).toEqual([])
      })
    })

    describe("with a single color being supplied", () => {
      it('generates a new node for the single color with a zero price', () => {
        state = generate_default_state()
        state.links = [
          {
            get_color_supplied: function () { return "RED" },
            get_quantity_supplied: function () { return 10 }
          }
        ]

        economy = new Economy()
        economy.update(state)
        expect(economy.node_creation()).toEqual(["RED"])
      })
    })

    describe("with multiple color being supplied", () => {
      it('generates a new node for each color at a low price', () => {
        state = generate_default_state()
        state.links = [
          {
            get_color_supplied: function () { return "RED" },
            get_quantity_supplied: function () { return 10 }
          },
          {
            get_color_supplied: function () { return "YELLOW" },
            get_quantity_supplied: function () { return 10 }
          }
        ]

        economy = new Economy()
        economy.update(state)
        expect(economy.node_creation().sort()).toEqual(["YELLOW", "RED"].sort())
      })
    })

    describe("with multiple color being supplied", () => {
      it('generates a new node for each color at a low price', () => {
        state = generate_default_state()
        state.links = [
          {
            get_color_supplied: function () { return "RED" },
            get_quantity_supplied: function () { return 10 }
          },
          {
            get_color_supplied: function () { return "YELLOW" },
            get_quantity_supplied: function () { return 10 }
          }
        ]

        economy = new Economy()
        economy.update(state)
        expect(economy.node_creation().sort()).toEqual(["YELLOW", "RED"].sort())
      })
    })

    describe("with colors supplied fractionally", () => {
      it('generates a new node for each color at a low price', () => {
        state = generate_default_state()
        state.links = [
          {
            get_color_supplied: function () { return "RED" },
            get_quantity_supplied: function () { return 5 }
          },
        ]

        economy = new Economy()
        economy.update(state)
        expect(economy.node_creation().sort()).toEqual(["RED"].sort())
      })
    })
  })
})