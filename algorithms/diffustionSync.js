export const diffusionSync = (processors, alpha) => {
  const maxNeighbours = Math.max(...processors.map(({ neighbours }) => neighbours.length));
  const beta = alpha / maxNeighbours;
  const newProcessors = processors.map((processor) => {
    const valuesToTransfer = processor.neighbours.map((neighbour) => {
      const toTransfer = Math.floor(alpha * beta * (processor.currentLoad - neighbour.currentLoad));
      return toTransfer;
    })
    const currentLoad = processor.currentLoad - valuesToTransfer.reduce((sum, transferValue) => {
      return sum + transferValue;
    }, 0);
    return {
      ...processor,
      currentLoad
    }
  })
  const newProcessorsWithNeighbours = newProcessors.map((processor) => {
    const updatedNeighbours = processor.neighbours.map((neighbour) => {
      const updatedNeighbour = newProcessors.find(({ id }) => id === neighbour.id);
      return {
        ...neighbour,
        currentLoad: updatedNeighbour.currentLoad
      };
    });
    return {
      ...processor,
      neighbours: updatedNeighbours
    }
  })
  return newProcessorsWithNeighbours;
}