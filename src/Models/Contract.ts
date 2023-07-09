import mongoose, { Schema, Document } from "mongoose";
import { UserType } from "./User";
export interface ContractType extends Document {
  _id?: string;
  carBrand?: string;
  done?: boolean;
  confirm?: boolean;
  expires?: Date;
  from?: UserType;
  to?: UserType;
  contractId?: string;
  decline?: boolean;
  price?: number;
}
const ContractSchema = new Schema(
  {
    carBrand: {
      type: String,
      required: true,
    },
    contractId: {
      type: String,
      required: true,
    },
    done: {
      type: Boolean,
      default: false,
    },
    confirm: {
      type: Boolean,
      default: false,
    },
    decline: {
      type: Boolean,
      default: false,
    },
    expires: {
      type: Date,
      default: null,
    },
    price: {
      type: Number,
      required: false,
    },
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Contract ||
  mongoose.model("Contract", ContractSchema);
