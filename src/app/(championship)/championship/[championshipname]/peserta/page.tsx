import React from "react";
import { Iparams } from "../page";
import Participants from "@/components/features/participants/participants";

const Page = ({ params }: Iparams) => {
  const name = decodeURIComponent(params.championshipname);
  return (
    <main className="  h-screen  w-full   container ">
      <Participants championshipname={name} />
    </main>
  );
};

export default Page;
