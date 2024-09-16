"use client";
import { useEffect, useState } from "react";

interface Props {
  datas: {
    judul: string;
    konten: string;
  }[];
}

export const Components = ({ datas }: Props) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveIndex(parseInt(entry.target.id.replace("section-", "")));
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5, // Set to 0.5 for when 50% of the item is visible
      }
    );

    datas.forEach((item, index) => {
      const element = document.getElementById(`section-${index}`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      datas.forEach((item, index) => {
        const element = document.getElementById(`section-${index}`);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [datas]);
  return (
    <section className="px-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 relative h-full">
      <div className="hidden md:block col-span-1"></div>
      <div className="col-span-1 md:col-span-3 w-full space-y-10 ">
        {datas.map((item, index) => (
          <div key={index} id={`section-${index}`}>
            <p className="text-xl ">{item.judul}</p>
            <p>{item.konten}</p>
          </div>
        ))}
      </div>
      <div className="hidden md:block col-span-1 items-center relative h-full">
        <div className="px-6 space-y-3 sticky top-16 h-screen">
          <p className="text-[20px] w-full font-bold">On this page</p>
          {datas.map((item, index) => (
            <p
              key={`index-${index}`}
              className={` ${
                index === activeIndex ? "border-b-2 border-white" : ""
              }  w-fit`}
            >
              {item.judul}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};
