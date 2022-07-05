import { Economy } from './economy'
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
    console.log(economy.node_creation())
  })
})