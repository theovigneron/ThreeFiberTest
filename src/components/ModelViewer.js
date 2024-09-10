import React, { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  GizmoHelper,
  GizmoViewport,
  PivotControls,
} from "@react-three/drei";
import { useGLTF, Clone } from "@react-three/drei";

function RecursiveObject({ object }) {
  // Si l'objet est un Mesh, on le dessine
  if (object?.isMesh) {
    return (
      <mesh
        castShadow
        receiveShadow
        geometry={object?.geometry}
        material={object?.material}
      />
    );
  }

  if (object.isPerspectiveCamera) return null;
  // Si l'objet est un Group ou autre, on parcourt ses enfants
  return (
    <group position={object.position} rotation={object.rotation}>
      {object.children.map((child) => (
        <RecursiveObject key={child.uuid} object={child} />
      ))}
    </group>
  );
}

function ModelRecursive(props) {
  const {
    position,
    selectedObjectId,
    setSelectedObjectId,
    path,
    setIsMoving,
    index,
  } = props;
  const { scene } = useGLTF(path); // Charger le GLB et obtenir la scène
  console.log(index);

  const object3D = useRef();

  useEffect(() => {
    if (object3D === selectedObjectId) {
      object3D.current.traverse((child) => {
        if (child.isMesh) {
          child.material.color.set("red");
        }
      });
    }
  }, [object3D, selectedObjectId]);
  return (
    <group
      dispose={null}
      scale={0.01}
      position={position}
      onClick={() => setSelectedObjectId(index)}
    >
      <PivotControls
        onDragStart={() => {
          setIsMoving(true);
        }}
        onDragEnd={() => setIsMoving(false)}
        visible={selectedObjectId === index}
      >
        <RecursiveObject object={scene} />{" "}
      </PivotControls>
    </group>
  );
}

useGLTF.preload("/model.glb");
useGLTF.preload("/49476-EU.glb");
useGLTF.preload("/84891-EU.glb");
useGLTF.preload("/Seringue (1).glb");

const ModelViewer = () => {
  const [isMoving, setIsMoving] = useState(false);
  const [selectedObjectId, SetSelectedObjectId] = useState(null);

  return (
    <Canvas style={{ height: "100vh", width: "100vw" }}>
      <OrbitControls enabled={!isMoving} />
      <axesHelper args={[0.5]} />

      <ambientLight intensity={0.5} />
      <gridHelper args={[20, 20, 0xff0000, "teal"]} />
      <directionalLight position={[5, 5, 5]} />
      {Array(2)
        .fill(1)
        .map((_, i) => {
          return (
            <ModelRecursive
              key={i}
              index={i}
              position={[((i * 15) % 10) / 5, Math.floor(i / 10) / 5, 0]}
              setSelectedObjectId={SetSelectedObjectId}
              setIsMoving={setIsMoving}
              selectedObjectId={selectedObjectId}
              rotation={[0, 0, 0]}
              path={"/Seringue (1).glb"}
            />
          );
        })}

      <GizmoHelper
        alignment="bottom-right" // widget alignment within scene
        margin={[80, 80]} // widget margins (X, Y)
      >
        <GizmoViewport
          axisColors={["red", "green", "blue"]}
          labelColor="black"
        />
      </GizmoHelper>
    </Canvas>
  );
};

export default ModelViewer;
