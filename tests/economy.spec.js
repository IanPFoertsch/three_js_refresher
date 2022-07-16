import { Economy } from '../src/economy'
// import HelloWorld from './HelloWorld.vue'

describe('Economy', () => {
  let state
  let economy


  beforeEach(() => {
    state = {
      links: [
        {
          get_color_supplied: function () { return "RED" },
          get_quantity_supplied: function () { return 10 }
        },
      ],
      nodes: [
        {
          demands_by_color: function () {
            return ["RED", "ORANGE", "YELLOW"]
          }
        }
      ]
    }

    economy = new Economy()
    economy.update(state)
  });

  afterEach(() => {

  });

  it.only('should implement creating new nodes', () => {
    // windowSpy.mockImplementation(() => ({
    //   location: {
    //     origin: "https://example.com"
    //   }
    // }));


    console.log(economy.node_creation())
  })
})