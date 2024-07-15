import jwt from "jsonwebtoken";
import { logger } from "../utils/logger";

export const login = async (req, res) => {
  try {
    const { email, password } = req.query;

    // email validation
    if (!isEmailValid(email)) {
      return res.status(400).json({ err: "invalid email!" });
    }

    //password vaidation
    if (!password) {
      return res.status(400).json({ err: "invalid password!" });
    }
  } catch (err) {
    logger.error("Error in login controller", err);
    return res.status(500).json({ err: "invalid password!" });
  }
};
