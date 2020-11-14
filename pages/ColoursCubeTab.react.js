import React, { useState, useEffect, useRef } from 'react';
import {
  Scene, PerspectiveCamera,
  WebGLRenderer, SphereGeometry,
  MeshBasicMaterial, MeshPhongMaterial, Mesh, LineBasicMaterial, Vector3,
  BufferGeometry,
  Line,
  PointLight,
  AmbientLight,
} from "THREE";

import 'three/examples/js/controls/OrbitControls';


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

export default (props) => {
  // Zadeklaruj nową zmienną stanu, którą nazwiemy „count”
  const rootElement = useRef(null);

  const MULTIPLIER = 20;

  const renderSpheres = (scene) => {
    props.processors.forEach(processor => {
      const normalizedValue = Math.floor((processor.currentLoad / props.maxTasks) * 100);
      const h = Math.floor((100 - normalizedValue) * 120 / 100);
      const s = Math.abs(normalizedValue - 50) / 50;
      console.log('hsv2rgb(h, s, 1)', props.maxTasks, processor.currentLoad, normalizedValue, hsv2rgb(h, s, 1))
      // rgbToHex(hsv2rgb(h, s, 1))

      const geometry = new SphereGeometry(3, 32, 32);
      const material = new MeshPhongMaterial({ color: +`0x${hsv2rgb(h, s, 1)}` });
      const sphere = new Mesh(geometry, material);
      sphere.position.copy(
        new Vector3(
          (processor.x * MULTIPLIER) - Math.floor(MULTIPLIER * props.size.x / 2),
          (processor.y * MULTIPLIER) - Math.floor(MULTIPLIER * props.size.y / 2),
          processor.z * MULTIPLIER
        )
      );
      scene.add(sphere);
    })
  }

  const renderLines = (scene) => {

    props.processors.forEach(processor => {
      const points = [];
      processor.neighbours.forEach((neighbour) => {
        points.push(
          new Vector3(
            (processor.x * MULTIPLIER) - Math.floor(MULTIPLIER * props.size.x / 2),
            (processor.y * MULTIPLIER) - Math.floor(MULTIPLIER * props.size.y / 2),
            processor.z * MULTIPLIER
          )
        );
        points.push(
          new Vector3(
            (neighbour.x * MULTIPLIER) - Math.floor(MULTIPLIER * props.size.x / 2),
            (neighbour.y * MULTIPLIER) - Math.floor(MULTIPLIER * props.size.y / 2),
            neighbour.z * MULTIPLIER
          )
        );
      });
      const lineMaterial = new LineBasicMaterial({ color: 0x0000ff });
      const lineGeometry = new BufferGeometry().setFromPoints(points);
      const line = new Line(lineGeometry, lineMaterial);
      scene.add(line);
    })
  }


  const renderLights = (scene) => {
    const ambientLight = new AmbientLight(0xa0a0a0); // soft white light
    scene.add(ambientLight);
    const color = 0xFFFFFF;
    const intensity = 0.5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-5, 5, 5);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);

  }

  const addCamera = () => {
    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set(0, 0, 150);
    camera.lookAt(0, 0, 0);
    return camera;
  }

  useEffect(() => {
    const renderer = new WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    rootElement.current.appendChild(renderer.domElement);
    const scene = new Scene();

    const camera = addCamera();
    renderLights(scene);
    renderSpheres(scene);
    renderLines(scene);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();

    function animate() {
      requestAnimationFrame(animate);
      // required if controls.enableDamping or controls.autoRotate are set to true
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      rootElement.current.innerHTML = '';
    }
  }, [])

  return (
    <div ref={rootElement}>
    </div>
  );
}