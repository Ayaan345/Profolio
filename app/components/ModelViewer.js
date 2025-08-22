// "use client";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
// import { useRef } from "react";
// import * as THREE from "three";

// function Model(props) {
//   const { scene, animations } = useGLTF("/scene.gltf"); // put in /public
//   const { actions, mixer } = useAnimations(animations, scene);
//   const modelRef = useRef();

//   // Store the animation action
//   const actionRef = useRef();

//   if (actions && !actionRef.current) {
//     actionRef.current = actions[Object.keys(actions)[0]];
//     actionRef.current.play();
//   }

//   useFrame((state, delta) => {
//     if (modelRef.current && actionRef.current) {
//       // Spin speed
//       const spinSpeed = 0.5; // rotations per second
//       modelRef.current.rotation.y += delta * spinSpeed * 2 * Math.PI;
  
//       // Sync animation
//       const duration = actionRef.current.getClip().duration;
  
//       // Rotation progress (0 → 1 per full spin)
//       let t = (modelRef.current.rotation.y % (2 * Math.PI)) / (2 * Math.PI);
  
//       // Make it "open → hold → close → hold"
//       if (t < 0.4) {
//         // Opening phase (0–40%)
//         t = t / 0.4; // map to 0–1
//       } else if (t < 0.6) {
//         // Hold fully open (40–60%)
//         t = 1;
//       } else if (t < 0.9) {
//         // Closing phase (60–90%)
//         t = 1 - (t - 0.6) / 0.3; // map back down 1 → 0
//       } else {
//         // Hold fully closed (90–100%)
//         t = 0;
//       }
  
//       // Apply animation time
//       actionRef.current.time = duration * t;
//       mixer.update(0);
//     }
//   });
  

//   return <primitive ref={modelRef} object={scene} {...props} />;
// }

// export default function ModelViewer() {
//   return (
//     <Canvas camera={{ position: [0, 0, 5] }}>
//       <ambientLight intensity={0.8} />
//       <directionalLight position={[2, 2, 5]} />
//       <Model scale={1.5} />
//       <OrbitControls enableZoom={false} />
//     </Canvas>
//   );
// }

"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import { useRef, useEffect } from "react";
import * as THREE from "three";

function Model(props) {
  const { scene, animations } = useGLTF("/scene.gltf");
  const { actions, mixer } = useAnimations(animations, scene);

  const groupRef = useRef();   // ✅ pivot at center
  const actionRef = useRef();

  // Random rotation speeds for X, Y, Z
  const speeds = useRef({
    x: (Math.random() * 0.4 + 0.2), // 0.2–0.6
    y: (Math.random() * 0.6 + 0.3), // 0.3–0.9
    z: (Math.random() * 0.3 + 0.1), // 0.1–0.4
  });

  useEffect(() => {
    // ✅ Center geometry pivot
    scene.traverse((child) => {
      if (child.isMesh) {
        child.geometry.center();
      }
    });

    if (actions && Object.keys(actions).length > 0) {
      const action = actions[Object.keys(actions)[0]];
      action.reset();
      action.paused = true; 
      action.play();
      actionRef.current = action;
    }
  }, [actions, scene]);

  useFrame((state, delta) => {
    if (groupRef.current && actionRef.current) {
      // 🔄 Random multi-axis tumbling
      groupRef.current.rotation.x += delta * speeds.current.x;
      groupRef.current.rotation.y += delta * speeds.current.y;
      groupRef.current.rotation.z += delta * speeds.current.z;

      // 🎬 Sync open/close with rotation progress (based on Y-axis spin)
      const duration = actionRef.current.getClip().duration;
      let t = (groupRef.current.rotation.y % (2 * Math.PI)) / (2 * Math.PI);

      let pingPong = t < 0.5 ? t * 2 : (1 - t) * 2;
      actionRef.current.time = duration * pingPong;
      mixer.update(0);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} {...props} />
    </group>
  );
}

export default function ModelViewer() {
  return (
    <Canvas camera={{ position: [0, 0, 6] }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[2, 2, 5]} />
      <Model scale={1.5} />
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  );
}
