import { Button } from "@/components/ui/button";
import { Rounded } from "@/components/ui/Rounded";
import { TextOpacity } from "@/components/ui/textOpacity";
import TextReveal from "@/components/ui/textreveal";
import { datas } from "@/data";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <main className=" overflow-hidden">
      <section className="h-screen mb-10   max-h-[1120px] font-bebas relative w-full justify-center flex items-center">
        <div id="container" className="w-full h-full sm:px-24 px-6 relative">
          <Image
            src="/logoKejurnas.jpg"
            alt="Hero Background"
            priority
            fill
            className="w-full h-full object-cover  absolute"
          />
          <div className="absolute inset-0 bg-black/80 opacity-50"></div>
          <div className="flex sm:flex-row pb-10 flex-col-reverse items-start sm:items-end gap-3 xl:gap-0 sm:justify-between w-full relative bottom-0 h-full z-10">
            <Link href="/about">
              <Button className="text-md px-4 font-bebas pb-3 pt-4 w-fit border-2 dark:border-white  hover:bg-white rounded-none text-black">
                Explore
              </Button>
            </Link>
            <div className="flex flex-col w-fit justify-end text-end ">
              <TextReveal className="flex flex-col">
                <span>Tapak Suci Putra Muhammadiyah</span>
                <span className="text-[20px]">
                  Perguruan Seni Beladiri Tapak Suci Putra Muhammadiyah
                </span>
              </TextReveal>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full h-full container flex justify-center items-center my-[100px]">
        <TextOpacity desc={datas[0].konten} title={datas[0].judul} />
        <div className="flex justify-end">
          <Rounded className="rounded-full">
            <p>View More</p>
          </Rounded>
        </div>
      </section>
      <section
        id="section"
        className="overflow-hidden relative h-screen max-h-[1120px] mb-[100px] sm:max-h-screen w-full "
      >
        <div id="container" className="px-6 sm:px-24 w-full h-fit">
          <p className="text-[100vh] font-bebas leading-none text-red-700">
            tapakSuci
          </p>
          <div className="absolute top-[40%] aspect-square w-[88vw] sm:w-[30vw] left-0">
            <Image
              src={"/logoKejurnas.jpg"}
              alt="../"
              width={1000}
              height={1000}
              className="h-full object-cover w-full"
            />
          </div>
        </div>
      </section>
    </main>
  );
};

export default page;
