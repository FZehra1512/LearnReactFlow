import React, { useState } from "react";
import ReactFlow, { MiniMap, Background, Panel, Controls } from "reactflow";
import "reactflow/dist/style.css";

import initialNodes from "./nodes.jsx";
import initialEdges from "./edges.jsx";

const nodeColor = (node) => {
  switch (node.type) {
    case "input":
      return "#6ede87";
    case "output":
      return "#6865A5";
    default:
      return "#ff0072";
  }
};

export default function Flow() {
  const [variant, setVariant] = useState("cross");
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        defaultNodes={initialNodes}
        defaultEdges={initialEdges}
        fitView
      >
        <MiniMap nodeColor={nodeColor} nodeStrokeWidth={3} zoomable pannable />
        <Controls />
        <Background color="#ccc" variant={variant} />
        <Panel>
          <div>variant:</div>
          <button onClick={() => setVariant("dots")}>dots</button>
          <button onClick={() => setVariant("lines")}>lines</button>
          <button onClick={() => setVariant("cross")}>cross</button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
