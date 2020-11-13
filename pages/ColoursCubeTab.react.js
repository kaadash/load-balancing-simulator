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

import * as THREE from "three";


global.THREE = global.THREE || THREE;

import 'three/examples/js/controls/OrbitControls';

// import OrbitControls from 'three/examples/js/controls/OrbitControls.js';

// import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/controls/OrbitControls.js';


export default (props) => {
  // Zadeklaruj nową zmienną stanu, którą nazwiemy „count”
  const rootElement = useRef(null);
  // const generatePoints = () => {
  //   return props.pro
  // }

  const renderProcessors = () => {

  }

  useEffect(() => {
    const renderer = new WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    rootElement.current.appendChild(renderer.domElement);

    const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
    camera.position.set(0, 0, 100);
    camera.lookAt(0, 0, 0);

    const scene = new Scene();
    const ambientLight = new AmbientLight(0xa0a0a0); // soft white light
    scene.add(ambientLight);

    const geometry = new SphereGeometry(5, 32, 32);
    const material = new MeshPhongMaterial({ color: 0x12b912 });
    const lineMaterial = new LineBasicMaterial({ color: 0x0000ff });
    const sphere = new Mesh(geometry, material);
    const points = [];
    const color = 0xFFFFFF;
    const intensity = 0.5;
    const light = new global.THREE.DirectionalLight(color, intensity);
    light.position.set(-5, 5, 5);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);


    points.push(new Vector3(- 10, 0, 0));
    points.push(new Vector3(0, 10, 0));
    points.push(new Vector3(10, 0, 0));

    const lineGeometry = new BufferGeometry().setFromPoints(points);
    const line = new Line(lineGeometry, lineMaterial);

    scene.add(sphere);
    scene.add(line);

    const controls = new global.THREE.OrbitControls(camera, renderer.domElement);
    controls.update();

    renderer.render(scene, camera);

    function animate() {

      requestAnimationFrame(animate);
      // required if controls.enableDamping or controls.autoRotate are set to true
      controls.update();
      renderer.render(scene, camera);
    }
    animate();
    return () => {
      console.log('rootElement', rootElement.current);
      rootElement.current.innerHTML = '';
    }
  }, [])

  return (
    <div ref={rootElement}>
    </div>
  );
}