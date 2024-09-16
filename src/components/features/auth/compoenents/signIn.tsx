import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthActions } from "@convex-dev/auth/react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Github, TriangleAlert } from "lucide-react";
import { AuthFlow } from "./SignUp";

interface Props {
  setState: (state: AuthFlow) => void;
}

const SignInCard: React.FC<Props> = ({ setState }) => {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [erorr, setErorr] = useState("");
  const [password, setPassword] = useState("");
  const { signIn } = useAuthActions();

  const handleProvider = (provider: "google") => {
    setPending(true);
    signIn(provider).finally(() => setPending(false));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    signIn("password", {
      email,
      password,
      flow: "signIn",
    })
      .catch(() => {
        setErorr("Invalid Email Or Password");
      })
      .finally(() => setPending(false));
  };

  return (
    <Card className="w-full shadow-lg p-3">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">Login to Continue</CardTitle>
        <CardDescription>Use your email to login</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!!erorr && (
          <div className="bg-destructive/15 text-destructive p-3 rounded-md flex items-center gap-x-2 text-sm">
            <TriangleAlert className="size-4" />
            {erorr}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            placeholder="Email"
            disabled={pending}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="w-full"
          />
          <Input
            placeholder="Password"
            type="password"
            disabled={pending}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />
          <Button type="submit" className="w-full" disabled={pending}>
            Sign In
          </Button>
        </form>
        <Separator className="my-4" />
        <Button
          className="w-full flex items-center justify-center gap-2 relative"
          onClick={() => handleProvider("google")}
          disabled={pending}
        >
          <SVG />
          Continue with Google
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Don&apos;t have an account?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setState("signUp")}
          >
            Sign Up
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignInCard;

export function SVG() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="25"
      viewBox="0 0 48 48"
    >
      <path
        fill="#4285F4"
        d="M44.5 20H24v8.5h11.7C34.8 33.9 30.2 38 24 38c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l6.2-6.2C34.1 8.3 29.3 6 24 6 13.5 6 5 14.5 5 25s8.5 19 19 19c10.4 0 18.5-7.5 18.5-18 0-1.2-.1-2.3-.3-3.5z"
      />
      <path
        fill="#34A853"
        d="M10.7 29.7l-1.6 6-5.9.1C3.6 32.3 3 28.7 3 25s.6-7.3 1.6-10.8l6 6.2c-.7 2-1.1 4.2-1.1 6.6s.4 4.6 1.2 6.7z"
      />
      <path
        fill="#FBBC05"
        d="M24 10c3.1 0 5.8 1.2 7.9 3.1l6.2-6.2C34.1 8.3 29.3 6 24 6 13.5 6 5 14.5 5 25c0 2.3.4 4.6 1.2 6.7l6.6-6.7c-.8-2-1.2-4.3-1.2-6.7 0-6.6 5.4-12 12-12z"
      />
      <path
        fill="#EA4335"
        d="M24 44c5.9 0 10.9-2 14.5-5.4l-6.6-6.7C29.2 34.8 26.7 36 24 36c-6.6 0-12-5.4-12-12 0-2.3.4-4.6 1.2-6.7l-6.6-6.7C5.6 14.5 5 18.3 5 25c0 10.5 8.5 19 19 19z"
      />
    </svg>
  );
}
