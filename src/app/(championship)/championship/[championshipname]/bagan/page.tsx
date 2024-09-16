import React from "react";
import TournamentBracket from "./BracketClient";
interface PageProps {
  params: {
    championshipname: string;
  };
}

const Page = ({ params }: PageProps) => {
  const namaKejuaraan = decodeURIComponent(params.championshipname);
  return <TournamentBracket kejuaraanName={namaKejuaraan} />;
};

export default Page;
