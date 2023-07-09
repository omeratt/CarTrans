"use client";
import "../styles/globals.css";
import { UserType } from "../Models/User";
import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import {
  selectContracts,
  selectUser,
  selectUserToken,
} from "../../store/slices/userSlice";
import { useAppSelector } from "../../store/store";
import moment from "moment";
import Link from "next/link";
import { Tabs } from "flowbite-react";
import ContractList from "./Components/ContractList";
import {
  ConnectWallet,
  useAddress,
  useContract,
  useContractRead,
} from "@thirdweb-dev/react";
import nextConfig from "../../next.config";
// import ".env.local"
// const WALLET_ID = process.env["WALLET_ID"];
const WALLET_ID = process.env.NEXT_PUBLIC_WALLET_ID;
// const dada = nextConfig.env?.API_KEY;
// const dada = nextConfig.env?.API_KEY;
interface props {
  users: UserType;
}
interface FormErrors {
  email?: string;
  password?: string;
}
function Home() {
  const token = useAppSelector(selectUserToken);
  // const user = useAppSelector(selectUser);
  const contracts = useAppSelector(selectContracts);
  console.log({ gaga: contracts?.waiting });
  const address = useAddress();
  if (!token) redirect("/login");

  return (
    <div className="w-full  flex justify-center">
      <div className="h-[32rem] w-[93vw]  max-w-6xl mx-2    py-10  ">
        <div className="">
          <div className="backdrop-blur max-h-[85vh] bg-gray-300/60 rounded-lg">
            <Tabs.Group
              className="self-center link:text-black"
              aria-label="Tabs with underline"
              style="underline"
            >
              <Tabs.Item title="Sending Contracts">
                <div className=" max-w-7xl max-h-[74vh] overflow-x-auto overflow-y-auto animate__animated animate__fadeInLeft">
                  {/* <h1 className="  text-center my-5 text-3xl">My Contracts</h1> */}
                  {contracts?.sending && contracts?.sending.length > 0 ? (
                    <ContractList
                      contracts={contracts?.sending}
                      myId={address}
                    />
                  ) : !address ? (
                    <div className="flex flex-row items-center justify-center px-[auto]">
                      <ConnectWallet
                        theme="dark"
                        btnTitle="Connect Wallet"
                        className=" justify-center items-center self-center"
                      />
                    </div>
                  ) : (
                    <div className="flex-col align-center justify-center text-center">
                      <h1 className="">No contracts yet...</h1>
                      <Link
                        href="/create-contract"
                        className="text-center inline-flex justify-center my-2  rounded-md border border-transparent  hover:bg-blue-700 text-white font-bold py-2 px-4  focus:outline-none focus:shadow-outline flex-row bg-slate-600 items-center"
                      >
                        Create One Now!
                      </Link>
                    </div>
                  )}
                </div>
              </Tabs.Item>
              <Tabs.Item
                title="Receiving Contracts"
                className="link:text-black"
              >
                <div className=" max-w-7xl max-h-[74vh] overflow-x-auto overflow-y-auto animate__animated animate__fadeInRight">
                  {/* <h1 className="  text-center my-5 text-3xl">My Contracts</h1> */}
                  {contracts?.receive && contracts?.receive.length > 0 ? (
                    <ContractList
                      contracts={contracts?.receive}
                      myId={address}
                    />
                  ) : !address ? (
                    <div className="flex flex-row items-center justify-center px-[auto]">
                      <ConnectWallet
                        theme="dark"
                        btnTitle="Connect Wallet"
                        className=" justify-center items-center self-center"
                      />
                    </div>
                  ) : (
                    <h1>No contracts yet...</h1>
                  )}
                </div>
              </Tabs.Item>
              <Tabs.Item title="Third Party" className="link:text-black">
                <div className=" max-w-7xl max-h-[74vh] overflow-x-auto overflow-y-auto animate__animated animate__fadeInRight">
                  {/* <h1 className="  text-center my-5 text-3xl">My Contracts</h1> */}
                  {contracts?.waiting && contracts?.waiting.length > 0 ? (
                    <ContractList
                      contracts={contracts?.waiting}
                      myId={address}
                    />
                  ) : !address ? (
                    <div className="flex flex-row items-center justify-center px-[auto]">
                      <ConnectWallet
                        theme="dark"
                        btnTitle="Connect Wallet"
                        className=" justify-center items-center self-center"
                      />
                    </div>
                  ) : (
                    <h1>No contracts yet...</h1>
                  )}
                </div>
              </Tabs.Item>
            </Tabs.Group>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;

// function LoginForm() {

// }
