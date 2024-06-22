import React, { useCallback, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";
import ContextMenu from "./components/ContextMenu";
import { initialNodes, initialEdges } from "../config/initialData";
import CustomNode from "./components/CustomNode";
import CustomEdge from "./components/CustomEdge";
import calculateNodePosition from "../components/nodePosition";


// Custom nodes and edges types
const nodeTypes = {
  customNode: CustomNode,
};
const edgeTypes = {
  customEdge: CustomEdge,
};


// The component to add and connect nodes
const AddandConnectNodes = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  //Nodes Counter for new Nodes labels and ids
  const [nodeCounter, setNodeCounter] = useState(nodes.length);

  // State for the context menu of nodes
  const [contextMenu, setContextMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    nodeId: null,
  });


  // Function to connect edges between nodes
  const onConnect = useCallback(
    (connection) => {
      console.log("I am called", connection);
      const edge = {
        ...connection,
        type: "customEdge",
        sourceHandle: `${connection.source}-handle`,
        targetHandle: `${connection.target}-handle`,
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );


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

  // Function to connect fixed number of nodes to a specific node
  const addAndConnectFixedNodes = (nodeId, numberOfNodes) => {
    const newNodes = [];
    const newEdges = [];

    // The position of source node to which other needs to be connected
    const sourceNodePosition = nodes.find((n) => n.id === nodeId).position;

    // Find existing connected nodes to the source node
    const existingEdges = edges.filter((edge) => edge.source === nodeId);
    const existingConnectedNodes = existingEdges.map((edge) =>
      nodes.find((n) => n.id === edge.target)
    );

    // For connecting more nodes, each time angle will change to accomodate all connected nodes
    const totalNodes = existingConnectedNodes.length + numberOfNodes;
    const angle = 360 / totalNodes;

    // Update positions for existing connected nodes based on new angle
    existingConnectedNodes.forEach((node, index) => {
      node.position = calculateNodePosition(
        sourceNodePosition,
        angle,
        index,
        totalNodes
      );
    });

    // Add new nodes and edges in loop
    for (let i = 0; i < numberOfNodes; i++) {
      const newNodeId = `node-${nodeCounter + i + 1}`;

      // Data of new node to be added
      const newNode = {
        id: newNodeId,
        type: "customNode",
        data: { label: `Node ${nodeCounter + i + 1}` },
        position: calculateNodePosition(
          sourceNodePosition,
          angle,
          existingConnectedNodes.length + i,
          totalNodes
        ),
      };

      newNodes.push(newNode);

      // Data of new edges to be created
      newEdges.push({
        id: `edge-${nodeId}-${newNodeId}`,
        type: "customEdge",
        source: nodeId,
        sourceHandle: `${nodeId}-handle`,
        target: newNodeId,
        targetHandle: `${newNodeId}-handle`,
      });
    }

    // finally setting nodes to render on screen, only nodes with unique ids because nodes positions change, they might be duplicated
    setNodes((nds) => {
      const updatedNodes = nds.map((node) => {
        const existingNode = existingConnectedNodes.find(
          (n) => n.id === node.id
        );
        return existingNode ? existingNode : node;
      });
      return [...updatedNodes, ...newNodes];
    });

    // Finally setting edges
    setEdges((eds) => [...eds, ...newEdges]);

    // Increment the nodes counter
    setNodeCounter((count) => count + numberOfNodes);
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
          onConnect={onConnect}
          onNodeContextMenu={onNodeContextMenu}
          nodeTypes={nodeTypes} // Set the custom node types
          edgeTypes={edgeTypes}
          onMoveEnd={handleViewportChange}
          nodeOrigin={[0.5, 0.5]} // All nodes are positioned from center
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
          addAndConnectFixedNodes(contextMenu.nodeId, count);
          onCloseContextMenu(); // After clicking the button close context menu
        }}
      />
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <AddandConnectNodes />
  </ReactFlowProvider>
);
