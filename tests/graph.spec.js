import { Graph } from '../src/game/graph'
import { Node } from '../src/node'
import { config } from '../app.config'

import { NodeIcon } from '../src/ui_objects/node_icon'
import { LinkPoint } from '../src/link_point';
jest.mock('../src/link_point')

jest.mock('../src/ui_objects/node_icon', () => {
  return {
    NodeIcon: jest.fn().mockImplementation(() => {
      return {}
    })
  }
});

describe('Graph', () => {
  let graph
  let node_1
  let node_2
  let mockLinkDetectionImplementation
  let areNodesLinked

  beforeEach(() => {
    graph = new Graph
    LinkPoint.mockClear()

    mockLinkDetectionImplementation = jest
      .spyOn(LinkPoint.prototype, 'is_linked_to_node_with_identifier')
      .mockImplementation((identifier) => {
        return areNodesLinked;
      })
  })

  describe("calculate_force_between_nodes", () => {
    //Note: because the force between nodes is a vector, rather than a scalar
    // testing can be difficult b/c the answer is stateful depending on the relative position
    // of the nodes. Ideally we'd be using vector comparisons, like is the force vector
    // pointing towards the other node, or away from it? But for now, we'll depend on manual comparisons.
    describe("when nodes have no linkages", () => {
      beforeEach(() => {
        areNodesLinked = false
      })

      describe("when the nodes are closer than the configured standoff distance", () => {
        beforeEach(() => {
          node_1 = new Node([0,0])
          node_2 = new Node([0, config.graph.node_spacing.STANDOFF_DISTANCE / 2])
        })

        it('the net force is repulsive', () => {
          var force_vector = graph.calculate_force_between_nodes(node_1, node_2)
          expect(force_vector[0]).toEqualZero()
          expect(force_vector[1]).toBeLessThan(0)
        })
      })

      describe("when the nodes are exactly at the configured standoff distance", () => {
        beforeEach(() => {
          node_1 = new Node([0, 0])
          node_2 = new Node([0, config.graph.node_spacing.STANDOFF_DISTANCE])
        })

        it('the net force is exactly zero', () => {
          var force_vector = graph.calculate_force_between_nodes(node_1, node_2)
          expect(force_vector[0]).toEqualZero()
          expect(force_vector[1]).toEqualZero()
        })
      })

      describe("when the nodes are farther than the standoff distance", () => {
        beforeEach(() => {
          node_1 = new Node([0, 0])
          node_2 = new Node([0, config.graph.node_spacing.STANDOFF_DISTANCE * 2] )
        })

        it('the net force is attractive', () => {
          var force_vector = graph.calculate_force_between_nodes(node_1, node_2)
          expect(force_vector[0]).toEqualZero()
          expect(force_vector[1]).toBeGreaterThan(0)
        })
      })
    })

    describe("when nodes are linked", () => {
      beforeEach(() => {
        areNodesLinked = true
      })

      describe("when the nodes are exactly at the configured standoff distance", () => {
          beforeEach(() => {
            node_1 = new Node([0, 0])
            node_2 = new Node([0, config.graph.node_spacing.STANDOFF_DISTANCE])
          })

        it('the net force is positive', () => {
          var force_vector = graph.calculate_force_between_nodes(node_1, node_2)
          expect(force_vector[0]).toEqualZero()
          expect(force_vector[1]).toBeGreaterThan(0)
        })
      })
    })
  })
})