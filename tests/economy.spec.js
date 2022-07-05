import { Economy } from '../src/economy'
// import HelloWorld from './HelloWorld.vue'

describe('Economy', () => {

  beforeEach(() => {

  });

  afterEach(() => {

  });


  it('should implement node creation', () => {
    // windowSpy.mockImplementation(() => ({
    //   location: {
    //     origin: "https://example.com"
    //   }
    // }));
    var economy = new Economy()
    var supply = new GlobalSupply()
    var demand = new GlobalDemand()
    console.log(economy.node_creation())
  })
})