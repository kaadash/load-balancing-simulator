import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    SphereGeometry,
    MeshPhongMaterial,
    Mesh,
    LineBasicMaterial,
    Vector3,
    BufferGeometry,
    Line,
    AmbientLight,
} from "three";

import './OrbitControls';


const hsv2rgb = function (h, s, v) {
    var rgb, i, data = [];
    if (s === 0) {
        rgb = [v, v, v];
    } else {
        h = h / 60;
        i = Math.floor(h);
        data = [v * (1 - s), v * (1 - s * (h - i)), v * (1 - s * (1 - (h - i)))];
        switch (i) {
            case 0:
                rgb = [v, data[2], data[0]];
                break;
            case 1:
                rgb = [data[1], v, data[0]];
                break;
            case 2:
                rgb = [data[0], v, data[2]];
                break;
            case 3:
                rgb = [data[0], data[1], v];
                break;
            case 4:
                rgb = [data[2], data[0], v];
                break;
            default:
                rgb = [v, data[0], data[1]];
                break;
        }
    }
    return rgb.map(function (x) {
        return ("0" + Math.round(x * 255).toString(16)).slice(-2);
    }).join('');
};

export class Topology3DView {

    constructor(mountRootElement, processors, maxTasks, size) {
        this.processors = processors;
        this.maxTasks = maxTasks;
        this.mountRootElement = mountRootElement;
        this.size = size;
        this.MULTIPLIER = 20;
        this.prevIntersectedId = '';

        this.renderer = new WebGLRenderer({ alpha: true });
        this.renderer.setSize(this.mountRootElement.offsetWidth, this.mountRootElement.offsetHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.mountRootElement.appendChild(this.renderer.domElement);
        this.scene = new Scene();

        this.addCamera();
        this.renderLights();
        this.renderSpheres();
        this.renderLines();

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.update();

        this.render();

        window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    }

    removeAll() {
        for (let i = this.scene.children.length - 1; i >= 0; i--) {
            if (this.scene.children[i].type === "Mesh") {
                this.scene.remove(this.scene.children[i]);
            }
        }
    }

    updateProcessors(processors) {
        this.processors = processors;
    }

    renderSpheres() {
        this.processors.forEach(processor => {
            const normalizedValue = Math.floor((processor.currentLoad / this.maxTasks) * 100);
            const h = Math.floor((100 - normalizedValue) * 120 / 100);
            const s = Math.abs(normalizedValue - 50) / 50;

            const geometry = new SphereGeometry(3, 32, 32);
            const material = new MeshPhongMaterial({ color: +`0x${hsv2rgb(h, s, 1)}` });
            const sphere = new Mesh(geometry, material);
            sphere.userData.processor = processor;
            sphere.position.copy(
                new Vector3(
                    (processor.x * this.MULTIPLIER) - Math.floor(this.MULTIPLIER * this.size.x / 2),
                    (processor.y * this.MULTIPLIER) - Math.floor(this.MULTIPLIER * this.size.y / 2),
                    processor.z * this.MULTIPLIER
                )
            );
            this.scene.add(sphere);
        })
    }

    renderLines() {
        this.processors.forEach(processor => {
            const points = [];
            processor.neighbours.forEach((neighbour) => {
                points.push(
                    new Vector3(
                        (processor.x * this.MULTIPLIER) - Math.floor(this.MULTIPLIER * this.size.x / 2),
                        (processor.y * this.MULTIPLIER) - Math.floor(this.MULTIPLIER * this.size.y / 2),
                        processor.z * this.MULTIPLIER
                    )
                );
                points.push(
                    new Vector3(
                        (neighbour.x * this.MULTIPLIER) - Math.floor(this.MULTIPLIER * this.size.x / 2),
                        (neighbour.y * this.MULTIPLIER) - Math.floor(this.MULTIPLIER * this.size.y / 2),
                        neighbour.z * this.MULTIPLIER
                    )
                );
            });
            const lineMaterial = new LineBasicMaterial({ color: 0x0000ff });
            const lineGeometry = new BufferGeometry().setFromPoints(points);
            const line = new Line(lineGeometry, lineMaterial);
            this.scene.add(line);
        })
    }


    renderLights() {
        const ambientLight = new AmbientLight(0xa0a0a0); // soft white light
        this.scene.add(ambientLight);
        const color = 0xFFFFFF;
        const intensity = 0.5;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-5, 5, 5);
        light.target.position.set(-5, 0, 0);
        this.scene.add(light);
        this.scene.add(light.target);

    }

    addCamera() {
        this.camera = new PerspectiveCamera(
            45,
            this.mountRootElement.offsetWidth / this.mountRootElement.offsetHeight,
            1,
            1000
        );
        this.camera.position.set(0, 0, 300);
        this.camera.lookAt(0, 0, 0);
    }

    onMouseMove(event) {
        event.preventDefault();
        this.mouse.x = (event.offsetX / this.mountRootElement.offsetWidth) * 2 - 1;
        this.mouse.y = - (event.offsetY / this.mountRootElement.offsetHeight) * 2 + 1;

    }


    render() {
        requestAnimationFrame(this.render.bind(this));

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
            const currentIntersected = intersects[0].object;
            if (currentIntersected && currentIntersected.userData && currentIntersected.userData.processor && currentIntersected.userData.processor.id) {
                if (currentIntersected.userData.processor.id !== this.prevIntersectedId) {
                    console.log(currentIntersected.userData.processor.id, this.prevIntersectedId);
                    this.prevIntersectedId = currentIntersected.userData.processor.id;
                    // setProcessorTooltip({
                    //     id: currentIntersected.userData.processor.id,
                    //     currentLoad: currentIntersected.userData.processor.currentLoad
                    // })
                }
            }
        }
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}