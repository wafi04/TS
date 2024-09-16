"use client";
import React, { ReactNode, useEffect, useRef } from "react";
import gsap from "gsap";
interface RoundedProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  backgroundColor?: string;
  width?: string;
  height?: string;
  className?: string;
}

export const Rounded: React.FC<RoundedProps> = ({
  children,
  width = "150px",
  height = "150px",
  backgroundColor = "#455CE9",
  className,
  ...attributes
}) => {
  const circle = useRef<HTMLDivElement | null>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  let timeoutId: NodeJS.Timeout | null = null;

  useEffect(() => {
    if (circle.current) {
      timeline.current = gsap.timeline({ paused: true });
      timeline.current
        .to(
          circle.current,
          { top: "-25%", width: "150%", duration: 0.4, ease: "power3.in" },
          "enter"
        )
        .to(
          circle.current,
          { top: "-150%", width: "125%", duration: 0.25 },
          "exit"
        );
    }
  }, []);

  const manageMouseEnter = () => {
    if (timeoutId) clearTimeout(timeoutId);
    timeline.current?.tweenFromTo("enter", "exit");
  };

  const manageMouseLeave = () => {
    timeoutId = setTimeout(() => {
      timeline.current?.play();
    }, 300);
  };

  return (
    <div
      className={`roundedButton   ${className}`}
      style={{ overflow: "hidden", width: width, height: height }} // Menambahkan style ukuran
      onMouseEnter={manageMouseEnter}
      onMouseLeave={manageMouseLeave}
      {...attributes}
    >
      {children}
      <div ref={circle} style={{ backgroundColor }} className={"circle"}></div>
    </div>
  );
};
