import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";

import cookie from "cookie";
export function clearCookies(req: NextApiRequest, res: NextApiResponse) {
  const { accessToken, refreshToken } = req.cookies;
  if (!accessToken || !refreshToken) return;
  res.setHeader("Set-Cookie", [
    cookie.serialize("accessToken", accessToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV !== "development",
      // maxAge: 60 * 60,
      expires: new Date(0),
      sameSite: "strict",
      path: "/",
    }),
    cookie.serialize("refreshToken", refreshToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV !== "development",
      // maxAge: 60 * 60,
      expires: new Date(0),
      sameSite: "strict",
      path: "/",
    }),
  ]);
  return res;
}
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await dbConnect();
  if (req.method === "POST") {
    try {
      clearCookies(req, res);
      res.statusCode = 200;
      return res.json({ success: true, message: "logout successfully" });
    } catch (error: any) {
      return res.status(400).json({
        // success: false,
        message: error.message,
      });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(425).end(`Method ${req.method} is not allowed.`);
};

export default handler;
