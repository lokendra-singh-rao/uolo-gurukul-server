import { userModel } from "../models/userModel.js";
import { logger } from "../utils/logger.js";

export const listUsers = async ({ page, itemsPerPage }) => {
  try {
    const users = await userModel
      .find({
        active: true,
      })
      .select("name email image")
      .skip(itemsPerPage * (page - 1))
      .limit(itemsPerPage);
    return { ok: true, status: 200, data: users };
  } catch (err) {
    logger.error("Error in listUsers repo", err);
    return {
      ok: false,
      status: 500,
      err: "Something went wrong! Please try again",
    };
  }
};

export const getTotalActiveUsers = async () => {
  try {
    const totalUsers = await userModel.find({ active: true }).count();
    return { ok: true, status: 200, data: totalUsers };
  } catch (err) {
    logger.error("Error in getTotalActiveUsers repo", err);
    return {
      ok: false,
      status: 500,
      err: "Something went wrong! Please try again",
    };
  }
};

export const addUser = async (name, email, password, image) => {
  try {
    const response = await userModel.create({
      name,
      email,
      password,
      image,
      active: true,
    });
    return { ok: true, status: 200, data: response };
  } catch (err) {
    logger.error("Error in addUser repo", err);
    return {
      ok: false,
      status: 500,
      err: "Something went wrong! Please try again",
    };
  }
};

export const softDeleteUser = async (id) => {
  try {
    const filter = { _id: id };
    const updateDoc = {
      $set: {
        active: false,
      },
    };
    const options = {
      upsert: false,
    };

    const user = await userModel.updateOne(filter, updateDoc, options);
    return { ok: true, status: 200, data: user };
  } catch (err) {
    logger.error("Error in softDeleteUser repo", err);
    return {
      ok: false,
      status: 500,
      err: "Something went wrong! Please try again",
    };
  }
};

export const findUserByEmail = async (email) => {
  try {
    const user = await userModel.findOne({ email: email });
    return { ok: true, status: 200, data: user };
  } catch (err) {
    logger.error("Error in findUserByEmail repo", err);
    return {
      ok: false,
      status: 500,
      err: "Something went wrong! Please try again",
    };
  }
};

export const findActiveUserById = async (id) => {
  try {
    const user = await userModel.findOne({
      $and: [{ _id: id }, { active: true }],
    });
    return { ok: true, status: 200, data: user };
  } catch (err) {
    logger.error("Error in findActiveUserById repo", err);
    return {
      ok: false,
      status: 500,
      err: "Something went wrong! Please try again",
    };
  }
};
