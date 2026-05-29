import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const techWords = [
  "React", "Three.js", "GSAP", "Next.js", "Tailwind", "WebGL",
  "TypeScript", "Framer", "Node.js", "OpenGL", "Shaders", "GLSL",
  "Figma", "Redux", "Zustand", "Vercel", "Vite", "Motion"
];

export function TechSphere() {
  const group = useRef<THREE.Group>(null);
  
  // Distribute points on a sphere (Fibonacci sphere algorithm)
  const items = useMemo(() => {
    const count = techWords.length;
    const radius = 2.2;
    const points = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
    
    for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2; // y goes from 1 to -1
        const r = Math.sqrt(1 - y * y); // radius at y
        
        const theta = phi * i; // golden angle increment
        
        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;
        
        points.push({
            position: new THREE.Vector3(x * radius, y * radius, z * radius),
            word: techWords[i]
        });
    }
    return points;
  }, []);

  useFrame((state) => {
    if (group.current) {
        // React to mouse movement (smoothed)
        const targetY = (state.pointer.x * Math.PI) / 2;
        const targetX = -(state.pointer.y * Math.PI) / 2;
        
        // Slerp-like rotation
        group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05;
        group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05;

        // Auto slow rotation
        group.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={group}>
      {items.map((item, i) => (
        <TechWord key={i} position={item.position} word={item.word} />
      ))}
    </group>
  );
}

function TechWord({ position, word }: { position: THREE.Vector3, word: string }) {
  const ref = useRef<any>(null);
  
  useFrame((state) => {
    if (ref.current) {
      // Make text always face the camera
      ref.current.quaternion.copy(state.camera.quaternion);
      
      // Calculate distance to camera to fade out distant text
      const dist = state.camera.position.distanceTo(ref.current.position);
      // It's a bit complex with quaternions, but we can just use the z position in world space
      const worldPos = new THREE.Vector3();
      ref.current.getWorldPosition(worldPos);
      
      // opacity based on z position (front is more opaque)
      // sphere is at origin, radius is around 2.2
      // worldPos.z goes roughly from -2.2 to 2.2
      const normalizedZ = (worldPos.z + 2.2) / 4.4; // 0 (back) to 1 (front)
      ref.current.fillOpacity = 0.2 + normalizedZ * 0.8;
    }
  });

  return (
    <Text
      ref={ref}
      position={position}
      fontSize={0.4}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      material-transparent={true}
    >
      {word}
    </Text>
  );
}
