import React, { cache } from "react";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../../../convex/_generated/api";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { HoverEffect } from "@/components/ui/Hoverefffect";
import { baganKejuaraan } from "@/data";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

export interface Iparams {
  params: {
    championshipname: string;
  };
}
async function getChampionship(name: string) {
  const user = await fetchQuery(
    api.championship.getKejuaraanByName,
    {
      name,
    },
    { token: convexAuthNextjsToken() }
  );
  if (!user) redirect("/home");

  return user;
}

export async function generateMetadata({
  params: { championshipname },
}: Iparams): Promise<Metadata> {
  const championship = await getChampionship(
    decodeURIComponent(championshipname)
  );

  return {
    title: `${championship.name} `,
  };
}

const page = ({ params }: Iparams) => {
  const names = decodeURIComponent(params.championshipname);
  return (
    <main className="py-20 lg:py-0 lg:h-screen h-full w-full flex justify-center items-center flex-col ">
      <h1 className="text-center text-4xl font-bebas text-red-800">{names}</h1>
      <HoverEffect items={baganKejuaraan} name={names} />
    </main>
  );
};

export default page;
