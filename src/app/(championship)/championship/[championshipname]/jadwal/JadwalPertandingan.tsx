"use client";
import { useQuery } from "convex/react";
import React from "react";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
// import { FilterByBagan } from "../bagan/FilterByKelas";
// import { Headers } from "@/components/ui/Header";
import { useSearchParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import DesignJadwalPage from "./Design";

const JadwalPertandingan = ({
  name,
  isAll,
}: {
  name: string;
  isAll: boolean;
}) => {
  const params = useSearchParams();
  const { user: me } = useUser();
  const matches = useQuery(api.match.getMatchNotAggree, {
    championshipname: name,
  });
  const matchs = useQuery(api.match.getMatchAggree, {
    championshipname: name,
  });
  const Kejuaraan = useQuery(api.championship.getKejuaraanByName, {
    name,
  });

  const dataMatchs = isAll ? matchs : matches;

  return (
    <DesignJadwalPage
      isShow={Kejuaraan?.user === me?._id}
      match={dataMatchs}
      isAll={isAll}
      name={name}
    />
  );
};
export default JadwalPertandingan;
