import * as userRepository from "../repositories/userRepository.js";
import { v4 } from "uuid";
import { encryptPassword } from "../utilities/passwordUtils.js";
import { getSignedUrlS3, uploadFile } from "../middlewares/imageHandler.js";

export const listUsers = async ({ page, query }) => {
  try {
    const itemsPerPage = 10;

    const users = await userRepository.listUsers({ page, query, itemsPerPage });

    const totalActiveUsers = await userRepository.getTotalUsers();

    const totalPages =
      totalActiveUsers % itemsPerPage == 0
        ? totalActiveUsers / itemsPerPage
        : totalActiveUsers / itemsPerPage + 1;

    if (page > totalPages) {
      page = 1;
    }

    for (let user of users) {
      const signedImage = await getSignedUrlS3(user.image);
      if (signedImage.ok) {
        user.image = signedImage?.data;
      } else {
        user.image = "http://localhost:8080/images/defaultImage.webp";
      }
    }
    const data = {
      currentPage: page,
      totalPages: parseInt(totalPages),
      filteredUsers: users,
    };

    return { ok: true, data: data };
  } catch (err) {
    return { ok: false, err: err.message };
  }
};

export const addUser = async ({ name, email, password, image }) => {
  try {
    const emailRegistered = await userRepository.findUserByEmail(email);

    if (!emailRegistered) {
      const keyName = `lokendrausers/${v4()}`;
      const imageBuffer = image?.buffer;
      const uploadImage = await uploadFile({ imageBuffer, keyName });

      if (uploadImage.ok) {
        const encryptedPass = await encryptPassword({ password });
        const response = await userRepository.addUser(
          name,
          email,
          encryptedPass,
          keyName
        );

        if (response) {
          return { ok: true, data: "Profile added successfully!" };
        } else {
          return { ok: false, err: "Something went wrong! Please try again" };
        }
      } else {
        return { ok: false, err: "Something went wrong! Please try again" };
      }
    } else {
      return { ok: false, err: "Email already registered!" };
    }
  } catch (err) {
    return { ok: false, err: err.message };
  }
};

export const deleteUser = async ({ id }) => {
  try {
    const user = await userRepository.findActiveUserById(id);
    if (!user) {
      return { ok: false, err: "User not found!" };
    } else {
      const response = await userRepository.deleteUser(id);
      return { ok: true, data: "User deleted successfully!" };
    }
  } catch (err) {
    return { ok: false, err: err.message };
  }
};
