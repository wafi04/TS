import React from "react";
import { Iparams } from "../page";
import JadwalPertandingan from "./JadwalPertandingan";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jadwal",
};

const Page = ({ params }: Iparams) => {
  const name = decodeURIComponent(params.championshipname);
  return <JadwalPertandingan name={name} isAll={false} />;
};

export default Page;
