"use client";

import Header from "@/components/header/header";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <Header />
      <main>
        <Button>btn</Button>
      </main>

      {session?.user ? (
        <>
          Signed in as {session.user?.name} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
    </>
  );
}
