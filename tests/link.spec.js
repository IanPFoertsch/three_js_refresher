
// jest.mock('../src/ui_objects/ui_link');
import { Link } from '../src/game/link'
// import { UILink } from '../src/ui_objects/ui_link';


//Mocking constructors of other classes:
// src: https://thewebdev.info/2022/02/24/how-to-mock-a-dependencys-constructor-with-jest/
jest.mock('../src/ui_objects/ui_link', () => {
  return {
    UILink: jest.fn().mockImplementation(() => {
      return {
        set_origin: function () { }
      }
    })
  }
});

describe('Link', () => {
  let link
  let origin_link_point
  beforeEach(() => {
    origin_link_point = {
      get_node_color: function() { return "RED" },
      register_outgoing_link: function (link) {},
      position: [1, 2]
    }
    window.state = {
      economy: {
        get_price_for_color: function (color) { return 10 }
      }
    }
    link = new Link()
    link.set_origin(origin_link_point)
  })

  afterEach(() => {
    window.state = undefined
  });


  it('should implement node creation', () => {
    expect(link.get_link_value()).toEqual(100)
  })
})