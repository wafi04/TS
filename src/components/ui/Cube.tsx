"use client";
import { Canvas, useLoader } from "@react-three/fiber";
import React, { useRef } from "react";
import { motion } from "framer-motion-3d";

import { OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three/src/loaders/TextureLoader.js";

import { useSpring, useScroll, useTransform } from "framer-motion";

interface Props {
  height: string;
  h2: string;
}

export const Three = ({ height, h2 }: Props) => {
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,

    offset: ["start start", "end end"],
  });
  const progress = useTransform(scrollYProgress, [0, 1], [0, 3]);
  const smoothProgress = useSpring(progress, { damping: 20 });
  return (
    <div ref={container} className={`${height}`}>
      <div className={`sticky top-0 ${h2}`}>
        <Canvas>
          <OrbitControls enableZoom={false} enablePan={false} />
          <ambientLight intensity={2} />
          <directionalLight position={[2, 1, 1]} />
          <Cube progress={smoothProgress} />
        </Canvas>
      </div>
    </div>
  );
};

function Cube({ progress }: any) {
  const mesh = useRef(null);

  const texture_1 = useLoader(TextureLoader, "/logoKejurnas.jpg");
  const texture_2 = useLoader(TextureLoader, "/logoKejurnas.jpg");
  const texture_3 = useLoader(TextureLoader, "/logoKejurnas.jpg");
  const texture_4 = useLoader(TextureLoader, "/logoKejurnas.jpg");
  const texture_5 = useLoader(TextureLoader, "/logoKejurnas.jpg");
  const texture_6 = useLoader(TextureLoader, "/logoKejurnas.jpg");

  return (
    <motion.mesh ref={mesh} rotation-y={progress} rotation-x={progress}>
      <boxGeometry args={[2.5, 2.5, 2.5]} />
      <meshStandardMaterial map={texture_1} attach="material-0" />

      <meshStandardMaterial map={texture_2} attach="material-1" />

      <meshStandardMaterial map={texture_3} attach="material-2" />

      <meshStandardMaterial map={texture_4} attach="material-3" />

      <meshStandardMaterial map={texture_5} attach="material-4" />

      <meshStandardMaterial map={texture_6} attach="material-5" />
    </motion.mesh>
  );
}
