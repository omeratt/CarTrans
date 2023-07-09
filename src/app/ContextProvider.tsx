import { createContext, useContext, useState } from "react";

type MyContextValue = string;

const MyContext = createContext<MyContextValue | undefined>(undefined);

export function MyContextProvider({ children }: { children: React.ReactNode }) {
  const value = process.env.WALLET_ID || "";
  console.log({ value });

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

export const useMyContext = (): MyContextValue => {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};
