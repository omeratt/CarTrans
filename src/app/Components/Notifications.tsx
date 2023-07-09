"use client";
import { animateCSS, fetcher, toggleAnimate } from "../SideBar";
import moment from "moment";
import { postRequest } from "../../pages/api/hello";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import LoadingSpinner from "./LoadingSpinner";
function Notifications() {
  //getMyPending
  const { data, error, isLoading } = useSWR(
    "/api/contract/getMyPending",
    fetcher,
    {
      // refreshInterval: 10000,
    }
  );
  const {
    trigger: AcceptContract,
    data: acceptContractData,
    error: acceptContractError,
    isMutating: isMutatingAccpet,
  } = useSWRMutation("/api/contract/accept", postRequest);
  const {
    trigger: DeclineContract,
    data: declineContractData,
    error: declineContractError,
    isMutating: isMutatingDecline,
  } = useSWRMutation("/api/contract/decline", postRequest);
  const [contracts, setContracts] = useState([]);
  const declineContract = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    contId: string
  ) => {
    event.stopPropagation();
    event.preventDefault();
    try {
      const res = await DeclineContract({
        id: contId,
      });
      const jsonRes = await res?.json();
      console.log(jsonRes);
      if (jsonRes.success) {
        console.log(jsonRes.data);
        setContracts(jsonRes.data.contracts);
      } else {
        console.log(jsonRes.message);
      }
    } catch (err) {
      console.log("err", err);
    }
  };
  const acceptContract = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    contId: string
  ) => {
    event.stopPropagation();
    event.preventDefault();
    try {
      const res = await AcceptContract({
        id: contId,
      });
      const jsonRes = await res?.json();
      console.log(jsonRes);
      if (jsonRes.success) {
        console.log(jsonRes.data);
        setContracts(jsonRes.data.contracts);
      } else {
        console.log(jsonRes.message);
      }
    } catch (err) {
      console.log("err", err);
    }
  };
  const toggleButton = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault();
    document.querySelector(".my-notification")?.classList?.toggle("hidden");
    toggleAnimate(".my-notification", "animate__zoomIn", "animate__zoomOut");
  };
  useEffect(() => {
    if (data) setContracts(data.data);
    if (error) console.log("asd", error);
  }, [data, error]);
  useEffect(() => {
    animateCSS(".my-notification", "zoomOut");
  }, []);
  interface notificationProps {
    carBrand: string;
    from: string;
    created: Date;
    contId: string;
  }

  function NotificationElement(props: notificationProps) {
    return (
      <div
        className="divide-y divide-gray-100 "
        onClick={(e) => console.log("clicked")}
      >
        <a href="#" className="flex px-4 py-3  hover:bg-gray-500">
          <div className="w-full pl-3 ">
            <div className=" text-sm mb-1.5 text-gray-400">
              <span className="font-semibold  text-white">{props.from}</span>
              <br />
              Sent You A Contract Requested On A Car:
              <span className="font-semibold  text-white">
                {" " + props.carBrand}
              </span>
            </div>
            <span className=" text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded bg-gray-700 text-blue-400 border border-blue-400">
              <svg
                aria-hidden="true"
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                ></path>
              </svg>
              {moment(props.created).startOf("hour").fromNow()}
            </span>
            <div
              className="inline-flex ml-7 phone:ml-[0.5rem] max-h-8 self-end rounded-md shadow-sm"
              role="group"
            >
              <button
                onClick={(e) => {
                  acceptContract(e, props.contId);
                }}
                type="button"
                className="inline-flex items-center px-4 py-2 text-xsm font-normal  border  rounded-l-lg focus:z-10 focus:ring-2
                bg-gradient-to-br from-teal-300 to-lime-300
                bg-gray-700 border-gray-600 text-gray-700 hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white"
              >
                {/* className="w-4 h-4 mr-2 fill-current" */}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Accept
              </button>
              <button
                onClick={(e) => {
                  declineContract(e, props.contId);
                }}
                type="button"
                className="inline-flex items-center px-4 py-2 text-sm font-medium
                bg-gradient-to-br from-pink-500 to-orange-400
                 border  rounded-r-md  focus:z-10 focus:ring-2  bg-gray-700 border-gray-600 text-gray-600 hover:text-white hover:bg-gray-600 focus:ring-blue-500 focus:text-white"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Decline
              </button>
            </div>
          </div>
        </a>
      </div>
    );
  }
  return (
    <>
      <button
        onClick={toggleButton}
        // id="dropdownNotificationButton"
        data-dropdown-toggle="dropdownNotification"
        className="inline-flex items-center text-sm font-medium text-center text-gray-500 hover:text-gray-900 focus:outline-none dark:hover:text-white dark:text-gray-400"
        type="button"
      >
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
        </svg>
        {contracts?.length > 0 && (
          <div className=" flex">
            <div className=" inline-flex w-6 h-6 bg-red-500 border-2 border-white rounded-full -top-2 right-3 dark:border-gray-900 justify-center align-middle text-white  pt-[0.05rem] text-sm scale-[0.85]">
              {contracts.length}
            </div>
          </div>
        )}
      </button>
      {/* <!-- Dropdown menu --> */}
      <div
        // id="dropdownNotification"
        className="z-20 hidden opacity-[0.95] border-t-white border-t-[1px] right-1   absolute top-[3.6rem]  w-fit max-w-md divide-y divide-gray-100 rounded shadow bg-slate-700  my-notification phone:top-[3.8rem] phone:ml-1"
        aria-labelledby="dropdownNotificationButton"
      >
        <div className="block px-4 py-2 font-medium text-center rounded  bg-slate-700 text-white">
          Notifications
        </div>
        {isLoading && (
          <div className="flex justify-center content-center">
            <LoadingSpinner />
          </div>
        )}
        {contracts?.map &&
          contracts?.map((cont: any) => (
            <NotificationElement
              carBrand={cont.carBrand}
              from={cont.from.name}
              created={cont.createdAt}
              contId={cont._id}
              key={cont._id}
            />
          ))}
      </div>
    </>
  );
}

export default Notifications;
