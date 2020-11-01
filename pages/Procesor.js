export default class {
    constructor({
        neighbours,
        id,
        currentLoad
    }) {
        this.neighbours = neighbours;
        this.id = id;
        this.currentLoad = currentLoad;
        this.loadToTransfer = 0;
    }
}