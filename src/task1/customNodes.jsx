import React, { useCallback, useState, useEffect, useRef } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import ContextMenu from "./ContextMenu";
import { initialNodes, initialEdges } from "../config/initialData";
import CustomNode from "./nodetype";

const getNodeCenter = (nodeElement, nodePosition) => {
  const rect = nodeElement.getBoundingClientRect();
  const centerX = nodePosition.x + rect.width / 2;
  const centerY = nodePosition.y + rect.height / 2;
  console.log(centerX, centerY);
  return { centerX, centerY };
};

const CustomNodes = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0 });

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Modified: Added event handler for right-click on nodes
  const onNodeContextMenu = (event, node) => {
    event.preventDefault();
    setContextMenu({ show: true, x: event.clientX, y: event.clientY });
  };

  const onCloseContextMenu = () => {
    setContextMenu({ show: false, x: 0, y: 0 });
  };

  const handleAddNodes = (count) => {
    // const newNodes = Array.from({ length: count }, (_, index) => ({
    //   id: `new-node-${index}`,
    //   data: { label: `Child Node ${index + 1}` },
    //   position: { x: 100 + index * 100, y: 100 },
    // }));

    // setNodes([...nodes, ...newNodes]);
    const newNodes = [];
    for (let i = 0; i < count; i++) {
      newNodes.push({
        id: (nodes.length + i + 1).toString(),
        position: { x: Math.random() * 800, y: Math.random() * 600 },
        data: { label: `Node ${nodes.length + i + 1}` },
      });
    }
    setNodes((nds) => nds.concat(newNodes));
  };

  const nodeRef = useRef(null);

  useEffect(() => {
    if (nodeRef.current) {
      const node = nodes.find((n) => n.id === "1");
      const center = getNodeCenter(nodeRef.current, node.position);
      console.log("Node Center:", center);
    }
  }, [nodes]);


  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={onNodeContextMenu}
        // nodeTypes={{ customNode: CustomNode }}
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
        onAddNodes={handleAddNodes}
      />
    </div>
  );
};

export default CustomNodes;
