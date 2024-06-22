// import { BaseEdge, getStraightPath } from "reactflow";

// export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY }) {
//   const [edgePath] = getStraightPath({
//     sourceX,
//     sourceY,
//     targetX,
//     targetY,
//   });

//   return (
//     <>
//       <BaseEdge id={id} path={edgePath} />
//     </>
//   );
// }


import { useCallback } from "react";
import { useStore, BaseEdge, getStraightPath } from "reactflow";

import { getEdgeParams } from "./utils";

function FloatingEdge({ id, source, target, markerEnd, style }) {
  const sourceNode = useStore(
    useCallback((store) => store.nodeInternals.get(source), [source])
  );
  const targetNode = useStore(
    useCallback((store) => store.nodeInternals.get(target), [target])
  );

  if (!sourceNode || !targetNode) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  const [edgePath] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  return (
    <BaseEdge
      id={id}
    //   className="react-flow__edge-path"
      path={edgePath}
    //   markerEnd={markerEnd}
    //   style={style}
    />
  );
}

export default FloatingEdge;
