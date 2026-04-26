import { useEffect, useRef, Suspense } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import {
  Environment,
  PerspectiveCamera,
  ContactShadows,
  useGLTF,
  Float,
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Geometry } from "./Geometry";
import { DynamicBackground } from "./DynamicBackground";

gsap.registerPlugin(ScrollTrigger);

// Creates dynamic rim lighting that opposes the camera to highlight edges
function DynamicRimLight() {
  const lightRef = useRef<THREE.SpotLight>(null);
  useFrame(({ camera }) => {
    if (lightRef.current) {
      // Position the light behind the scene, slightly offset based on camera
      lightRef.current.position.set(
        camera.position.x * -1.5,
        camera.position.y + 5,
        -10,
      );
      lightRef.current.lookAt(0, 0, 0);
    }
  });
  return (
    <spotLight
      ref={lightRef}
      angle={0.5}
      penumbra={1}
      intensity={250}
      color="#2dd4bf"
      castShadow
    />
  );
}

// Loads a standard detailed model (Suzanne) dynamically and applies abstract theme
function SecondaryAbstractModel({ isMobile }: { isMobile: boolean }) {
  try {
    const gltf = useGLTF(
      "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/suzanne-high-poly/model.gltf",
      "https://www.gstatic.com/draco/versioned/decoders/1.5.5/",
    );
    // Find the first mesh geometry in the imported model
    let geometry: THREE.BufferGeometry | null = null;
    gltf.scene.traverse((child: any) => {
      if (child.isMesh && !geometry) {
        geometry = child.geometry;
        if (isMobile && geometry) {
          // Additional optimization for mobile
          geometry.computeBoundingSphere();
        }
      }
    });

    if (!geometry) return null;

    return (
      <Float
        speed={3}
        rotationIntensity={1}
        floatIntensity={2}
        position={[isMobile ? -1 : -3, isMobile ? 3 : 2, -2]}
      >
        <mesh geometry={geometry} scale={isMobile ? 0.8 : 1.2}>
          <meshStandardMaterial
            color="#8b5cf6"
            wireframe
            opacity={0.15}
            transparent
            emissive="#8b5cf6"
            emissiveIntensity={1.5}
          />
        </mesh>
      </Float>
    );
  } catch (e) {
    return null; // Fallback gracefully if network restricts CDN
  }
}

export function Scene() {
  const { camera, size } = useThree();
  const geometryRef = useRef<THREE.Group>(null);

  const isMobile = size.width < 768;

  useEffect(() => {
    // 1. Initial Responsive Camera Setup
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = isMobile ? 65 : 45;
      camera.position.set(0, 0, isMobile ? 12 : 10);
      camera.updateProjectionMatrix();
    }

    ScrollTrigger.config({ ignoreMobileResize: true });

    // 3. Cinematic Scroll Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#app-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5, // Smoother scrubbing for Lusion style
      },
    });

    if (geometryRef.current) {
      const g = geometryRef.current;

      // Section: About
      tl.to(
        g.position,
        {
          y: isMobile ? 3 : 0,
          x: isMobile ? 0 : 5,
          z: 2,
          ease: "power2.inOut",
        },
        0,
      );
      tl.to(
        g.rotation,
        {
          z: Math.PI / 4,
          x: Math.PI / 6,
          ease: "power2.inOut",
        },
        0,
      );
      tl.to(
        g.scale,
        {
          x: isMobile ? 0.9 : 1.1,
          y: isMobile ? 0.9 : 1.1,
          z: isMobile ? 0.9 : 1.1,
          ease: "power2.inOut",
        },
        0,
      );

      // Section: Works
      tl.to(
        g.position,
        {
          y: isMobile ? 1 : -1,
          x: isMobile ? 0 : -5,
          z: -3,
          ease: "power2.inOut",
        },
        "+=0.1",
      );
      // Add subtle camera tilt effect to enhance dynamic movement
      tl.to(
        camera.rotation,
        {
          x: -0.15,
          y: 0.05,
          z: -0.05,
          ease: "power2.inOut",
        },
        "<",
      );
      tl.to(
        camera.position,
        {
          // slight push in
          z: isMobile ? 10 : 8,
          ease: "power2.inOut",
        },
        "<",
      );
      tl.to(
        g.rotation,
        {
          z: -Math.PI / 2,
          y: Math.PI,
          x: 0,
          ease: "power2.inOut",
        },
        "<",
      );
      tl.to(
        g.scale,
        {
          x: isMobile ? 0.6 : 0.8,
          y: isMobile ? 1.2 : 1.5,
          z: isMobile ? 0.6 : 0.8,
          ease: "power2.inOut",
        },
        "<",
      );

      // Section: Skills / Contact
      tl.to(
        g.position,
        {
          y: isMobile ? -3 : -2,
          x: 0,
          z: -8,
          ease: "power2.inOut",
        },
        "+=0.1",
      );
      // Revert camera tilt effect and position
      tl.to(
        camera.rotation,
        {
          x: 0,
          y: 0,
          z: 0,
          ease: "power2.inOut",
        },
        "<",
      );
      tl.to(
        camera.position,
        {
          // push out
          z: isMobile ? 12 : 10,
          ease: "power2.inOut",
        },
        "<",
      );
      tl.to(
        g.rotation,
        {
          z: Math.PI / 2,
          y: Math.PI * 2,
          x: Math.PI / 4,
          ease: "power2.inOut",
        },
        "<",
      );
      tl.to(
        g.scale,
        {
          x: isMobile ? 2.5 : 3,
          y: isMobile ? 2.5 : 3,
          z: isMobile ? 2.5 : 3,
          ease: "power2.inOut",
        },
        "<",
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [camera, isMobile]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />

      {/* Saturated Cyber/Cinematic Lighting */}
      <ambientLight intensity={0.5} color="#ffffff" />
      <spotLight
        position={[10, 10, 10]}
        angle={0.3}
        penumbra={1}
        intensity={80}
        color="#c084fc"
        castShadow
      />
      <spotLight
        position={[-10, -10, -10]}
        angle={0.3}
        penumbra={1}
        intensity={80}
        color="#06b6d4"
      />
      <pointLight position={[0, -5, 5]} intensity={20} color="#ec4899" />

      {/* Dynamic Cinematic Rim Lighting */}
      <DynamicRimLight />

      {/* Conditionally render heavy environment maps for reflections */}
      <Environment preset="night" resolution={isMobile ? 128 : 256} />

      <DynamicBackground />

      <Geometry geometryRef={geometryRef} />

      {/* Embedded Secondary GLTF Model */}
      <Suspense fallback={null}>
        <SecondaryAbstractModel isMobile={isMobile} />
      </Suspense>

      <ContactShadows
        position={[0, -4, 0]}
        resolution={512}
        scale={20}
        blur={2}
        opacity={0.5}
        far={10}
        color="#000000"
      />
    </>
  );
}

useGLTF.preload(
  "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/suzanne-high-poly/model.gltf",
  "https://www.gstatic.com/draco/versioned/decoders/1.5.5/",
);
