import { Metadata } from "next";
import React from "react";
import { Championship } from "./Championship";

export const metadata: Metadata = {
  title: "Championship",
};

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col container">
      <Championship />
    </div>
  );
};

export default Page;
