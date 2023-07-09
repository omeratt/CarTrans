"use-client";
import { Montserrat } from "next/font/google";
// import Link from "next/link";
import "./globals.css";
import "animate.css";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import Image from "next/image";
import Providers from "./Provider";
const inter = Montserrat({ subsets: ["latin"], weight: "600" });
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const Bgc = () => (
    <Image
      id="myContainer"
      className="-z-20 animate-[blur_3s_ease-in-out_both] "
      objectFit="cover"
      style={{
        aspectRatio: 1 / 2,
        backgroundClip: "padding-box",
        backgroundColor: "#080710",
        objectPosition: "50% 75%",

        // backgroundColor: "#B55E4E",
        // backgroundBlendMode: "hard-light",
      }}
      // height={900}
      layout="fill"
      src="/background1.png"
      alt="background"
    />
  );

  return (
    <html className={inter.className}>
      <head />

      <body className="bg-gray-600 h-[100%] ">
        <Providers>
          <header className="">
            <Bgc />
            {/* <Alert color="info">Alert!</Alert> */}
            <NavBar />
          </header>
          <SideBar />
          {/* <div className="h-screen grid place-content-center">
            <div className="h-screen absolute -z-10">
            </div>
          </div> */}

          <div className="h-[92vh]  ">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
