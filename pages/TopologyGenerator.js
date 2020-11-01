export const MESH_3_D = 'MESH_3_D';
export const MESH_2_D = 'MESH_2_D';
export const CHAIN = 'CHAIN';

const generate3DMesh = (numberOfProcessors) => {

}
const generate2DMesh = (numberOfProcessors) => {

}
const generateChain = (numberOfProcessors) => {
    return 
}

export default (topologyType, numberOfProcessors) => {
    switch (topologyType) {
        case MESH_3_D:
            return generate3DMesh(numberOfProcessors);
        case MESH_2_D:
            return generate2DMesh(numberOfProcessors);
        case CHAIN:
            return generateChain(numberOfProcessors);
        default:
            break;
    }
}