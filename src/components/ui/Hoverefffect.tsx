"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const HoverEffect = ({
  items,
  className,
  name,
}: {
  items: {
    nama: string;
    link: string;
    role: string[];
  }[];
  name: string;
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 h-fit lg:grid-cols-3 gap-4 container ",
        className
      )}
    >
      {items.map((item, idx) => (
        <Link
          key={item.nama}
          href={`/championship/${name}/${item.link}`}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-blue-900 block rounded-lg -z-10"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <div
            className={`rounded-md w-full p-4 overflow-hidden bg-black ring-[2px]  
              group-hover:border-none group-hover:shadow-2xl group-hover:shadow-blue-200 
              group-hover:ring-4 ring-red-700 relative transition-all duration-500 group-hover:ring-white`}
          >
            <div className="py-10 text-center space-y-10 text-gray-300">
              <p className="text-2xl font-bebas relative group-hover:text-red-700">
                {item.nama}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
