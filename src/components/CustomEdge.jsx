import { BaseEdge, getStraightPath } from "reactflow";

export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY }) {
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
    </>
  );
}







// CustomEdge.js
// import React from 'react';
// import { getBezierPath, EdgeText } from 'reactflow';

// const CustomEdge = ({
//   id,
//   sourceX,
//   sourceY,
//   targetX,
//   targetY,
//   sourcePosition,
//   targetPosition,
//   style = {},
//   data,
//   markerEnd,
// }) => {
//   const [edgePath, labelX, labelY] = getBezierPath({
//     sourceX,
//     sourceY,
//     targetX,
//     targetY,
//     sourcePosition,
//     targetPosition,
//   });

//   return (
//     <>
//       <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
//       <EdgeText x={labelX} y={labelY} label={data?.text || ''} labelStyle={{ fill: 'red' }} />
//     </>
//   );
// };

// export default CustomEdge;
