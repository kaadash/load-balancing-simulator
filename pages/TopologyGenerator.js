import { range } from 'lodash';
import Procesor from './Procesor';

export const findProcessByPosition = (processors, x, y, z) => {
    return processors.find(processor => {
        return processor.x === x && processor.y === y  && processor.z === z;
    })
}

export const generateTopology = (x = 1, y = 1, z = 1, maxTasks = 1000) => {
    const xRange = range(0, x);
    const yRange = range(0, y);
    const zRange = range(0, z);
    const processors = [];
    zRange.forEach(zId => {
        yRange.forEach(yId => {
            xRange.forEach(xId => {
                const currentProcessor = new Procesor({
                    neighbours: [],
                    id: `${xId}-${yId}-${zId}`,
                    x: xId,
                    y: yId,
                    z: zId,
                    currentLoad: Math.floor(Math.random() * maxTasks)
                });
                processors.push(currentProcessor);
                if (xId > 0) {
                    const foundProcessor = findProcessByPosition(processors, xId - 1, yId, zId);
                    foundProcessor.addNeighbour(currentProcessor);
                    currentProcessor.addNeighbour(foundProcessor);
                }
                if (yId > 0) {
                    const foundProcessor = findProcessByPosition(processors, xId, yId - 1, zId);
                    foundProcessor.addNeighbour(currentProcessor);
                    currentProcessor.addNeighbour(foundProcessor);
                }
                if (zId > 0) {
                    const foundProcessor = findProcessByPosition(processors, xId, yId, zId - 1);
                    foundProcessor.addNeighbour(currentProcessor);
                    currentProcessor.addNeighbour(foundProcessor);
                }
            })
        })    
    })
    return processors;
}