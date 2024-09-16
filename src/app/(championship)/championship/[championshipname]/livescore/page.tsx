import { Metadata } from "next";
import React from "react";
import Livescore from "./Livescore";
import { Id } from "../../../../../../convex/_generated/dataModel";

export const metadata: Metadata = {
  title: "Live Score",
};

interface Iparams {
  params: {
    championshipname: string;
  };
  searchParams: {
    pertandingan?: Id<"match">;
  };
}
const Page = ({ params, searchParams }: Iparams) => {
  return (
    <main className="w-full h-screen  container">
      <Livescore
        name={decodeURIComponent(params.championshipname)}
        matchId={searchParams.pertandingan}
      />
    </main>
  );
};

export default Page;
