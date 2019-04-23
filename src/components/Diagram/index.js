import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import * as d3 from 'd3'
import dagreD3 from 'dagre-d3'
import '../../styles/style.css'

export default class Diagram extends Component {
    constructor (props) {
        super(props)
        this.state = {
          error: null,
          isLoading: true,
          dag: [
              {
                  id: "node a",
                  source: [],
                  description: "this is node a"
              },
              {
                  id: "node b",
                  source: [],
                  description: "this is node b"
              },
              {
                  id: "node c",
                  source: ["node a", "node b"],
                  description: "this is node c"
              },
          ]
        }
      }

    componentDidMount() {
        this.drawGraph();
    }

    drawGraph() {
        // Create the input graph
        var g = new dagreD3.graphlib.Graph()
          .setGraph({})
          .setDefaultEdgeLabel(function() { return {}; });

        this.state.dag.forEach(
          (node, index) => {
            g.setNode(node.id, {label: node.id, class: "nodeclass", description: node.description});
            node.source.forEach(
              (source, index) => {
                g.setEdge(source, node.id)
              }
            )
          }
        )

        g.nodes().forEach(function(v) {
            var node = g.node(v);
            // Round the corners of the nodes
            node.rx = node.ry = 5;
        });

        // Create the renderer
        var render = new dagreD3.render();

        // Set up an SVG group so that we can translate the final graph.
        var svg = d3.select(ReactDOM.findDOMNode(this.refs.nodeTree));
        var svgGroup = d3.select(ReactDOM.findDOMNode(this.refs.nodeTreeGroup));

        // Run the renderer. This is what draws the final graph.
        render(d3.select(ReactDOM.findDOMNode(this.refs.nodeTreeGroup)), g);

        // Center the graph
        var xCenterOffset = 50 + (svg.attr("width") - g.graph().width) / 2;
        svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
        svg.attr("height", g.graph().height + 40);
    }

    render() {
      return (<svg id="nodeTree" ref="nodeTree" width="960" height="600"><g ref="nodeTreeGroup"/></svg>
      )
    };
}