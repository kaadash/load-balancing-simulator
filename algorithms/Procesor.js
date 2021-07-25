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
        this.loadToTransfer = 0;
    }

    addNeighbour(neighbourProcess) {
        this.neighbours.push(neighbourProcess)
    }
}