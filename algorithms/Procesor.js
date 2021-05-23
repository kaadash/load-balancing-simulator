export default class {
    constructor({
        neighbours,
        index,
        id,
        x,
        y,
        z,
        currentLoad,
    }) {
        this.neighbours = neighbours;
        this.id = id;
        this.x = x;
        this.y = y;
        this.z = z;
        this.index = index;
        this.currentLoad = currentLoad;
        this.loadToTransfer = 0;
    }

    addNeighbour(neighbourProcess) {
        this.neighbours.push(neighbourProcess)
    }
}