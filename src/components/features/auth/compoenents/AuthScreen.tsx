"use client";
import React, { useState } from "react";
import SignUpCard, { AuthFlow } from "./SignUp";
import SignInCard from "./signIn";

const AuthSecreen = () => {
  const [state, setState] = useState<AuthFlow>("signIn");
  return (
    <div className="h-screen flex items-center justify-center bg-gray-200">
      <div className="md:h-auto  md:w-[420px]">
        {state === "signIn" ? (
          <SignInCard setState={setState} />
        ) : (
          <SignUpCard setState={setState} />
        )}
      </div>
    </div>
  );
};

export default AuthSecreen;
