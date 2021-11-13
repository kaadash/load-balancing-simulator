export default class {
    constructor({
        neighbours,
        index,
        id,
        x,
        y,
        z,
        currentLoad,
        range,
    }) {
        this.neighbours = neighbours;
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.index = index;
        this.currentLoad = currentLoad;
        this.range = range;
    }

    addNeighbour(neighbourProcess) {
        this.neighbours.push(neighbourProcess)
    }

    updateLoad(currentLoad) {
        this.currentLoad = currentLoad;
    }

    updateNeighbourLoad(processor) {
        this.neighbours.map((neighbour) => {
            const updatedNeighbour = processor.find(({ id }) => id === neighbour.id);
            return {
                ...neighbour,
                currentLoad: updatedNeighbour.currentLoad
            };
        });
    }
}