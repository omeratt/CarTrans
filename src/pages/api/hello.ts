// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};
export async function postRequest(url: string, { arg }: { arg: any }) {
  return fetch(url, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    ...(arg && { body: JSON.stringify(arg) }),
  });
}
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json({ name: "John Doe" });
}
