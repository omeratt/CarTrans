import { JwtPayload, sign, verify, VerifyErrors } from "jsonwebtoken";
// import { UserType } from "../../Models/User";
// import { NextApiRequest, NextApiResponse } from "next";
// import { NextRequest, NextResponse } from "next/server";
// import { getUserByEmail, getUserById } from "./users";
interface JwtProps {
  email: string;
  userId: string;
  fbId?: string;
  gId?: string;
  phone?: string;
}

export const generateAccessToken = (user: JwtProps) => {
  const accessToken = sign(user, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "1h",
  });
  return accessToken;
};
export const generateRefreshToken = (user: JwtProps) => {
  const refreshToken = sign(user, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "30d",
  });
  return refreshToken;
};
