"use client";
import Header from "@/components/features/championship/components/Header";
import ListPertandingan from "@/components/features/match/ListMatchAndReferee";
import OtherPesertaButtons from "@/components/features/match/toggleCreateMatch";
import { useUser } from "@/hooks/useUser";
import { useQuery } from "convex/react";
import React, { useState } from "react";
import { api } from "../../../../../../convex/_generated/api";

const Wasit = ({ championshipname }: { championshipname: string }) => {
  const [msg, setMsg] = useState("");
  const { user: me } = useUser();

  const championship = useQuery(api.championship.getKejuaraanByName, {
    name: championshipname,
  });

  return (
    <>
      {championship?.user && (
        <Header title="List Match" className="font-bebas">
          {championship.user === me?._id && (
            <OtherPesertaButtons
              name={championshipname}
              onChange={(e) => setMsg(e.target.value)}
              msg={msg}
            />
          )}
        </Header>
      )}
      <ListPertandingan name={championshipname} />
    </>
  );
};

export default Wasit;
