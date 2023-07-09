import { createUser, getUsers } from "@/lib/services/users";
import Error from "next/error";
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import { UserType } from "../../../Models/User";
// import cookieCutter from "cookie-cutter";
const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<UserType | { error?: string } | { success?: boolean }>
) => {
  await dbConnect();
  if (req.method === "POST") {
    try {
      const data = req.body;
      // const data = JSON.parse(req.body);
      const user = await createUser(data);
      return res.status(200).json({ success: true });
    } catch (error: any) {
      console.log(error.message);
      return res.status(400).json({ error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(425).end(`Method ${req.method} is not allowed.`);
};

export default handler;
