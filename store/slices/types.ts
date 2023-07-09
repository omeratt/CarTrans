import { ethers } from "ethers";

// Define a type for the slice state
export interface UserState {
  _id?: string;
  name?: string;
  email?: string;
  password?: string;
  isSignIn?: boolean;
  img?: string;
  contracts?: UserContracts;
  token?: string;
  emailFromRegister?: string;
}
export interface UserContracts {
  receive: SmartContractType[];
  sending: SmartContractType[];
  waiting: SmartContractType[];
}
export interface ContractState {
  _id?: string;
  carBrand?: string;
  done?: boolean;
  confirm?: boolean;
  expires?: string;
  from?: UserState;
  to?: UserState;
  decline?: boolean;
}
export interface SmartContractType {
  contractId?: string;
  carBrand?: string;
  buyer?: string;
  canceled?: boolean;
  keysDelivered?: boolean;
  owner?: string;
  ownershipTransferred?: boolean;
  paymentDelivered?: boolean;
  sellingPrice?: any;
  thirdParty?: string;
  transferredValue?: any;
}
