"use client";
import { UserType } from "../../Models/User";
import React, { useEffect, useState } from "react";

// import { Inter } from "@next/font/google";
// import dbConnect from "@/lib/dbConnect";
// import { getUsers } from "@/lib/services/users";
// import { redirect } from "next/navigation";
import {
  login,
  selectEmailFromRegister,
  selectUser,
  selectUserToken,
} from "../../../store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import useSWRMutation from "swr/mutation";
import { json } from "node:stream/consumers";
import { postRequest } from "../../pages/api/hello";
import { redirect } from "next/navigation";
import Image from "next/image";
interface props {
  users: UserType;
}
interface FormErrors {
  email?: string;
  password?: string;
  server?: string;
}
function Login() {
  const token = useAppSelector(selectUserToken);
  console.log({ token });
  if (token) redirect("/");

  const dispatch = useAppDispatch();
  const emailFromRegister = useAppSelector(selectEmailFromRegister);
  const [email, setEmail] = useState(
    emailFromRegister ? emailFromRegister : ""
  );
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const {
    trigger: LoginUser,
    data,
    error,
    isMutating,
  } = useSWRMutation("/api/auth/signin", postRequest);
  //   console.log("asdasdasd", token);
  // if (!token) redirect("/login");
  const validate = () => {
    const newErrors: FormErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const res = await LoginUser({ email, password });
      const jsonRes = await res?.json();
      console.log(jsonRes);

      if (jsonRes.success) {
        console.log(jsonRes.data);
        dispatch(login({ ...jsonRes.data.user }));
      } else {
        console.log(jsonRes.message);
        setErrors({ server: jsonRes.message });
      }
      //   console.log("data", data1.data);
      //   alert(JSON.stringify(data1.data));
    } catch (err) {
      console.log("err", err);
      console.log("error", error);
    }
    // perform authentication here
  };
  // useEffect(() => {}, [email, password]);
  // useEffect(() => {
  //   if (token) {
  //     router.push("/");
  //   }
  // }, [token]);

  return (
    <div className="h-[32rem] opacity-[0.93]  grid place-content-center  ">
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur bg-gray-300/60 animate__animated animate__fadeIn w-[25rem] shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 flex flex-col my-2 relative"
      >
        <h1 className="animate__animated animate__fadeInDown  mb-5 text-2xl">
          Welcome to
          <span className="p-2  grid-cols-2 text-transparent bg-clip-text bg-gradient-to-r to-orange-400 from-sky-400 hover:to-sky-200 hover:from-orange-400">
            TransCar
            <img
              src="/icon.png"
              className="mr-3 w-24 h-16 self-center animate__animated animate__fadeInRight animate__slower absolute right-0"
              alt="CarTrans Logo"
            />
          </span>
        </h1>
        {emailFromRegister ? (
          <div className="text-lime-500 animate__animated animate__fadeInDown  mb-5 text-xl">
            Register Successfully
          </div>
        ) : null}
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            id="email"
            value={email}
            placeholder="Email here"
            required
            onChange={(event) => {
              setEmail(event.target.value), validate();
            }}
          />
          {errors.email && (
            <p className="text-red-500 text-xs italic mt-2">{errors.email}</p>
          )}
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="password"
            id="password"
            value={password}
            placeholder="*****"
            required
            onChange={(event) => {
              setPassword(event.target.value);
              validate();
            }}
          />
          {errors.password && (
            <p className="text-red-500 text-xs italic mt-2">
              {errors.password}
            </p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-slate-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex-row flex items-center  justify-evenly"
            type="submit"
          >
            Login
            {isMutating && (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className=" ml-4 w-5  text-gray-200 animate-spin dark:text-gray-600 fill-white"
                  viewBox="0 0 100 100"
                  //   width={1000}
                  height={25}
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </button>
          {errors.server && (
            <p className="text-red-500 text-xs italic mt-2">{errors.server}</p>
          )}
        </div>
      </form>
    </div>
  );
}

export default Login;

// function LoginForm() {

// }
