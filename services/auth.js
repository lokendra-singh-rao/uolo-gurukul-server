import { findUserByEmail } from "../repositories/user";
import { comparePassword } from "../utils/passwordUtils";
import jwt from "jsonwebtoken";

export const login = async (email, password) => {
  try {
    const user = await findUserByEmail(email);

    if (user.data) {
      if (comparePassword(user.data.password, password)) {
        const authToken = jwt.sign(
          {
            user: {
              email: user.data.email,
              id: user.data.id,
            },
          },
          process.env.AUTH_TOKEN_SECRET,
          { expiresIn: "60m" }
        );
      } else {
        return { ok: false, status: 401, err: "Email/Password incorrect!" };
      }
    } else {
      return { ok: false, status: 401, err: "Email/Password incorrect!" };
    }
  } catch (error) {
    return {
      ok: false,
      status: 500,
      err: "Something went wrong! Please try again",
    };
  }
};
