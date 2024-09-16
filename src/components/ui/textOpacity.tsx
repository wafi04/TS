"use client";
import React from "react";
import { useInView, motion } from "framer-motion";
import { useRef } from "react";
export const slideUp = {
  initial: {
    y: "100%",
  },
  open: (i: any) => ({
    y: "0%",
    transition: { duration: 0.5, delay: 0.01 * i },
  }),
  closed: {
    y: "100%",
    transition: { duration: 0.5 },
  },
};

interface Props {
  title?: string;
  desc: string;
  className?: string;
}

export const TextOpacity = ({ desc, title, className }: Props) => {
  const phrase = desc;
  const description = useRef(null);
  const isInView = useInView(description);

  return (
    <div className={`font-blog `}>
      <motion.h4
        variants={slideUp}
        custom={0.4}
        animate={isInView ? "open" : "closed"}
        className="text-[40px] uppercase"
      >
        {title}
      </motion.h4>
      <div ref={description}>
        <p className={`m-0 ${className} leading-[1.3]`}>
          {phrase.split(" ").map((word, index) => {
            return (
              <span
                key={index}
                className={"relative overflow-hidden inline-flex mr-3"}
              >
                <motion.span
                  variants={slideUp}
                  custom={index}
                  animate={isInView ? "open" : "closed"}
                  key={index}
                >
                  {word}
                </motion.span>
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
};
