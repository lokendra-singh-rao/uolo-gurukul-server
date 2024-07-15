import * as userService from "../services/user.js";
import { logger } from "../utils/logger.js";
import {
  isAlphanumeric,
  isEmailValid,
  isNumbericalOnly,
  isValidImage,
  isValidSearchQuery,
} from "../utils/typeValidators.js";

export const listUsers = async (req, res) => {
  const { page, query } = req.query;
  try {
    // page number validation
    if (page < 1 || !isNumbericalOnly(page)) {
      return res.status(400).json({ err: "invalid page requested!" });
    }

    // search query validation
    if (!(isValidSearchQuery(query) || !query)) {
      return res.status(400).json({ err: "search query invalid!" });
    }

    const response = await userService.listUsers({ page, query });

    if (response.ok) {
      return res.status(response.status).json(response.data);
    } else {
      return res.status(response.status).json({ err: response.err });
    }
  } catch (err) {
    logger.error("Error in listUser", err);
    return res
      .status(500)
      .json({ err: "Something went wrong! Please try again" });
  }
};

export const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const image = req.file;

    // name validation
    if (!isAlphanumeric(name) || name.length < 3) {
      return res.status(400).json({ err: "invalid name!" });
    }

    // email validation
    if (!isEmailValid(email)) {
      return res.status(400).json({ err: "invalid email!" });
    }

    // image validation
    if (!isValidImage(image?.mimetype)) {
      return res.status(400).json({ err: "invalid image!" });
    }

    const response = await userService.addUser({
      name,
      email,
      password,
      image,
    });

    if (response.ok) {
      return res.status(response.status).json(response.data);
    } else {
      return res.status(response.status).json({ err: response.err });
    }
  } catch (err) {
    logger.error("Error in addUser", err);
    return res.status(500).json({ err: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.query;

    const response = await userService.deleteUser({ id });

    if (response.ok) {
      return res.status(response.status).json({ message: response.data });
    } else {
      return res.status(response.status).json({ err: response.err });
    }
  } catch (err) {
    logger.error("Error in deleteUser", err);
    return res.status(500).json({ err: err.message });
  }
};
