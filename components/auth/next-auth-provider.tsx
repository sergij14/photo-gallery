"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "../ui/toaster";

export const NextAuthProvider = ({ children }: any) => {
  return (
    <SessionProvider>
      {children} <Toaster />
    </SessionProvider>
  );
};
