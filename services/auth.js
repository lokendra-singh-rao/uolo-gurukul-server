import { findUserByEmail } from "../repositories/user.js";
import { logger } from "../utils/logger.js";
import { comparePassword } from "../utils/passwordUtils.js";
import jwt from "jsonwebtoken";
import { getFileUrl } from "../services/storage.js";
import "dotenv/config";

export const login = async ({ email, password }) => {
  try {
    const user = await findUserByEmail(email);
    if (user.data) {
      const originalPassword = user.data.password;
      const requestedPassword = password;
      if (await comparePassword({ originalPassword, requestedPassword })) {
        const authToken = jwt.sign(
          {
            user: {
              email: user.data.email,
              id: user.data._id,
            },
          },
          process.env.AUTH_TOKEN_SECRET,
          { expiresIn: "30d" }
        );

        return {
          ok: true,
          status: 200,
          data: {
            user: {
              name: user.data.name,
              image: (await getFileUrl(user.data.image)).data,
            },
            token: authToken,
          },
        };
      } else {
        return { ok: false, status: 400, err: "Email/Password incorrect!" };
      }
    } else {
      return { ok: false, status: 400, err: "Email not registered!" };
    }
  } catch (err) {
    logger.error(`Error in login service ${err}`);
    return {
      ok: false,
      status: 500,
      err: "Something went wrong! Please try again",
    };
  }
};

export const verifyToken = async ({ token }) => {
  try {
    const response = jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
    return { ok: true, status: 200, data: response };
  } catch (err) {
    logger.error(`Error in login service ${err}`);
    return {
      ok: false,
      status: 500,
      err: "Something went wrong! Please try again",
    };
  }
};
