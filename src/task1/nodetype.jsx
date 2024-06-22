import React, { memo } from "react";

const CustomNode = memo(({ data }) => {
  return <div>{data.label}</div>;
});

export default CustomNode;
