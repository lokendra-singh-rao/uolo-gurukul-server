import { userModel } from "../models/userModel.js";

export const listUsers = async ({ page, itemsPerPage }) => {
  try {
    const users = await userModel
      .find({
        active: true,
      })
      .select("name email image")
      .skip(itemsPerPage * (page - 1))
      .limit(itemsPerPage);
    return users;
  } catch (error) {
    throw new Error(error);
  }
};

export const getTotalActiveUsers = async () => {
  try {
    const totalUsers = await userModel.find({ active: true }).count();
    return totalUsers;
  } catch (error) {
    throw new Error(error);
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
    return response;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteUser = async (id) => {
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
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

export const findUserByEmail = async (email) => {
  try {
    const user = await userModel.findOne({ email: email });
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

export const findActiveUserById = async (id) => {
  try {
    const user = await userModel.findOne({
      $and: [{ _id: id }, { active: true }],
    });
    return user;
  } catch (error) {
    throw new Error(error);
  }
};
