import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import marsTexture from '../src/assets/photo/mars2.jpg';

interface Mars3DViewProps {
  elevationData: number[]; // Elevation data array
}

const Mars3DView: React.FC<Mars3DViewProps> = ({ elevationData }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Local state for camera position
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z:64 });
  //  
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Mars Sphere Geometry
    const geometry = new THREE.SphereGeometry(3, 64, 64);
    const vertices = geometry.attributes.position.array;

    // Apply elevation data to vertices
    for (let i = 0; i < vertices.length; i += 3) {
      const x = vertices[i];
      const y = vertices[i + 1];
      const z = vertices[i + 2];

      // Simulate applying elevation to the z-coordinate
      const elevation = elevationData[Math.floor(Math.random() * elevationData.length)] || 0;
      vertices[i + 2] = z + elevation * 0.5;
    }

    geometry.attributes.position.needsUpdate = true;

    // Texture
    const texture = new THREE.TextureLoader().load(marsTexture);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mars = new THREE.Mesh(geometry, material);
    scene.add(mars);

    // Lighting setup
    const light = new THREE.AmbientLight(0xffffff, 1);
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Camera Position (Using state values)
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

    // Render Loop
    const animate = () => {
      requestAnimationFrame(animate);
      mars.rotation.y += 0.005; // Rotate Mars for animation
      renderer.render(scene, camera);
    };
    animate();

    // Resize handling
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      renderer.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [elevationData, cameraPosition]); // Dependency on cameraPosition

  // Function to update camera position
  const updateCameraPosition = (x: number, y: number, z: number) => {
    setCameraPosition({ x, y, z });
  };

  return (
    <div>
      {/* Example buttons to update the camera position */}
      <button onClick={() => updateCameraPosition(0, 0, 10)}>Move Camera Closer</button>
      <button onClick={() => updateCameraPosition(0, 0, 64)}>Reset Camera Position</button>

      <div ref={mountRef} />
    </div>
  );
};

export default Mars3DView;
