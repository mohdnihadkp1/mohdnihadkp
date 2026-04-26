import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform float uTime;
varying vec2 vUv;

// Simplex noise function (approx)
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  
  // Calculate slow dynamic coordinates based on time and uv (3 layers of noise)
  float noise1 = snoise(uv * 1.5 + uTime * 0.04);
  float noise2 = snoise(uv * 2.5 - uTime * 0.02 + noise1 * 0.5);
  float noise3 = snoise(uv * 3.5 + uTime * 0.06 - noise2 * 0.4);
  
  // Dynamic Analogous color palette: Deep Purple, Vivid Cyan, Soft Pink, Midnight Blue
  // Add time-based shifting to make colors breathe
  vec3 color1 = vec3(0.04, 0.01 + sin(uTime * 0.2) * 0.01, 0.1 + cos(uTime * 0.15) * 0.02);
  vec3 color2 = vec3(0.15 + sin(uTime * 0.1) * 0.05, 0.02, 0.35 + cos(uTime * 0.2) * 0.05);
  vec3 color3 = vec3(0.02, 0.15 + cos(uTime * 0.15) * 0.05, 0.25 + sin(uTime * 0.1) * 0.05);
  vec3 color4 = vec3(0.2, 0.05, 0.25);
  
  // Mix colors based on noise layers
  vec3 finalColor = mix(color1, color2, smoothstep(-0.6, 0.6, noise1));
  finalColor = mix(finalColor, color3, smoothstep(-0.3, 0.8, noise2));
  finalColor = mix(finalColor, color4, smoothstep(0.0, 1.0, noise3) * 0.4); // Subtle 3rd color layer
  
  // Add a glowing vignette & edge blur simulation
  float dist = distance(uv, vec2(0.5));
  float edgeSoftness = smoothstep(0.35, 0.75, dist);
  
  // Darken and desaturate at the edges to simulate an ethereal blur
  vec3 edgeColor = vec3(0.005, 0.005, 0.01); 
  finalColor = mix(finalColor, edgeColor, edgeSoftness * 1.2);
  
  gl_FragColor = vec4(max(finalColor, vec3(0.01)), 1.0);
}
`;

export function DynamicBackground() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, -20]} scale={50}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
        }}
        depthWrite={false}
      />
    </mesh>
  );
}
