import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

type AuthGuardProps = {
  children: JSX.Element;
};

const signinUrl = "/api/auth/signin";

function AuthGuard({ children }: AuthGuardProps) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" && router.pathname !== signinUrl) {
      router.push(signinUrl);
    }
  }, [status, router]);

  switch (status) {
    case "authenticated":
      return children;
    case "loading":
      return <p>Loading...</p>;
    case "unauthenticated":
      return <>Redirecting...</>;
    default:
      return <p>Unknown status: {status}</p>;
  }
}

export default AuthGuard;
