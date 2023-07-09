import mongoose, { Schema, model, Document } from "mongoose";
import { ContractType } from "./Contract";
export interface UserType extends Document {
  _id?: string;
  name?: string;
  email?: string;
  password?: string;
  walletAddress?: string;
  img?: string;
  contracts?: ContractType[];
}
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    img: {
      type: String,
    },
    isApproval: {
      type: Boolean,
      required: false,
      default: false,
    },
    contracts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Contract",
        required: false,
        default: [],
      },
    ],
  },
  { timestamps: true }
);
// export default model<UserType>("User", UserSchema);
export default mongoose.models.User<UserType> ||
  mongoose.model<UserType>("User", UserSchema);
// export default mongoose.models.User || mongoose.model("User", UserSchema);
