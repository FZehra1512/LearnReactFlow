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





// import React from 'react';
// import { Handle, Position } from 'reactflow';

// const CustomNode = ({ data }) => {
//   return (
//     <div>
//       <div
//         style={{
//           padding: "10px 20px",
//           backgroundColor: "#fff",
//           border: "1px solid #000",
//           borderRadius: "5px",
//         }}
//       >
//         {data.label}
//       </div>
//       <Handle type="source" position={Position.Right} id="a" />
//       <Handle type="source" position={Position.Left} id="b" />
//       <Handle type="source" position={Position.Top} id="c" />
//       <Handle type="source" position={Position.Bottom} id="d" />
//       <Handle type="source" position={Position.Bottom} id="s" style={{left: 10}}/>
//       <Handle type="target" position={Position.Right} id="e" />
//       <Handle type="target" position={Position.Left} id="f" />
//       <Handle type="target" position={Position.Top} id="g" />
//       <Handle type="target" position={Position.Bottom} id="h" />
//       <Handle
//         type="target"
//         position={Position.Top}
//         id="t"
//         style={{ left: 10 }}
//       />
//     </div>
//   );
// };

// export default CustomNode;



// import React from 'react';
// import { Handle, Position } from 'reactflow';

// // DualHandle component to create a handle that can be both source and target
// const DualHandle = ({ idSource, idTarget, position, style }) => (
//   <>
//     <Handle type="source" position={position} id={idSource} style={{ ...style, zIndex: 1 }} />
//     <Handle type="target" position={position} id={idTarget} style={{ ...style, zIndex: 0 }} />
//   </>
// );

// const CustomNode = ({ data }) => {
//   return (
//     <div
//       style={{
//         padding: "10px 20px",
//         backgroundColor: "#fff",
//         border: "1px solid #000",
//         borderRadius: "5px",
//         position: "relative"
//       }}
//     >
//       {data.label}
//       <DualHandle idSource="a" idTarget="e" position={Position.Right} />
//       <DualHandle idSource="b" idTarget="f" position={Position.Left} />
//       <DualHandle idSource="c" idTarget="g" position={Position.Top} />
//       <DualHandle idSource="d" idTarget="h" position={Position.Bottom} />
//     </div>
//   );
// };

// export default CustomNode;


