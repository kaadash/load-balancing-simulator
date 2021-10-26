import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    SphereGeometry,
    BoxGeometry,
    MeshPhongMaterial,
    Mesh,
    LineBasicMaterial,
    Vector3,
    BufferGeometry,
    Line,
    AmbientLight,
} from "three";

import './OrbitControls';

function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `${f(0)}${f(8)}${f(4)}`;
  }

export class Topology3DView {

    constructor(mountRootElement, processors, maxTasks, size) {
        window.frames = [];
        this.processors = processors;
        this.start = null;
        this.spheres = [];
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

        this.mouse = new THREE.Vector2();

        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.update();

        this.render();

        window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    }

    removeAll() {
        for (let i = this.scene.children.length - 1; i >= 0; i--) {
            if (this.scene.children[i].type === "Mesh" || this.scene.children[i].type === 'Line') {
                this.scene.remove(this.scene.children[i]);
            }
        }
    }

    hslToRgb(h, s, l){
        var r, g, b;
    
        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            var hue2rgb = function hue2rgb(p, q, t){
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }
    
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
    
        const rgb = [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        return rgb.map(function (x) {
            return ("0" + Math.round(x * 255).toString(16)).slice(-2);
        }).join('');
    }

    updateProcessors(processors, maxTasks) {
        this.processors = processors;
        this.maxTasks = maxTasks;
    }

    getNormalizedColor(processorLoad) {
        const normalizedValue = Math.floor((processorLoad / this.maxTasks) * 100);
        const hue = ((1 - Math.min(processorLoad / this.maxTasks, 1))) * 240;
        return +`0x${hslToHex(hue, 100, 50)}`;
    }

    renderSpheres() {
        this.spheres = [];
        this.processors.forEach(processor => {

            // const geometry = new SphereGeometry(3, 32, 32);
            const geometry = new BoxGeometry(5, 5, 5);
            const material = new MeshPhongMaterial({ color: this.getNormalizedColor(processor.currentLoad) });
            const sphere = new Mesh(geometry, material);
            console.log(sphere.geometry.vertices.length);
            sphere.userData.processor = processor;
            sphere.position.copy(
                new Vector3(
                    (processor.x * this.MULTIPLIER) - Math.floor(this.MULTIPLIER * this.size.x / 2),
                    (processor.y * this.MULTIPLIER) - Math.floor(this.MULTIPLIER * this.size.y / 2),
                    processor.z * this.MULTIPLIER
                )
            );
            this.spheres.push(sphere);
            this.scene.add(sphere);
        })
    }
    changeSpheresColors() {
        if (this.spheres.length === this.processors.length) {
            this.spheres.forEach((sphere, index) => {
                sphere.material.color.set(this.getNormalizedColor(this.processors[index].currentLoad));
            })
        }
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


    render(timestamp) {
        console.log('render', this.renderer.info.render);
        requestAnimationFrame(this.render.bind(this));

        if (this.start && timestamp) {
            var progress = timestamp - this.start;
            window.frames.push(progress);
        }
        this.start = timestamp;
        
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}