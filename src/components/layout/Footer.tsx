"use client";
import styles from "./styles.module.scss";
import Image from "next/image";
import { useRef } from "react";
import { useScroll, motion, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { Rounded } from "../ui/Rounded";

export const Footer = () => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end end"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y = useTransform(scrollYProgress, [0, 1], [-200, 0]);
  const rotate = useTransform(scrollYProgress, [0, 1], [120, 90]);
  return (
    <motion.div
      style={{ y }}
      ref={container}
      className={`${styles.contact}  bg-gray-200 dark:bg-gray-800`}
    >
      <div className={styles.body}>
        <div
          className={`container flex flex-col md:flex-row  gap-10 items-center ${styles.title}`}
        >
          <div
            className={`rounded-full w-[200px] h-[200px] flex ${styles.imageContainer}`}
          >
            <Image
              fill={true}
              alt={"image"}
              src={`/logo.png`}
              className="w-full h-full object-cover bg-gray-600"
            />
          </div>
          <div className="font-blog ml-0 md:ml-[20px] space-y-5">
            <h2 className=" leading-none text-[40px] md:text-[50px]">
              Tapak Suci Putra Muhammadiyah
            </h2>
            <p className="w-full md:w-[calc(100%-200px)]">
              Jl. Panjang No.7, RT.16/RW.9, Cipulir, Kec. Kby. Lama, Kota
              Jakarta Selatan, Daerah Khusus Ibukota Jakarta 1223
            </p>
          </div>
          <motion.div style={{ x }} className={styles.buttonContainer}>
            <Rounded className={styles.button}>
              <p>Get in touch</p>
            </Rounded>
          </motion.div>
          <motion.svg
            style={{ rotate, scale: 2 }}
            width="9"
            height="9"
            viewBox="0 0 9 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 8.5C8.27614 8.5 8.5 8.27614 8.5 8L8.5 3.5C8.5 3.22386 8.27614 3 8 3C7.72386 3 7.5 3.22386 7.5 3.5V7.5H3.5C3.22386 7.5 3 7.72386 3 8C3 8.27614 3.22386 8.5 3.5 8.5L8 8.5ZM0.646447 1.35355L7.64645 8.35355L8.35355 7.64645L1.35355 0.646447L0.646447 1.35355Z"
              fill="white"
            />
          </motion.svg>
        </div>
        <div className={styles.nav}>
          <div className="bg-gray-300 dark:bg-gray-600  py-2  px-4  rounded-md">
            <p>wafiq610@gmail.com</p>
          </div>
          <div className="py-2  px-4 bg-gray-300 dark:bg-gray-600  rounded-md">
            <Link href={"/https://www.instagram.com/waffi._/"}>
              <p>@waffi._</p>
            </Link>
          </div>
        </div>
        <div className={styles.info}>
          <div className="font-blog">
            <span>
              <h3>Build with Love </h3>
              <p>Wafiuddin © Edition</p>
            </span>
            <span>
              <h3>Version</h3>
              <p>{new Date().getFullYear()}</p>
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
