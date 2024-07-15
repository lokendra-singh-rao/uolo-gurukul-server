import * as userRepository from "../repositories/userRepository.js";
import { v4 } from "uuid";
import { encryptPassword } from "../utils/passwordUtils.js";
import * as elasticService from "./elasticSearchService.js";
import { getFileUrl, uploadFile } from "../middlewares/storageService.js";
import { logger } from "../utils/logger.js";

export const listUsers = async ({ page, query }) => {
  try {
    const itemsPerPage = 8;
    const elasticResponse = await elasticService.searchUser({
      page,
      query,
      itemsPerPage,
    });

    if (elasticResponse.ok) {
      const totalActiveUsers = elasticResponse?.data?.totalActiveUsers;
      const users = elasticResponse?.data?.users;

      const totalPages =
        totalActiveUsers % itemsPerPage == 0
          ? totalActiveUsers / itemsPerPage
          : totalActiveUsers / itemsPerPage + 1;

      if (page > totalPages) {
        page = 1;
      }

      for (let user of users) {
        const signedImage = await getFileUrl(user.image);
        if (signedImage.ok) {
          user.image = signedImage?.data;
        } else {
          user.image = "http://localhost:8080/images/defaultImage.webp";
        }
      }
      const data = {
        currentPage: parseInt(page),
        totalPages: parseInt(totalPages),
        filteredUsers: users,
      };

      return { ok: true, status: 200, data: data };
    } else {
      return {
        ok: false,
        status: 500,
        err: "Something went wrong! Please try again",
      };
    }
  } catch (err) {
    logger.error("Error in listUsers service", err);
    return {
      ok: false,
      status: 500,
      err: "Something went wrong! Please try again",
    };
  }
};

export const addUser = async ({ name, email, password, image }) => {
  try {
    const emailRegistered = await userRepository.findUserByEmail(email);

    if (!emailRegistered.data) {
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
        if (mongoResponse.ok) {
          const elasticResponse = await elasticService.ingestUser({
            id: mongoResponse.data._id,
            name: mongoResponse.data.name,
            email: mongoResponse.data.email,
            image: mongoResponse.data.image,
            createdAt: mongoResponse.data.createdAt,
            updatedAt: mongoResponse.data.updatedAt,
            active: mongoResponse.data.active,
          });

          if (elasticResponse.ok) {
            return {
              ok: true,
              status: 200,
              data: "Profile added successfully!",
            };
          } else {
            const hardDeleteUser = await userRepository.hardDeleteUser(
              mongoResponse._id
            );
            if (hardDeleteUser.ok) {
              return {
                ok: false,
                status: 500,
                err: "Something went wrong! Please try again",
              };
            } else {
              logger.error("Data integrity for id ", mongoResponse._id);
              return {
                ok: false,
                status: 500,
                err: "Something went wrong! Please try again",
              };
            }
          }
        } else {
          return {
            ok: false,
            status: 500,
            err: "Something went wrong! Please try again",
          };
        }
      } else {
        return {
          ok: false,
          status: 500,
          err: "Something went wrong! Please try again",
        };
      }
    } else {
      return { ok: false, status: 400, err: "Email already registered!" };
    }
  } catch (err) {
    logger.error("Error in addUser service", err);
    return {
      ok: false,
      status: 500,
      err: "Something went wrong! Please try again",
    };
  }
};

export const deleteUser = async ({ id }) => {
  try {
    const user = await userRepository.findActiveUserById(id);
    if (!user.data) {
      return { ok: false, status: 400, err: "User not found!" };
    } else {
      const response = await userRepository.softDeleteUser(id);
      elasticService.deleteUser(user.data._doc._id);
      return { ok: true, status: 200, data: "User deleted successfully!" };
    }
  } catch (err) {
    logger.error("Error in deleteUser service", err);
    return {
      ok: false,
      status: 500,
      err: "Something went wrong! Please try again",
    };
  }
};
