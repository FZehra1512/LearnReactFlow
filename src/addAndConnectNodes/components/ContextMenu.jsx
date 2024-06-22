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
    borderRadius: "10px",
    boxShadow: "2px 2px 5px 2px rgba(0,0,0,0.2)",
    zIndex: 1000,
  };

  return (
    <div style={style}>
      <ul style={{ margin: 0, padding: 10, listStyle: "none" }}>
        <button
          style={{
            fontWeight: "bold",
            marginBottom: "10px",
            backgroundColor: "#ddd",
            color: "#000",
          }}
          onClick={onClose}
        >
          x
        </button>
        <li style={{ display: "flex", flexDirection: "column" }}>
          <input
            type="number"
            value={nodeCount}
            onChange={(e) => setNodeCount(e.target.value)}
            min="1"
            style={{
              width: "150px",
              height: "30px",
              marginBottom: "10px",
            }}
          />
          <button
            style={{ backgroundColor: "#ddd", color: "#000" }}
            onClick={handleAddNodes}
          >
            Add
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ContextMenu;
