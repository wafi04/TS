import { Metadata } from "next";
import React from "react";
import { Iparams } from "../page";
import FormParticipants from "@/components/features/championship/components/form/formParticipants";

export const metadata: Metadata = {
  title: "Form",
};

const page = ({ params }: Iparams) => {
  const championshipname = decodeURIComponent(params.championshipname);
  return (
    <main className="py-20 lg:py-0 lg:h-screen h-full w-full flex justify-center items-center flex-col ">
      <FormParticipants championshipname={championshipname} />
    </main>
  );
};

export default page;
