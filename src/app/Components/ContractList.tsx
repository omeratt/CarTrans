import { Toast } from "flowbite-react";
import moment from "moment";
import { set } from "mongoose";
import Link from "next/link";
import { postRequest } from "../../pages/api/hello";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { selectMessage } from "../../../store/slices/showSlice";
import { setReceivingContract } from "../../../store/slices/userSlice";
import { ContractState, SmartContractType } from "../../../store/slices/types";
import useSWRMutation from "swr/mutation";
import { formatBigInt } from "../SideBar";
import { useContract, useContractWrite } from "@thirdweb-dev/react";
import { toast } from "react-hot-toast";
import { ethers } from "ethers";
type props = {
  contracts: SmartContractType[];
  myId?: string;
};
const WALLET_ID = process.env.NEXT_PUBLIC_WALLET_ID;

function ContractList({ contracts, myId }: props) {
  const dispatch = useDispatch();
  const appMessage = useAppSelector(selectMessage);
  const [message, setMessage] = useState("");

  const { contract } = useContract(WALLET_ID);
  const { mutateAsync: cancelDeal } = useContractWrite(contract, "cancelDeal");
  const { mutateAsync: acceptDeal } = useContractWrite(
    contract,
    "confirmPayment"
  );
  const { mutateAsync: acceptKey } = useContractWrite(
    contract,
    "confirmKeysDelivery"
  );
  const { mutateAsync: confirmOwnershipTransfer } = useContractWrite(
    contract,
    "confirmOwnershipTransfer"
  );

  useEffect(() => {
    if (appMessage) setMessage(appMessage);
  }, [appMessage]);

  const handleDecline = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    contId: string
  ) => {
    event.preventDefault();
    const toastId = toast.loading("cancel contract number : " + contId);
    try {
      const data = await cancelDeal({ args: [contId] });
      toast.success("Contract canceled successfully!", { id: toastId });
    } catch (err) {
      console.log("err", err);
      toast.error("Contract error!", { id: toastId });
    }
  };
  const handleConfirmOwnershipTransfer = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    contId: string
  ) => {
    event.preventDefault();
    const toastId = toast.loading("Confirm contract...");
    try {
      const data = await confirmOwnershipTransfer({
        args: [contId],
      });
      toast.success("Contract confirm successfully!", { id: toastId });
    } catch (err) {
      console.log("err", err);
      toast.error("Contract confirmation error!" + err, { id: toastId });
    }
  };
  const handleAcceptKey = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    contId: string
  ) => {
    event.preventDefault();
    const toastId = toast.loading("Accepting key...");
    try {
      const data = await acceptKey({
        args: [contId],
      });
      toast.success("Key accepted successfully!", { id: toastId });
    } catch (err) {
      console.log("err", err);
      toast.error("Contract error!" + err, { id: toastId });
    }
  };
  const handleAccept = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    cont: SmartContractType
  ) => {
    event.preventDefault();
    const toastId = toast.loading(
      "Accepting contract number : " + cont.contractId
    );
    const price = formatBigInt(cont);
    try {
      if (!price) throw "try again later..." + price;
      const data = await acceptDeal({
        args: [cont.contractId],
        overrides: { value: ethers.utils.parseEther(price) },
      });
      toast.success("Contract accepted successfully!", { id: toastId });
    } catch (err) {
      console.log("err", err);
      toast.error("Contract error!" + err, { id: toastId });
    }
  };
  return (
    <>
      {message && (
        <Toast className="my-toast mx-auto bg-green-200 mb-2 min-w-fit">
          <div className="flex items-center justify-center rounded-2xl bg-green-100 text-green-500 ">
            <svg
              className=" w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <div className="ml-3 text-sm font-normal text-green-500">
            {message}
          </div>
          <Toast.Toggle className="hover:bg-green-100 ml-2 bg-green-200" />
        </Toast>
      )}
      <table className=" max-w-7xl w-full  text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase tracking-widest backdrop-blur bg-gray-300/60 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              From
            </th>
            <th scope="col" className="px-6 py-3">
              To
            </th>
            <th scope="col" className="px-6 py-3">
              Brand
            </th>
            <th scope="col" className="px-6 py-3">
              Price
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {contracts?.map((cont) => {
            const statusColor = cont.ownershipTransferred
              ? "bg-green-400"
              : cont.canceled
              ? "bg-red-400"
              : !cont.paymentDelivered || !cont.keysDelivered
              ? "bg-amber-400 animate-ping"
              : "bg-yellow-400 animate-ping";

            const status = cont.ownershipTransferred
              ? "Deal Approve"
              : cont.canceled
              ? "Declined"
              : !cont.paymentDelivered
              ? "Pending Payment"
              : !cont.keysDelivered
              ? "Pending Key Delivery"
              : "Pending Third Party";

            const accept = myId === cont.buyer && status === "Pending Payment";
            const showDecline =
              !cont.ownershipTransferred &&
              (!cont.keysDelivered || !cont.paymentDelivered);
            return (
              <tr
                key={cont.contractId}
                className="bg-white-300/50 backdrop-blur border-b hover:bg-gray-50/50 hover:backdrop-blur"
              >
                <th
                  scope="row"
                  className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <div className="pl-3">
                    <div className="text-base font-semibold">
                      {`${cont.owner?.substring(
                        0,
                        5
                      )}...${cont.owner?.substring(
                        cont.owner.length,
                        cont.owner.length - 5
                      )}`}
                    </div>
                    {/* <div className="font-normal text-gray-500">
                      {cont.from?.email}
                    </div> */}
                  </div>
                </th>
                <td className="px-6 py-4">
                  <div className="pl-3">
                    <div className="text-base text-gray-900 font-semibold">
                      {`${cont.buyer?.substring(
                        0,
                        5
                      )}...${cont.buyer?.substring(
                        cont.buyer.length,
                        cont.buyer.length - 5
                      )}`}
                    </div>
                    {/* <div className="font-normal text-gray-500">
                      {cont.to?.email}
                    </div> */}
                  </div>
                </td>

                <td className="px-6 py-4">{cont.carBrand}</td>
                <td className="px-6 py-4">{formatBigInt(cont)} MATIC</td>
                {/* <td className="px-6 py-4">{cont.sellingPrice}</td> */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div
                      className={`${statusColor} h-2.5 w-2.5 rounded-full mr-2 `}
                    ></div>
                    <div className={` uppercase tracking-wide`}>{status}</div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  {accept ? (
                    <div className=" flex place-content-center w-32 grid-cols-2 divide-x-[2px]">
                      <div
                        onClick={(e) => {
                          handleAccept(e, cont);
                        }}
                        className="cursor-pointer font-medium pr-2 text-green-500 hover:underline"
                      >
                        Accept
                      </div>

                      {showDecline && (
                        <div
                          onClick={(e) => {
                            handleDecline(e, cont.contractId as string);
                          }}
                          className="cursor-pointer font-medium pl-2 text-red-500 hover:underline"
                        >
                          Decline
                        </div>
                      )}
                    </div>
                  ) : status === "Deal Approve" || status === "Declined" ? (
                    <div></div>
                  ) : (
                    showDecline && (
                      <div className=" flex place-content-center w-32 grid-cols-2 divide-x-[2px]">
                        {status === "Pending Key Delivery" &&
                          cont.buyer === myId && (
                            <div
                              onClick={(e) => {
                                handleAcceptKey(e, cont.contractId as string);
                              }}
                              className="cursor-pointer font-medium pr-2 text-green-500 hover:underline"
                            >
                              Accept key
                            </div>
                          )}
                        <div
                          onClick={(e) => {
                            handleDecline(e, cont.contractId as string);
                          }}
                          className="cursor-pointer font-medium pl-2 text-red-500 hover:underline"
                        >
                          Decline
                        </div>
                      </div>
                    )
                  )}

                  {status === "Pending Third Party" &&
                    cont.thirdParty === myId && (
                      <div className=" flex place-content-center w-32 grid-cols-2 divide-x-[2px]">
                        <div
                          onClick={(e) => {
                            handleConfirmOwnershipTransfer(
                              e,
                              cont.contractId as string
                            );
                          }}
                          className="cursor-pointer font-medium pl-2 text-green-500 hover:underline"
                        >
                          confirm
                        </div>
                      </div>
                    )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default ContractList;
