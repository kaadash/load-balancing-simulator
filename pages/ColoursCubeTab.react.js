import React, { useState, useEffect, useRef } from 'react';
import {
  Scene, PerspectiveCamera, WebGLRenderer, GridHelper, Geometry, Vector3, Points, PointsMaterial, BoxBufferGeometry,
  Mesh, MeshBasicMaterial, Math
} from "THREE";


export default () => {
  // Zadeklaruj nową zmienną stanu, którą nazwiemy „count”
  const rootElement = useRef(null);

  useEffect(() => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(60, 1200 / 600, 1, 1000);
    camera.position.set(2, 5, 10);
    const renderer = new WebGLRenderer({
      antialias: true
    });
    renderer.setSize(1200, 600);
    rootElement.current.appendChild(renderer.domElement);

    // const controls = new OrbitControls(camera, renderer.domElement);

    scene.add(new GridHelper(10, 10));

    const pointsGeom = new Geometry();
    pointsGeom.vertices.push(
      new Vector3(Math.randFloat(-5, 5), Math.randFloat(-2.5, 2.5), Math.randFloat(-5, 5)),
      new Vector3(Math.randFloat(-5, 5), Math.randFloat(-2.5, 2.5), Math.randFloat(-5, 5))
    )

    const points = new Points(pointsGeom, new PointsMaterial({
      color: "red",
      size: 0.5
    }));
    scene.add(points);

    const cubeDiagonal = new Vector3().copy(pointsGeom.vertices[1]).sub(pointsGeom.vertices[0]).length(); // cube's diagonal
    const center = new Vector3().copy(pointsGeom.vertices[0]).add(pointsGeom.vertices[1]).multiplyScalar(0.5); // cube's center

    const cubeSide = (cubeDiagonal * window.Math.sqrt(3)) / 3; // cube's edge's length via cube's diagonal

    const cubeGeom = new BoxBufferGeometry(cubeSide, cubeSide, cubeSide);
    cubeGeom.rotateY(window.Math.PI * 0.25); // rotate around Y
    cubeGeom.rotateX(window.Math.atan(window.Math.sqrt(2) * 0.5)); // rotate around X, using angle between cube's diagonal and its projection on a cube's face
    const cube = new Mesh(cubeGeom, new MeshBasicMaterial({
      color: "aqua",
      wireframe: true
    }));
    cube.position.copy(center); // set position of the cube
    cube.lookAt(pointsGeom.vertices[0]); // let Three.js do the job for us
    scene.add(cube)

    render();

    function render() {
      requestAnimationFrame(render);
      renderer.render(scene, camera);
    }
  }, [])

  return (
    <div ref={rootElement}>
    </div>
  );
}