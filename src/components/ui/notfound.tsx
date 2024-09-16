"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./button";
import { useRouter } from "next/navigation";

interface ClientOnlyProps {
  children: React.ReactNode;
}

export const ClientOnly: React.FC<ClientOnlyProps> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }
  return <>{children}</>;
};

export const DataLength = ({
  text,
  className,
}: {
  text: string;
  className: string;
}) => {
  const { back } = useRouter();
  return (
    <div
      className={`w-full ${className}  flex flex-col justify-center items-center`}
    >
      <div className="text-2xl font-bold">{text}</div>
      <Button
        onClick={() => back()}
        className="rounded-full py-2 px-4 w-[100px] border-2 hover:bg-card"
      >
        Back{" "}
      </Button>
    </div>
  );
};
