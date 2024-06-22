import React from "react";
import { Handle, Position } from "reactflow";

const CustomNode = ({ id, data }) => {
  return (
    <div
      style={{
        padding: "10px 20px",
        backgroundColor: "#fff",
        border: "1px solid #000",
        borderRadius: "5px",
        position: "relative",
      }}
    >
      {data.label}
      {/* Central invisible handle */}
      <Handle
        type="source"
        position={Position.Top}
        id={`${id}-handle`}
        style={{ visibility: "hidden", top: "50%", left: "50%" }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id={`${id}-handle`}
        style={{ visibility: "hidden", top: "50%", left: "50%" }}
      />
    </div>
  );
};

export default CustomNode;
