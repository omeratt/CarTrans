"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { logout, selectUserToken } from "../../store/slices/userSlice";
import useSWRMutation from "swr/mutation";
import { redirect } from "next/navigation";
import { postRequest } from "../pages/api/hello";
import { Button, Navbar } from "flowbite-react";
import { animateCSS, toggleAnimate } from "./SideBar";
import Notifications from "./Components/Notifications";
import Image from "next/image";
import { ConnectWallet, useDisconnect } from "@thirdweb-dev/react";
function NavBar() {
  // const router = useRouter();
  const token = useAppSelector(selectUserToken);
  const disconnect = useDisconnect();
  const [isSignIn, setIsSignIn] = useState(true);
  const [animate, setAnimate] = useState(true);
  const dispatch = useAppDispatch();
  const {
    trigger: LogoutUser,
    data,
    error,
    isMutating,
  } = useSWRMutation("/api/auth/signout", postRequest);
  const logOut = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    try {
      const res = await LogoutUser();
      const jsonRes = await res?.json();
      console.log(jsonRes);

      if (jsonRes.success) {
        dispatch(logout());
        await disconnect();
        // redirect("/login");
      } else {
        alert(jsonRes.message);
      }
      //   console.log("data", data1.data);
      //   alert(JSON.stringify(data1.data));
    } catch (err) {
      console.log("err", err);
    }
  };

  // useEffect(() => {
  //   if (!isSignIn) {
  //     router.push("/login");
  //   }
  // }, [isSignIn]);
  // useEffect(() => {
  //   if (token) setIsSignIn(true);
  //   else setIsSignIn(false);
  // }, [token]);
  const openSideBar = () => {
    // dispatch(toggleSideBar());
  };
  const Nav = () => {
    return (
      <Navbar
        className="  bg-slate-700 justify-center items-center py-[auto] "
        fluid={true}
      >
        <Navbar.Brand
          // className="mr-3 h-9 sm:h-9 w-20"
          href="/"
        >
          <img
            src="/icon.png"
            className="mr-3 h-10 animate__animated animate__fadeInRight animate__slower"
            alt="CarTrans Logo"
          />
          {/* <span className="self-center text-white whitespace-nowrap text-xl font-semibold dark:text-slate-400">
            CarTrans
          </span> */}
        </Navbar.Brand>
        <div className="flex md:order-2  ">
          {/* {token && (
            <div className="flex md:w-[12vw] lg:w-[15vw] xl:w-[20vw] 2xl:w-[20vw] items-center justify-start">
              <Notifications />
            </div>
          )} */}
          <Navbar.Toggle className="ml-3" />
        </div>
        <Navbar.Collapse>
          {/* <Navbar.Link> */}
          <Link
            href="/"
            className="text-white whitespace-nowrap font-normal text-lg hover:text-gray-400  self-center mr-0"
          >
            Home
          </Link>
          {/* </Navbar.Link> */}
          {!token ? (
            <>
              {/* <Navbar.Link className="hover:bg-slate-600"> */}
              <Link
                href="/register"
                className="text-white whitespace-nowrap font-normal text-lg hover:text-gray-400"
              >
                Register
              </Link>
              {/* </Navbar.Link> */}
              {/* <Navbar.Link className="hover:bg-slate-600"> */}
              <Link
                href="/login"
                className="text-white whitespace-nowrap font-normal text-lg hover:text-gray-400"
              >
                Login
              </Link>

              {/* </Navbar.Link> */}
            </>
          ) : (
            <div className="flex flex-row justify-around items-center ">
              {/* <Navbar.Link className="hover:bg-slate-600"> */}
              <Link
                href="/create-contract"
                className="text-white whitespace-nowrap font-normal text-lg hover:text-gray-400 mr-5"
              >
                Create Contract
              </Link>

              <div
                // onClick={openSideBar}
                onClick={() => {
                  toggleAnimate(
                    "aside",
                    "animate__fadeInLeft",
                    "animate__fadeOutLeft"
                  );
                }}
                className=" text-white whitespace-nowrap font-normal text-lg cursor-pointer hover:text-gray-400 mr-5"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r to-orange-400 from-sky-400 hover:to-sky-200 hover:from-orange-400">
                  My Contracts
                </span>
              </div>
              {/* </Navbar.Link> */}
              {/* <Navbar.Link className="hover:bg-slate-600"> */}
              <div
                onClick={logOut}
                className=" text-white whitespace-nowrap font-normal text-lg cursor-pointer hover:text-gray-400 mr-5"
              >
                logout
              </div>

              <ConnectWallet theme="dark" btnTitle="Connect Wallet" />
              {/* <Navbar.Link> */}

              {/* </Navbar.Link> */}
              {/* </Navbar.Link> */}
            </div>
          )}
        </Navbar.Collapse>
      </Navbar>
    );
  };

  return <Nav />;
}

export default NavBar;
