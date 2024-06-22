import React, { useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import ContextMenu from "./components/ContextMenu";
import { initialNodes, initialEdges } from "../config/initialData";
import CustomNode from "./components/CustomNode";
import CustomEdge from "./components/CustomEdge";
import NodeConnector from "./components/NodeConnector";

// Custom nodes and edges types
const nodeTypes = {
  customNode: CustomNode,
};
const edgeTypes = {
  customEdge: CustomEdge,
};

const AddandConnectNodes = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // State for the context menu of nodes
  const [contextMenu, setContextMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    nodeId: null,
  });

  // When a node is right clicked, it opens the context menu
  const onNodeContextMenu = (event, node) => {
    event.preventDefault();
    const nodePosition = nodes.find((n) => n.id === node.id)?.position || {
      x: 0,
      y: 0,
    };
    setContextMenu({
      show: true,
      x: nodePosition.x + 10,
      y: nodePosition.y + 10,
      nodeId: node.id,
    });
  };

  // Closes the context menu
  const onCloseContextMenu = () => {
    setContextMenu({ show: false, x: 0, y: 0, nodeId: null });
  };

  // Close context menu on nodes change or viewport change
  const handleViewportChange = () => {
    if (contextMenu.show) {
      onCloseContextMenu();
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={(changes) => {
            onNodesChange(changes);
            handleViewportChange();
          }}
          onEdgesChange={onEdgesChange}
          onNodeContextMenu={onNodeContextMenu}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onMoveEnd={handleViewportChange}
          nodeOrigin={[0.5, 0.5]}
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </ReactFlowProvider>

      <ContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        show={contextMenu.show}
        onClose={onCloseContextMenu}
        onAddNodes={(count) => {
          addAndConnectNodes(contextMenu.nodeId, count);
          onCloseContextMenu();
        }}
      />

      <NodeConnector
        nodes={nodes}
        setNodes={setNodes}
        edges={edges}
        setEdges={setEdges}
        contextMenu={contextMenu}
        setContextMenu={setContextMenu}
        nodeCounter={nodeCounter}
        setNodeCounter={setNodeCounter}
      />
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <AddandConnectNodes />
  </ReactFlowProvider>
);
