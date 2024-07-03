import * as userService from "../services/userService.js";
import {
  isAlphabetsOnly,
  isEmailValid,
  isNumbericalOnly,
  isValidImage,
} from "../utilities/typeValidators.js";

export const listUsers = async (req, res) => {
  const { page, query } = req.query;
  try {
    // page number validation
    if (page < 1 || !isNumbericalOnly(page)) {
      return res.status(400).json({ error: "invalid page requested!" });
    }

    // search query validation
    if (!(isAlphabetsOnly(query) || isEmailValid(query) || !query)) {
      return res.status(400).json({ error: "search query invalid!" });
    }
    const response = await userService.listUsers({ page, query });

    if (response.ok) {
      return res.status(200).json(response.data);
    } else {
      return res.status(200).json({ err: response.err });
    }
  } catch (err) {
    console.log("here");
    return res.status(400).json({ err: err.message });
  }
};

export const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const image = req.file;

    // name validation
    if (!isAlphabetsOnly(name)) {
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
      return res.status(200).json(response.data);
    } else {
      return res.status(400).json({ err: response.err });
    }
  } catch (err) {
    return res.status(400).json({ err: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.query;
    // id validation - will be implemented when we have a specific id format

    const response = await userService.deleteUser({ id });

    if (response.ok) {
      return res.status(200).json({ message: response.data });
    } else {
      return res.status(200).json({ err: response.err });
    }
  } catch (err) {
    return res.status(400).json({ err: err.message });
  }
};
