import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.status(401).json({ message: "Not Authorized.", status: 401 });
};

export default handler;
