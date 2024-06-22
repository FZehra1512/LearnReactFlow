const calculateNodePosition = (sourcePosition, angle, index, totalNodes) => {
    let edgeLength = 150;
    console.log(totalNodes);
    if (totalNodes > 7 && totalNodes < 16) {
        edgeLength = edgeLength * (index % 2 === 0 ? 1 : 2);
    } else if(totalNodes > 15 && totalNodes < 32){
        if(index % 2 !== 0)
            edgeLength = edgeLength * 3;
        else {
            if (index % 4 === 0)
                edgeLength = edgeLength * 1;
            else 
                edgeLength = edgeLength * 2;
        }
    } else {
        edgeLength = 150;
    }
    const newAngle = (0 + index * angle) * (Math.PI / 180);

    return {
      x: sourcePosition.x + edgeLength * Math.cos(newAngle),
      y: sourcePosition.y + edgeLength * Math.sin(newAngle),
    };

};

export default calculateNodePosition;


//   const newAngle = index * angle * (Math.PI / 180);
//   return {
//     x: sourcePosition.x + 150 * Math.cos(newAngle),
//     y: sourcePosition.y + 150 * Math.sin(newAngle),
//   };