import Contract, { ContractType } from "../../Models/Contract";
import User from "../../Models/User";
import { ContractState } from "../../../store/slices/types";

export interface CreateContractProps {
  carBrand?: string;
  expires?: Date;
  to?: string;
}
export async function createContract(
  _id: string,
  contract: CreateContractProps
) {
  try {
    console.log("created\n\n\n\n askldlaksdjlkasdlkklkl");
    const { to: toUserEmail, ...restContract } = contract;
    if (!restContract.carBrand) throw new Error("Car Brand Is Required");
    if (!restContract.expires) throw new Error("Expiration Date Is Required");
    if (!toUserEmail) throw new Error("Buyer's Email Is Required");
    const toEmail = toUserEmail.toLowerCase();

    // const to = await User.findOne({ email: toEmail });
    // if (!to) throw new Error("User Not Found!");

    // const from = await User.findOne({ _id });
    // if (!from) throw new Error("user not Logged in!");
    const createdContract = await new Contract({
      ...restContract,
      // to,
      // from,
    });

    console.log("created\n\n\n\n", { createdContract });
    await createdContract.save();
    return createdContract;
  } catch (error: any) {
    throw new Error(error.message as string);
  }
}
export async function getContract(_id: string) {
  try {
    const mySendingContracts: ContractType[] = await Contract.find({
      from: _id,
    })
      .sort({ createdAt: -1 })
      .populate([
        {
          path: "to",
          select: "-password",
        },
        {
          path: "from",
          select: "-password",
        },
      ]);
    const myReceiveContracts: ContractType[] = await Contract.find({
      to: _id,
    })
      .sort({ createdAt: -1 })
      .populate([
        {
          path: "to",
          select: "-password",
        },
        {
          path: "from",
          select: "-password",
        },
      ]);

    return { mySendingContracts, myReceiveContracts };
  } catch (error: any) {
    throw new Error(error.message as string);
  }
}
export async function getPendingContract(_id: string) {
  try {
    const Contracts: ContractType[] = await Contract.find({
      to: _id,
      confirm: false,
      // decline: false,
    }).populate([
      {
        path: "to",
        select: "-password",
      },
      {
        path: "from",
        select: "-password",
      },
    ]);
    const myContracts = Contracts.filter((cont) => cont.decline == false);
    return myContracts;
  } catch (error: any) {
    throw new Error(error.message as string);
  }
}
export async function acceptContract(contractId: string) {
  try {
    const contract: ContractType | null = await Contract.findOneAndUpdate(
      { _id: contractId },
      { confirm: true }
    );
    if (!contract) throw new Error("contract not found");
    const userId = contract.to?._id;
    const contracts = await getPendingContract(userId as string);
    return { contracts };
  } catch (error: any) {
    throw new Error(error.message as string);
  }
}
export async function declineContract(contractId: string) {
  try {
    const contract: ContractType | null = await Contract.findOneAndUpdate(
      { _id: contractId },
      { decline: true }
    );
    if (!contract) throw new Error("contract not found");
    const userId = contract.to?._id;
    const contracts = await getPendingContract(userId as string);
    return { contracts };
  } catch (error: any) {
    throw new Error(error.message as string);
  }
}
export async function editContract(contractId: string, details: any) {
  try {
    const { to: toUserEmail, ...rest } = details;
    if (!rest.carBrand) throw new Error("Car Brand Is Required");
    if (!rest.expires) throw new Error("Expiration Date Is Required");
    if (!toUserEmail) throw new Error("Buyer's Email Is Required");
    const toEmail = toUserEmail.toLowerCase();

    const to = await User.findOne({ email: toEmail });
    if (!to) throw new Error("User Not Found!");
    // console.log(rest, to);
    let contract: ContractType | null = await Contract.findOneAndUpdate(
      { _id: contractId },
      { ...rest, to }
    );
    console.log(contract);
    // if (!contract) throw new Error("contract not found");
    // contract = { ...contract, ...rest, to: { email: to } };
    // contract && (await contract.save());
    const userId = contract?.from?._id;
    const contracts = await getContract(userId as string);
    return { contracts };
  } catch (error: any) {
    throw new Error(error.message as string);
  }
}
export async function deleteContract(contractId: string) {
  try {
    const contract: ContractType | null = await Contract.findOneAndDelete({
      _id: contractId,
    });
    if (!contract) throw new Error("contract not found");
    return { contract };
  } catch (error: any) {
    throw new Error(error.message as string);
  }
}
