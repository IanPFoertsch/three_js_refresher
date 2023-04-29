
import { Node } from '../src/node'

describe('Node', () => {
  let node
  let state
  let position = [1,1]
  let tier = Node.TIERS.THREE
  let color = Node.COLORS.RED

  const jestConsole = console

  beforeEach(() => {
    global.console = require('console');
    window.scene = { add: function () {} }
  });

  afterEach(() => {
    global.console = jestConsole;
  });

  describe("Node creation", () => {
    describe("with default arguments", () => {
      it('creates a new node', () => {
        node = new Node(position, color, tier)
      })
    })
  })

  describe("has_existing_link", () => {
    describe("with the default link points but no links", () => {
      it('returns false', () => {
        node = new Node(position, color, tier)
        expect(node.has_existing_link()).toBe(false)
      })
    })

    describe("with a link point with an outgoing link", () => {
      let link = { the: "link" }
      it('returns true', () => {
        node = new Node(position, color, tier)
        node.link_points[0].register_incoming_link(link)
        expect(node.has_existing_link()).toBe(true)
      })
    })

    describe("with a link point with an incoming link", () => {
      let link = { the: "link" }
      it('returns true', () => {
        node = new Node(position, color, tier)
        node.link_points[0].register_outgoing_link(link)
        expect(node.has_existing_link()).toBe(true)
      })
    })
  })

  describe("is_linkable_to_origin", () => {
    let origin_node, destination_node
    let origin_node_link_point

    beforeEach(() => {
      origin_node = new Node(position, color, tier)
      origin_node_link_point = {
        parent_node: origin_node
      }
    });

    it('with an incompatible color it is not linkable', () => {
      destination_node = new  Node(position, Node.COLORS.BLUE, Node.TIERS.FOUR)
      expect(destination_node.is_linkable_to_origin(origin_node_link_point)).toBe(false)
    })

    it('with a compatible color but incompatible tier it is not linkable', () => {
      destination_node = new Node(position, Node.COLORS.ORANGE, Node.TIERS.FIVE)
      expect(destination_node.is_linkable_to_origin(origin_node_link_point)).toBe(false)
    })

    it('with a compatible color and compatible tier it is linkable', () => {
      destination_node = new Node(position, Node.COLORS.ORANGE, Node.TIERS.FOUR)
      expect(destination_node.is_linkable_to_origin(origin_node_link_point)).toBe(true)
    })

  })
})