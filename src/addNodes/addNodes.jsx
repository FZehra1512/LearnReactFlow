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
import ContextMenu from "../task1/ContextMenu";
import { initialNodes, initialEdges } from "../config/initialData";
import CustomNode from "../components/CustomNode";
import CustomEdge from "../components/CustomEdge";
import calculateNodePosition from "../components/nodePosition";


// Custom nodes and edges types
  const nodeTypes = {
    'customNode': CustomNode,
  };
  const edgeTypes = {
    'customEdge': CustomEdge,
  };

const AddNodes = () => {
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

  // Function to add and connect nodes
  const addAndConnectNodes = (nodeId, numberOfNodes) => {
    const newNodes = [];
    const newEdges = [];
    const sourceNode = nodes.find((n) => n.id === nodeId);
    const sourceNodePosition = sourceNode.position;

    // Find existing connected nodes
    const existingEdges = edges.filter((edge) => edge.source === nodeId);
    const existingConnectedNodes = existingEdges.map((edge) =>
      nodes.find((n) => n.id === edge.target)
    );

    const totalNodes = existingConnectedNodes.length + numberOfNodes;
    const angle = 360 / totalNodes;

    // Update positions for existing connected nodes
    existingConnectedNodes.forEach((node, index) => {
      node.position = calculateNodePosition(
        sourceNodePosition,
        angle,
        index,
        totalNodes
      );
    });

    // Add new nodes and edges
    for (let i = 0; i < numberOfNodes; i++) {
      const newNodeId = `node-${nodeCounter + i + 1}`;
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
      newEdges.push({
        id: `edge-${nodeId}-${newNodeId}`,
        type: "customEdge",
        source: nodeId,
        sourceHandle: `${nodeId}-handle`,
        target: newNodeId,
        targetHandle: `${newNodeId}-handle`,
      });
    }

    setNodes((nds) => {
      const updatedNodes = nds.map((node) => {
        const existingNode = existingConnectedNodes.find(
          (n) => n.id === node.id
        );
        return existingNode ? existingNode : node;
      });
      return [...updatedNodes, ...newNodes];
    });

    setEdges((eds) => [...eds, ...newEdges]);

    // Increment the counter
    setNodeCounter((count) => count + numberOfNodes);
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          // onNodesChange={onNodesChange}
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
    </div>
  );
};



// export default AddNodes;
export default () => (
  <ReactFlowProvider>
    <AddNodes />
  </ReactFlowProvider>
);


// Function to add and connect nodes
  // const addAndConnectNodes = (nodeId, numberOfNodes) => {
  //   const newNodes = [];
  //   const newEdges = [];
  //   const sourceNode = nodes.find((n) => n.id === nodeId);
  //   const sourceNodePosition = sourceNode.position;

  //   // Find existing connected nodes
  //   const existingEdges = edges.filter((edge) => edge.source === nodeId);
  //   const existingConnectedNodes = existingEdges.map((edge) =>
  //     nodes.find((n) => n.id === edge.target)
  //   );

  //   const totalNodes = existingConnectedNodes.length + numberOfNodes;
  //   const angle = 360 / totalNodes;

  //   // Update positions for existing connected nodes
  //   existingConnectedNodes.forEach((node, index) => {
  //     node.position = calculateNodePosition(sourceNodePosition, angle, index);
  //   });

  //   // Add new nodes and edges
  //   for (let i = 0; i < numberOfNodes; i++) {
  //     const newNodeId = `node-${nodes.length + i + 1}`;
  //     const newNode = {
  //       id: newNodeId,
  //       type: "customNode",
  //       data: { label: `Node ${nodes.length + i + 1}` },
  //       position: calculateNodePosition(
  //         sourceNodePosition,
  //         angle,
  //         existingConnectedNodes.length + i
  //       ),
  //     };

  //     newNodes.push(newNode);
  //     newEdges.push({
  //       id: `edge-${nodeId}-${newNodeId}`,
  //       type: "customEdge",
  //       source: nodeId,
  //       sourceHandle: `${nodeId}-handle`,
  //       target: newNodeId,
  //       targetHandle: `${newNodeId}-handle`,
  //     });
  //   }

  //   setNodes((nds) => [...nds, ...existingConnectedNodes, ...newNodes]);
  //   setEdges((eds) => [...eds, ...newEdges]);
  //   console.log(nodes, edges);
  // };



  // Connects the edges between nodes
  // const onConnect = useCallback(
  //   (connection) => {
  //     const edge = { ...connection, type: "customEdge" };
  //     setEdges((eds) => addEdge(edge, eds));
  //   },
  //   [setEdges]
  // );


    // const onNodeContextMenu = (event, node) => {
  //   event.preventDefault();
  //   setContextMenu({
  //     show: true,
  //     x: event.clientX,
  //     y: event.clientY,
  //     nodeId: node.id,
  //   });
  // };


// // Function to get the center coordinates of a node
//   const getNodeCenterCoordinates = (nodeId, nodesArray) => {
//     const node = nodesArray.find((n) => n.id === nodeId);
//     if (!node) return null;

//     const { x, y, width, height } = node.position;
//     const centerX = x + width / 2;
//     const centerY = y + height / 2;

//     // Apply current zoom and viewport transformation
//     const { transform } = reactFlowInstance;
//     const [tx, ty, tzoom] = transform;

//     const transformedX = centerX * tzoom + tx;
//     const transformedY = centerY * tzoom + ty;

//     return { x: transformedX, y: transformedY };
//   };
//   const center = getNodeCenterCoordinates("1", initialNodes);
//   console.log(center);