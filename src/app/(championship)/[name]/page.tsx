import { fetchQuery } from "convex/nextjs";
import { Metadata } from "next";
import React from "react";
import { api } from "../../../../convex/_generated/api";
import { notFound } from "next/navigation";
import UiProfile from "./UiProfile";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";

export interface Iparams {
  params: {
    name: string;
  };
}

async function getUser(name: string) {
  const user = await fetchQuery(
    api.users.getUserByname,
    {
      name,
    },
    { token: convexAuthNextjsToken() }
  );
  if (!user) notFound();

  return user;
}

export async function generateMetadata({
  params: { name },
}: Iparams): Promise<Metadata> {
  const user = await getUser(decodeURIComponent(name));

  return {
    title: `${user.name}  `,
  };
}

export default async function Page({ params }: Iparams) {
  return (
    <main className="flex justify-center items-center min-h-screen py-20 h-full">
      <UiProfile name={decodeURIComponent(params.name)} />
    </main>
  );
}
