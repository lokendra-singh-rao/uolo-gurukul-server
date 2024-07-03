import { userModel } from "../models/userModel.js";

export const listUsers = async ({ page, query, itemsPerPage }) => {
  const users = await userModel
    .find({
      active: true,
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    })
    .skip(itemsPerPage * (page - 1))
    .limit(itemsPerPage);
  return users;
};

export const getTotalUsers = async () => {
  const totalUsers = await userModel.find({ active: true }).count();
  return totalUsers;
};

export const addUser = async (name, email, password, image) => {
  try {
    console.log("sd1");
    let active = true;
    const response = await userModel.create({
      name,
      email,
      password,
      image,
      active,
    });
    console.log("sd");
    return response;
  } catch (error) {
    console.log(error);
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