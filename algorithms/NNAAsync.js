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

export const NNAAsync = (processors) => {
  processors.forEach((processor) => {
    const sumOfNeighboursTasks = processor.neighbours.reduce((sum, neighbour) => {
      return sum + neighbour.currentLoad;
    }, 0);

    const nextLoad = (processor.currentLoad + sumOfNeighboursTasks) / (processor.neighbours.length + 1);
    let nextLoadTransfer = 0;
    const sumOfDiffs = processor.neighbours.reduce((sum, neighbour) => {
      const diff = Math.max(0, nextLoad - neighbour.currentLoad);
      return sum + diff;
    }, 0);

    const updatedNeighbours = processor.neighbours.map((neighbour) => {
      const diff = Math.max(0, nextLoad - neighbour.currentLoad);
      const toTransfer = (processor.currentLoad - nextLoad) * (diff / Math.max(sumOfDiffs, 1));
      nextLoadTransfer += toTransfer;
      const neighbourUpdated = {
        ...neighbour,
        currentLoad: neighbour.currentLoad + toTransfer,
      };
      updateOtherProcessorNeighbours(processors, neighbourUpdated);
      return neighbourUpdated;
    });
    const updatedProcessor = {
      ...processor,
      neighbours: updatedNeighbours,
      currentLoad: processor.currentLoad - nextLoadTransfer
    }
    updateOtherProcessorNeighbours(processors, updatedProcessor);
    return updatedProcessor;
  })
  return [...processors];
}