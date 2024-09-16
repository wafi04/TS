import { Metadata } from "next";
import React from "react";
import { Iparams } from "../page";
import Wasit from "./Wasit";

export const metadata: Metadata = {
  title: "Wasit",
};

const page = ({ params }: Iparams) => {
  const names = decodeURIComponent(params.championshipname);
  return (
    <main className="h-screen w-full container">
      <Wasit championshipname={names} />
    </main>
  );
};

export default page;
