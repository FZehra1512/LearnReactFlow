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
import calculateNodePosition from "./components/NodePosition";


// Custom nodes and edges types
const nodeTypes = {
  customNode: CustomNode,
};
const edgeTypes = {
  customEdge: CustomEdge,
};


// The component to add and connect nodes
const AddandConnectNodes = () => {
  //Nodes and edges states
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  //Nodes Counter to keep track of the total number of nodes, used to assign new node ids and labels
  const [nodeCounter, setNodeCounter] = useState(nodes.length);

  // State for the context menu of nodes
  const [contextMenu, setContextMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    nodeId: null,
  });

  // Function to connect edges between nodes, since we are not connecting edges manually. This function is never called
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

  // When a node is right clicked, it opens the context menu of that node
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


  // function that returns an array of all children, grandchildren nodes of a parent/source node

  const findAllConnectedNodes = (startNodeId, edges, visited = new Set()) => {
    if (visited.has(startNodeId)) {
      return [];
    }
    visited.add(startNodeId);

    // Finding the direct connnected edges of the parent/source node
    const connectedEdges = edges.filter((edge) => edge.source === startNodeId);

    // Finding the direct connnected nodes of the parent/source node using edges
    const connectedNodes = new Set();
    connectedEdges.forEach((edge) => {
      connectedNodes.add(edge.target);
    });

    // Adding children and then grandchildrens of the parent/source node in the array through recursion
    let children = [];
    connectedNodes.forEach((nodeId) => {
      children.push(nodeId);
      const grandchildren = findAllConnectedNodes(nodeId, edges, visited);
      children = children.concat(grandchildren);
    });

    return children;
  };


  // Function to update the positions of the child nodes (children + grandchildren if there is any) when position of parent changes by dx and dy
  // It returns an array of all nodes with updated positions of specific nodes.
  const updateNodesOnChangePositions = (nodeId, dx, dy) => {
    const connectedNodeIds = new Set(findAllConnectedNodes(nodeId, edges));
    const updatedNodes = nodes.map((n) => {
      if (n.id === nodeId || connectedNodeIds.has(n.id)) {
        return {
          ...n,
          position: {
            x: n.position.x + dx,
            y: n.position.y + dy,
          },
        };
      }
      return n;
    });
    return updatedNodes;
  };


  // Function to update the positions of all nodes except the node to which new children are added
  // This function is required when new children are added to a node, the parent and siblings of this node moves
  // and this nodes take the position of its parent. It also returns array of all nodes
  const updateNdsPositionsForNewChildren = (
    nodeId,
    parentNodeId,
    dx,
    dy,
    nds
  ) => {
    return nds.map((node) => {
      if (node.id !== nodeId && node.id !== parentNodeId) {
        return {
          ...node,
          position: {
            x: node.position.x + dx,
            y: node.position.y + dy,
          },
        };
      }
      return node;
    });
  };


  // Function to move the source node (The node to which new children have to be added), at the center/or at parents position ,if there is any parent.
  // This node position is changed before adding its child nodes
  const moveToCenter = (nodeId) => {
    const nodeToBeMoved = nodes.find((n) => n.id === nodeId);
    const parentNode = nodes.find((n) => n.id === nodeToBeMoved.data.parentId);

    if (parentNode) {
      // Update child node position to parent's position
      const newPosition = { ...parentNode.position };

      console.log;
      // Generate positions for the parent node
      const dx = 3 * (parentNode.position.x - nodeToBeMoved.position.x),
        dy = 3 * (parentNode.position.y - nodeToBeMoved.position.y);

      // Update parent node position
      parentNode.position = {
        x: parentNode.position.x + dx,
        y: parentNode.position.y + dy,
      };

      // Update node positions
      const childAndParentMoved = nodes.map((n) => {
        if (n.id === nodeId) {
          return {
            ...n,
            position: newPosition,
          };
        } else if (n.id === parentNode.id) {
          return {
            ...n,
            position: parentNode.position,
          };
        }
        return n;
      });

      setNodes(childAndParentMoved);

      // When this node is moved, its parent and all siblings also have to be moved.
      setNodes(
        updateNdsPositionsForNewChildren(
          nodeId,
          parentNode.id,
          dx,
          dy,
          childAndParentMoved
        )
      );
    }
  };

  
  // Function to connect fixed number of nodes to a specific node
  const addAndConnectFixedNodes = async (nodeId, numberOfNodes) => {

    // Moving this node, first to its parent position before adding children
    moveToCenter(nodeId);

    // Getting the latest state of nodes using promises
    const latestNodes = await new Promise((resolve) => {
      setNodes((prevNodes) => {
        resolve(prevNodes);
        return prevNodes;
      });
    });

    const newNodes = [];
    const newEdges = [];
    // The position of source node to which other needs to be connected
    const sourceNodePosition = latestNodes.find(
      (n) => n.id === nodeId
    ).position;

    // Find existing connected nodes to the source node
    const existingEdges = edges.filter((edge) => edge.source === nodeId);
    const existingConnectedNodes = existingEdges.map((edge) =>
      latestNodes.find((n) => n.id === edge.target)
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
        data: {
          label: `Node ${nodeCounter + i + 1}`,
          parentId: nodeId,
        },
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

    // finally setting nodes to render on screen, only nodes with unique ids because when existing nodes positions change, they might be duplicated
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



  // // Function to drag the whole web of children when the parent node is dragged
  const onNodesDrag = useCallback(
    (event, node) => {
      const { movementX, movementY } = event;
      const dx = movementX;
      const dy = movementY;

      const updatedNodes = updateNodesOnChangePositions(node.id, dx, dy);
      setNodes(updatedNodes);
    },
    [nodes, edges, setNodes]
  );



  return (
    // The parent div of ReactFlow must have a width and a height
    <div style={{ width: "100vw", height: "100vh" }}> 
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
        onNodeDrag={onNodesDrag}
        nodeOrigin={[0.5, 0.5]} // All nodes are positioned from center
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>

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
