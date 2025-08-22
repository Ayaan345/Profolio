"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import { useRef, useEffect, Suspense } from "react";
import * as THREE from "three";

function BlackholeModel(props) {
  const groupRef = useRef();
  const ringRefs = useRef([]);
  // NOTE: useGLTF returns animations array too
  const { scene, animations } = useGLTF("/blackhole/scene-optimized.glb");

  // connect animations to the group root
  const { actions, mixer } = useAnimations(animations, groupRef);

  useEffect(() => {
    ringRefs.current = [];

    // center the scene
    const box = new THREE.Box3().setFromObject(scene);
    if (!box.isEmpty()) {
      const center = new THREE.Vector3();
      box.getCenter(center);
      scene.position.sub(center);
    }

    // find ring/disk meshes and collect them
    scene.traverse((child) => {
      if (child.isMesh) {
        if (child.geometry && typeof child.geometry.center === "function") {
          try { child.geometry.center(); } catch (e) {}
        }

        const name = (child.name || "").toLowerCase();
        let materialName = "";
        if (Array.isArray(child.material)) {
          materialName = child.material.map(m => m?.name || "").join(" ").toLowerCase();
        } else {
          materialName = (child.material?.name || "").toLowerCase();
        }

        if (
          name.includes("ring") ||
          name.includes("disk") ||
          name.includes("accretion") ||
          name.includes("corona") ||
          materialName.includes("ring") ||
          materialName.includes("disk")
        ) {
          ringRefs.current.push(child);
          console.log("Found ring/disk mesh:", child.name);
        }
      }
    });

    // --- Animation control: inspect available actions ---
    const actionNames = Object.keys(actions || {});
    console.log("GLTF animation actions:", actionNames);

    // Heuristics to decide which actions to play vs stop:
    // - Play actions that look like debris/particle/orbit (names with debris, particle, orbit, spin)
    // - Stop or mute actions that look like ring/disk transforms (names with ring, disk, accretion)
    const playPattern = /debris|particle|orbit|orbiting|debris_spin|spin|cloud|dust/i;
    const stopPattern = /ring|disk|accretion|corona|ring_spin|disk_spin/i;

    if (actionNames.length) {
      actionNames.forEach((name) => {
        const action = actions[name];
        if (!action) return;

        if (stopPattern.test(name)) {
          // stop/mute ring-related action
          try {
            action.stop();
            action.enabled = false;
            action.setEffectiveWeight(0);
          } catch (e) { /* ignore */ }
          console.log(`Stopped/muted action: ${name}`);
        } else if (playPattern.test(name)) {
          // play debris-like actions
          try {
            action.reset();
            action.play();
            action.setLoop(THREE.LoopRepeat, Infinity);
            action.timeScale = 1; // adjust speed if you want
          } catch (e) { /* ignore */ }
          console.log(`Playing action: ${name}`);
        } else {
          // If uncertain, play it but with low weight (safe default).
          try {
            action.reset();
            action.play();
            action.setEffectiveWeight(0.2);
            action.setLoop(THREE.LoopRepeat, Infinity);
          } catch (e) { /* ignore */ }
          console.log(`Playing (default) action: ${name}`);
        }
      });
    } else {
      console.log("No animations found in GLTF animations array.");
    }

    // --- Backup: explicitly lock ring meshes so they won't be transformed by mixer ---
    // (This may be redundant if we stopped the actions, but it's a safe fallback.)
    ringRefs.current.forEach((ring) => {
      if (!ring) return;
      ring.rotation.set(0, 0, 0);      // fixed orientation
      ring.updateMatrix();
      ring.matrixAutoUpdate = false;   // freeze transforms
    });

    console.log("Rings locked. Count:", ringRefs.current.length);

    // cleanup: stop mixer on unmount
    return () => {
      try {
        if (mixer) mixer.stopAllAction();
      } catch (e) {}
    };
  }, [scene, actions, mixer]);

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={[4, 4, 4]} rotation={[Math.PI / 210, 0, 0]}  />
    </group>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="#1a1a2e" wireframe />
    </mesh>
  );
}

export default function Blackhole() {
  return (
    <div className="absolute inset-0 z-0 opacity-90 mt-30 md:mt-0">
      <Canvas camera={{ position: [0, 0, 12] }}>
        <hemisphereLight intensity={0.8} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -5]} intensity={0.6} />

        <Suspense fallback={<LoadingFallback />}>
          <BlackholeModel />
        </Suspense>

        <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
      </Canvas>
    </div>
  );
}

// Preload GLTF
useGLTF.preload("/blackhole/scene-optimized.glb");
