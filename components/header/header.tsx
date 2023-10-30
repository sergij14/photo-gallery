import React from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { PinLeftIcon, PinRightIcon } from "@radix-ui/react-icons";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="flex flex-col gap-4">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-center">
        <Link href="/">Photo Gallery</Link>
      </h1>
      <div className="flex flex-col gap-4 text-center sm:text-left sm:flex-row sm:justify-between items-center bg-gray-50 p-4 rounded-md mb-4">
        {session ? (
          <>
            <p>
              Signed in as <b>{session?.user?.name}</b>
            </p>
            <Button
              className="flex items-center gap-2"
              onClick={() => signOut()}
            >
              <PinLeftIcon className="w-4 h-4" />
              Sign out
            </Button>
          </>
        ) : (
          <>
            <p>Not signed in</p>
            <Button
              className="flex items-center gap-2"
              onClick={() => signIn()}
            >
              <PinRightIcon className="w-4 h-4" />
              Sign in
            </Button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
