import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { useGLTF, Clone } from "@react-three/drei";

function Model({ pos }) {
  const models = [
    "/model.glb",
    "/49476-EU.glb",
    "/84891-EU.glb",
    "/96360-EU.glb",
  ];

  // Fonction pour obtenir un modèle GLTF aléatoire
  const getRandomModel = () => {
    const randomIndex = Math.floor(Math.random() * models.length);
    return models[randomIndex];
  };

  return (
    <>
      {Array(100)
        .fill(1)
        .map((_, i) => {
          const randomModelPath = getRandomModel(); // Sélectionner un modèle aléatoire
          return (
            <RandomModel
              key={i}
              path={randomModelPath}
              position={[(i % 10) / 5, Math.floor(i / 10) / 5, 0]}
            />
          );
        })}
    </>
  );
}

function RandomModel({ path, position }) {
  const gltf = useGLTF(path);
  return <Clone object={gltf.scene} position={position} />;
}

useGLTF.preload("/model.glb");
useGLTF.preload("/49476-EU.glb");
useGLTF.preload("/84891-EU.glb");
useGLTF.preload("/96360-EU.glb");

const ModelViewer = () => {
  const groupRef = useRef();

  return (
    <Canvas style={{ height: "100vh", width: "100vw" }}>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <Suspense fallback={null}>
        <Model pos={[0, 0, 0]} />
      </Suspense>
    </Canvas>
  );
};

export default ModelViewer;
