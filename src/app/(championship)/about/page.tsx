import Image from "next/image";
import React from "react";
import { Redo } from "lucide-react";
import { Metadata } from "next";
import { TextOpacity } from "@/components/ui/textOpacity";
import { Components } from "./Components";
import { datas } from "@/data";
import { Three } from "@/components/ui/Cube";

export const metadata: Metadata = {
  title: "About",
  description: "Tapak Suci Putra Muhammdiyah",
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Tapak Suci",
    title: "About Page",
    // description: datas.section2[0].konten,
  },
  authors: [
    { name: "Moh. Wafiuddin Wafiq" },
    { name: "Tapak Suci Putra Muhammadiyah" },
  ],
};

const About = () => {
  return (
    <main className="w-full h-full py-20 font-blog">
      <section className="h-full md:h-screen w-full flex flex-col px-[80px]">
        <h1 className=" text-[18vw] leading-none text-gray-200 uppercase">
          About
        </h1>
        <div className="flex-col flex md:flex-row w-full h-full justify-center md:justify-end">
          <div className="flex flex-col gap-10 relative text-gray-600 ">
            <TextOpacity
              className="text-end text-[25px] "
              desc="
            Tapak Suci adalah sebuah organisasi bela diri yang menggabungkan nilai-nilai spiritual dan fisik dalam pembelajarannya. "
            />
            <p className="grid place-content-center ">
              <span>One Family</span>
              <span>One Organization</span>
            </p>
            <p className={`place-content-end flex gap-4 m-4 text-gray-300`}>
              Are Your Ready
              <span>
                <Redo />
              </span>
            </p>
          </div>
          <Image
            src={"/logoKejurnas.jpg"}
            alt="/"
            width={500}
            height={500}
            className="items-end object-cover  w-[400px] h-full  "
          />
        </div>
      </section>
      <Section2 />
      <Components datas={datas} />
    </main>
  );
};

export default About;

const Section2 = () => {
  return (
    <section className="w-full h-full overflow-hidden  py-[20vh] my-10 relative  border-y-2 border-neutral-900">
      <TextOpacity
        desc="TAPAK SUCI"
        className="text-[10vw] leading-none font-bold "
      />
      <TextOpacity
        desc="PUTRA MUHAMMADIYAH "
        className="text-[10vw] leading-none font-bold "
      />
      <Three
        h2="h-screen"
        height="absolute -top-20 md:-bottom-0  w-full  h-[200px] md:h-screen md:left-1/2 w-[200px] md:w-[400px]"
      />
    </section>
  );
};
