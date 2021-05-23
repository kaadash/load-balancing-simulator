export const diffusionAsync = (processors, alpha) => {
  const newProcessors = processors.map((processor, index) => {
    const newNeighbours = processor.neighbours.map((neighbour) => {
      if (neighbour.index <= index) {
        return neighbour;
      }
      const diff = alpha * (processor.currentLoad - neighbour.currentLoad);
      processor.currentLoad = processor.currentLoad - diff;
      neighbour.currentLoad = neighbour.currentLoad + diff;

      const mainProcessor = processors.find(({ id }) => id === neighbour.id);
      mainProcessor.currentLoad = neighbour.currentLoad;

      return neighbour;
    });
    return {
      ...processor,
      neighbours: newNeighbours,
    };
  })
  return newProcessors;
}