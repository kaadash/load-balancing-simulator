const updateOtherProcessorNeighbours = (processors, processorToEdit) => {
  return processors.forEach((processor) => {
    if (processorToEdit.id === processor.id) {
      processor.currentLoad = processorToEdit.currentLoad
    } else {
      processor.neighbours.forEach((neighbour) => {
        if (neighbour.id === processorToEdit.id) {
            neighbour.currentLoad = processorToEdit.currentLoad
        }
      });
    }
  })
}

export const diffusionAsync = (processors, alpha) => {
  const newProcessors = processors.map((processor, index) => {
    const newNeighbours = processor.neighbours.map((neighbour) => {
      if (neighbour.index <= index) {
        return neighbour;
      }
      const diff = alpha * (processor.currentLoad - neighbour.currentLoad);
      processor.currentLoad = processor.currentLoad - diff;
      neighbour.currentLoad = neighbour.currentLoad + diff;
      updateOtherProcessorNeighbours(processors, processor);
      updateOtherProcessorNeighbours(processors, neighbour);
      return neighbour;
    });
    return {
      ...processor,
      neighbours: newNeighbours,
    };
  })
  return newProcessors;
}