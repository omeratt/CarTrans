"use client";
// import { useRouter } from "next/navigation";
import { postRequest } from "../../pages/api/hello";
import React, { useEffect, useId, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import useSWRMutation from "swr/mutation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { selectUser, selectUserToken } from "../../../store/slices/userSlice";
import { carBrands } from "../../constants";
import { Toast } from "flowbite-react";
import { v4 } from "uuid";
import { Web3Button } from "@thirdweb-dev/react";
import {
  useAddress,
  useContract,
  useContractRead,
  useContractWrite,
  useMetamask,
} from "@thirdweb-dev/react";
import toast, { Toaster } from "react-hot-toast";
import { ethers } from "ethers";
interface FormErrors {
  email?: string;
  thirdParty?: string;
  price?: string;
  carBrand?: string;
  server?: string;
}
const WALLET_ID = process.env.NEXT_PUBLIC_WALLET_ID;
export default function CreateContract() {
  const { contract } = useContract(WALLET_ID);

  const address = useAddress();

  const {
    mutateAsync: createSmartContract,
    isLoading: createSmartContractLoading,
    error: createSmartContractErr,
  } = useContractWrite(contract, "createSale");

  const token = useAppSelector(selectUserToken);
  const [email, setEmail] = useState("");
  const [thirdPartyAddress, setThirdPartyAddress] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [errors, setErrors] = useState<FormErrors>({});
  const carBrand = useRef<string>(carBrands[0]);

  const {
    trigger: createContract,
    data,
    error,
    isMutating,
  } = useSWRMutation("/api/contract/create", postRequest);
  const validate = () => {
    const newErrors: FormErrors = {};
    const isValidBuyerAddress = ethers.utils.isAddress(email);
    const isValidThirdPartyAddress = ethers.utils.isAddress(thirdPartyAddress);
    if (!email || !isValidBuyerAddress) {
      newErrors.email = isValidBuyerAddress
        ? "Buyer wallet address is required"
        : "Buyer wallet address is not valid";
    }
    if (!thirdPartyAddress || !isValidThirdPartyAddress) {
      newErrors.thirdParty = isValidThirdPartyAddress
        ? "Third party wallet address is required"
        : "Third party wallet address is not valid";
    }

    if (!price || price <= 0) {
      newErrors.price = "Price is required";
    }
    if (!carBrand.current) {
      newErrors.carBrand = "Car Brand is required";
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  function convertToUint(value: number) {
    const factor = 10 ** 18; // Adjust the factor based on the desired precision (e.g., 10^18 for 18 decimal places)
    const uintValue = value * factor;

    return uintValue.toString();
  }

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(+event.target.value);
    validate();
  };

  const handleSubmit = async () => {
    const toastId = toast.loading("Creating smart contract...");
    try {
      // Toaster({toastOptions:{}})
      const contractId = v4();
      console.log(contractId);
      const fixedPrice = convertToUint(price);
      await createSmartContract({
        args: [
          email,
          thirdPartyAddress,
          fixedPrice,
          contractId,
          carBrand.current,
        ],
      });
      setPrice(0);
      setThirdPartyAddress("");
      setEmail("");
      setStartDate(undefined);
      toast.dismiss();
      toast.success("Smart contract created successfully!", { id: toastId });
    } catch (err: any) {
      const errMsg = err?.code === "INVALID_ARGUMENT" ? "Invalid address" : "";
      toast.error("error: " + errMsg || err || error, { id: toastId });
    }
  };

  interface props {
    q: any;
  }
  function CarBrandsSearch({ q }: props) {
    const [query, setQuery] = useState<string>("");
    const [options, setOptions] = useState<string[]>(carBrands);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isOptionClicked, setIsOptionClicked] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const optionRefs = useRef<Array<HTMLLIElement | null>>([]);

    useEffect(() => {
      optionRefs.current = optionRefs.current.slice(0, options.length);
    }, [options]);

    function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
      const value = event.target.value;
      setQuery(value);
      q.current = value;

      // Filter the options based on the input value
      const filteredOptions = carBrands.filter((brand: string) =>
        brand.toLowerCase().includes(value.toLowerCase())
      );
      setOptions(filteredOptions);
      inputRef.current?.focus();
    }

    function handleInputFocus() {
      setIsFocused(true);
    }

    function handleInputBlur() {
      q.current = query;
      if (!isOptionClicked) {
        setIsFocused(false);
      }
      setIsOptionClicked(false);
    }

    function handleOptionClick(brand: string) {
      setQuery(brand);
      q.current = brand;
      setOptions([]);
    }

    return (
      <div className="relative">
        <input
          ref={inputRef}
          className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm text-gray-500"
          type="text"
          required
          placeholder="Search for a car brand"
          value={q.current}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
        />
        {isFocused && options.length > 0 && (
          <ul
            className="absolute z-30 left-0 right-0 mt-2 py-2 bg-white rounded-md shadow-lg max-h-32 overflow-y-scroll"
            onMouseDown={() => setIsOptionClicked(true)}
            onMouseUp={() => setIsOptionClicked(false)}
          >
            {options.map((option, index) => {
              return (
                <li
                  ref={(ref) => {
                    optionRefs.current[index] = ref;
                  }}
                  key={option}
                  className="px-4 py-2 z-30 hover:bg-gray-100 text-gray-500 bg-yellow-100 "
                  onClick={(event) => {
                    setIsOptionClicked(true);
                    handleOptionClick(option);
                    inputRef.current?.focus();
                  }}
                >
                  {option}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="flex w-screen  overflow-x-hidden z-10 place-content-center ">
      <div className="w-[50rem] h-[100%] opacity-[0.93]  px-10 flex-col pt-11 z-0">
        <div className="mt-10 sm:mt-0">
          <div className="">
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form>
                <div className="backdrop-blur bg-gray-300/60 animate__animated animate__fadeInDown overflow-hidden  shadow-2xl sm:rounded-md">
                  <div className="px-4 py-5">
                    <div className="px-4 sm:px-0 ">
                      <h3 className="text-3xl mt-2 font-medium leading-6 text-gray-900">
                        Contract Information
                      </h3>
                      <p className="mt-2 mb-2 text-lg font-medium text-gray-600">
                        Use a permanent address where you can receive mail.
                      </p>
                    </div>
                    <Toast className="my-toast hidden bg-green-200 mb-2 min-w-fit">
                      <div className="flex items-center justify-center rounded-2xl bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
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
                        Your Contract is Successfully created!
                      </div>
                      <Toast.Toggle className="hover:bg-green-100 ml-2 bg-green-200" />
                    </Toast>
                  </div>
                  <div className=" px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-5 gap-6">
                      <div className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor="email-address"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Seller&apos;s wallet address
                        </label>
                        <input
                          type="text"
                          // value={sellerEmail}
                          placeholder={
                            `${address?.substring(0, 5)}...${address?.substring(
                              address.length,
                              address.length - 5
                            )}` || "address"
                          }
                          disabled={true}
                          // onChange={(event) => {
                          //   setSellerEmail(event.target.value), validate();
                          // }}
                          name="email-address"
                          id="email-address"
                          className="mt-1 bg-gray-50 text-gray-500 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor="email-address"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Buyer&apos;s wallet address
                        </label>
                        <input
                          type="text"
                          value={email}
                          placeholder="address"
                          required
                          onChange={(event) => {
                            setEmail(event.target.value), validate();
                          }}
                          name="email-address"
                          id="email-address"
                          onBlur={(event) => {
                            setEmail(event.target.value), validate();
                          }}
                          autoComplete="email"
                          className="mt-1 block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs italic mt-2 ">
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor="email-address"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Third party&apos;s wallet address
                        </label>
                        <input
                          type="text"
                          value={thirdPartyAddress}
                          placeholder="address"
                          onBlur={(event) => {
                            setThirdPartyAddress(event.target.value),
                              validate();
                          }}
                          required
                          onChange={(event) => {
                            setThirdPartyAddress(event.target.value),
                              validate();
                          }}
                          name="third-party-address"
                          id="third-party-address"
                          className="mt-1 block w-full text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        {errors.thirdParty && (
                          <p className="text-red-500 text-xs italic mt-2 ">
                            {errors.thirdParty}
                          </p>
                        )}
                      </div>
                      <div className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor="price"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Car price
                        </label>
                        <div className="flex flex-row  items-center">
                          <input
                            type="number"
                            step={0.00001}
                            value={price}
                            placeholder="0"
                            required
                            onBlur={handlePriceChange}
                            onChange={handlePriceChange}
                            name="price"
                            id="price"
                            className="mt-1 block w-1/4 text-gray-500 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mr-4"
                          />
                          <div className="">MATIC</div>
                        </div>
                        {errors.price && (
                          <p className="text-red-500 text-xs italic mt-2 ">
                            {errors.price}
                          </p>
                        )}
                      </div>

                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Car Brand
                        </label>

                        <CarBrandsSearch q={carBrand} />
                        {errors.carBrand && (
                          <p className="text-red-500 text-xs italic mt-2 ">
                            {errors.carBrand}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="backdrop-blur bg-gray-300/60 px-4 py-3 text-right sm:px-6">
                    <Web3Button
                      contractAddress={WALLET_ID as string}
                      type="button"
                      action={async (contract) => {
                        await handleSubmit();
                      }}
                    >
                      Create contract
                    </Web3Button>
                    {errors.server && (
                      <p className="text-red-500 text-xs italic mt-2">
                        {errors.server}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
