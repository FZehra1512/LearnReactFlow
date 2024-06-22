import React, { useState } from "react";

const ContextMenu = ({ x, y, show, onClose, onAddNodes }) => {
  const [nodeCount, setNodeCount] = useState(1);

  if (!show) return null;

  const handleAddNodes = () => {
    const count = parseInt(nodeCount, 10);
    if (isNaN(count) || count <= 0) return;
    onAddNodes(count);
    onClose();
  };

  const style = {
    position: "absolute",
    top: y,
    left: x,
    background: "white",
    boxShadow: "0px 0px 5px rgba(0,0,0,0.5)",
    zIndex: 1000,
  };

  return (
    <div style={style}>
      <ul style={{ margin: 0, padding: 10, listStyle: "none" }}>
        <li>
          <input
            type="number"
            value={nodeCount}
            onChange={(e) => setNodeCount(e.target.value)}
            min="1"
            style={{ width: "50px" }}
          />
          <button onClick={handleAddNodes}>Add Connecting Nodes</button>
        </li>
      </ul>
      <button onClick={onClose}>x</button>
    </div>
  );
};

export default ContextMenu;
