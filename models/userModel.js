import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name cannot be empty!"],
    },
    email: {
      type: String,
      required: [true, "Email cannot be empty!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password cannot be empty!"],
    },
    image: {
      type: String,
      required: [true, "Image key cannot be empty!"],
    },
    active: {
      type: Boolean,
      required: [true, "Active status cannot be empty!"],
    },
  },
  {
    timestamps: true,
  }
);

export const userModel = mongoose.model("Lokendrausers", userSchema);

export const changeStream = userModel.watch();
