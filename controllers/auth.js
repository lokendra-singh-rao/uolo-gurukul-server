import { logger } from "../utils/logger.js";
import * as authService from "../services/auth.js";
import { isEmailValid } from "../utils/typeValidators.js";

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

    const response = await authService.login({ email, password });

    if (response.ok) {
      res.cookie("token", response.data?.token, {
        expires: new Date(Date.now() + 86400000),
        secure: true,
        httpOnly: false,
      });

      res.cookie("user", JSON.stringify(response.data?.user), {
        expires: new Date(Date.now() + 86400000),
        secure: true,
        httpOnly: false,
      });

      return res.status(200).json(response.data);
    } else {
      return res.status(response.status).json(response);
    }
  } catch (err) {
    logger.error("Error in login controller", err);
    return res
      .status(500)
      .json({ err: "Something went wrong! Please try again" });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.clearCookie("user");
  res.status(200).json("Logged out successfully!");
};
