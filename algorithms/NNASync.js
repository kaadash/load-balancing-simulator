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

export const NNASync = (processors) => {
  const diffs = [];
  processors.forEach((processor) => {
    const toTransfer = processor.currentLoad / (processor.neighbours.length + 1);
    diffs.push(toTransfer);
  })
  processors.forEach((processor, index) => {
    const toTransfer = diffs[index];
    processor.neighbours.forEach((neighbour) => {
      neighbour.currentLoad += toTransfer;
      processor.currentLoad -= toTransfer;
      updateOtherProcessorNeighbours(processors, neighbour);
    });
    updateOtherProcessorNeighbours(processors, processor);
  })
  return [...processors];
}