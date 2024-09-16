import React from "react";
import Match from "./Match";
import { Id } from "../../../../../../../convex/_generated/dataModel";

interface Iparams {
  params: {
    matchId: Id<"match">;
    championshipname: string;
  };
}

const page = ({ params }: Iparams) => {
  const name = decodeURIComponent(params.championshipname);
  return (
    <main className="w-full h-screen container">
      <Match matchId={params.matchId} name={name} />
    </main>
  );
};

export default page;
