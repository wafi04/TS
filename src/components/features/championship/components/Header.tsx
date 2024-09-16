"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

const Header = ({
  title,
  className,
  children,
  backs,
}: {
  title: string;
  className?: string;
  children?: ReactNode;
  backs?: boolean;
}) => {
  const { back } = useRouter();
  return (
    <div
      className={cn(
        "flex justify-between  border-b  pt-20 items-center w-full",
        className
      )}
    >
      <div className="flex gap-3 items-center">
        {backs && (
          <Button onClick={() => back()} className="rounded-full p-2">
            <ArrowLeft />
          </Button>
        )}
        <h1 className="text-xl font-bebas">{title}</h1>
      </div>
      {children}
    </div>
  );
};

export default Header;
