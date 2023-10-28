"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "../ui/toaster";
import Header from "../header/header";

export const AppProvider = ({ children }: any) => {
  return (
    <SessionProvider>
      <div className="max-w-[800px] mx-auto h-full flex flex-col">
        <Header />
        {children}

        <Toaster />
      </div>
    </SessionProvider>
  );
};
