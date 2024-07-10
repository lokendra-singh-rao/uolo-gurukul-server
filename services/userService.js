import * as userRepository from "../repositories/userRepository.js";
import { v4 } from "uuid";
import { encryptPassword } from "../utilities/passwordUtils.js";
import { getSignedUrlS3, uploadFile } from "./s3Service.js";
import { ingestUser, searchUser } from "./elasticSearchService.js";

export const listUsers = async ({ page }) => {
  try {
    const itemsPerPage = 8;

    const users = await userRepository.listUsers({ page, itemsPerPage });

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
    return { ok: false, err: "Something went wrong! Please try again" };
  }
};

export const searchUsers = async ({ page, query }) => {
  const response = await searchUser(query);
  console.log(response.body.hits.hits);
  return { ok: true, data: "Working" };
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

        const mongoResponse = await userRepository.addUser(
          name,
          email,
          encryptedPass,
          keyName
        );
        console.log(mongoResponse);
        const elasticResponse = await ingestUser({ mongoResponse });

        console.log(elasticResponse);

        if (mongoResponse) {
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
    return { ok: false, err: "Something went wrong! Please try again" };
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
    return { ok: false, err: "Something went wrong! Please try again" };
  }
};
