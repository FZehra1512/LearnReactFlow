import React, { useCallback } from "react";
import { addEdge } from "reactflow";
import calculateNodePosition from "./NodePosition";

const NodeConnector = ({
  nodes,
  setNodes,
  edges,
  setEdges,
  contextMenu,
  setContextMenu,
  nodeCounter,
  setNodeCounter,
}) => {
  const onConnect = useCallback(
    (connection) => {
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

  return null;
};

export default NodeConnector;
