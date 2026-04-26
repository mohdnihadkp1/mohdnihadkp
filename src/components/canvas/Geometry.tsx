import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
  MeshTransmissionMaterial,
  Float,
  TorusKnot,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

export function Geometry({
  geometryRef,
}: {
  geometryRef: React.RefObject<THREE.Group | null>;
}) {
  const { pointer, size } = useThree();
  const materialRef = useRef<any>(null);
  const innerGroupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const isMobile = size.width < 768;

  useFrame((state, delta) => {
    // Smooth dynamic rotation based on cursor using Frame-rate independent dampening
    if (innerGroupRef.current) {
      const targetX = (pointer.x * Math.PI) / 4;
      const targetY = -(pointer.y * Math.PI) / 4;

      innerGroupRef.current.rotation.y = THREE.MathUtils.damp(
        innerGroupRef.current.rotation.y,
        targetX,
        3,
        delta,
      );
      innerGroupRef.current.rotation.x = THREE.MathUtils.damp(
        innerGroupRef.current.rotation.x,
        targetY,
        3,
        delta,
      );
    }

    // Constant silk-smooth idle spin
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.15;
    }
    if (coreRef.current) {
      coreRef.current.rotation.x -= delta * 0.15;
      coreRef.current.rotation.y -= delta * 0.1;
    }
  });

  return (
    <group ref={geometryRef}>
      <group ref={innerGroupRef}>
        {/* Enhanced Particle System with slower flow and color variation for visual depth */}
        <Sparkles
          count={isMobile ? 25 : 60}
          scale={10}
          size={isMobile ? 2 : 4}
          speed={0.15}
          opacity={0.6}
          color="#8b5cf6" // Deep Violet
        />
        <Sparkles
          count={isMobile ? 25 : 50}
          scale={12}
          size={isMobile ? 1.5 : 3}
          speed={0.1}
          opacity={0.5}
          color="#3b82f6" // Vivid Blue
        />
        <Sparkles
          count={isMobile ? 20 : 40}
          scale={10}
          size={isMobile ? 2.5 : 5}
          speed={0.18}
          opacity={0.4}
          color="#ec4899" // Pink
        />
        <Sparkles
          count={isMobile ? 15 : 30}
          scale={14}
          size={isMobile ? 2 : 4}
          speed={0.1}
          opacity={0.7}
          color="#06b6d4" // Cyan
        />

        <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.5}>
          <mesh ref={meshRef} castShadow receiveShadow>
            {/* Complex, intricate abstract shape (Torus Knot) optimized for mobile (reduce segments/psegments by ~30% total) */}
            <TorusKnot
              args={[
                isMobile ? 1.2 : 2.2,
                isMobile ? 0.35 : 0.6,
                isMobile ? 90 : 256,
                isMobile ? 22 : 64,
              ]}
            />

            <MeshTransmissionMaterial
              ref={materialRef}
              backside={!isMobile}
              samples={isMobile ? 3 : 8}
              thickness={isMobile ? 2 : 6}
              chromaticAberration={isMobile ? 1.5 : 2.5}
              anisotropy={isMobile ? 0.5 : 1.5}
              distortion={1.8}
              distortionScale={0.8}
              temporalDistortion={0.4}
              iridescence={isMobile ? 0.5 : 1}
              iridescenceIOR={1.8}
              iridescenceThicknessRange={[100, 600]}
              clearcoat={1}
              clearcoatRoughness={0.05}
              roughness={0.02}
              transmission={1}
              attenuationDistance={2.5}
              attenuationColor="#a855f7"
              color="#ffffff"
              background={new THREE.Color("#030303")}
            />
          </mesh>

          {/* Inner glowing core that adds depth */}
          <mesh ref={coreRef}>
            <icosahedronGeometry args={[isMobile ? 0.6 : 1.2, 2]} />
            <meshStandardMaterial
              color="#c084fc"
              emissive="#8b5cf6"
              emissiveIntensity={2}
              wireframe
              transparent
              opacity={0.6}
              depthWrite={false}
            />
          </mesh>
        </Float>
      </group>
    </group>
  );
}
