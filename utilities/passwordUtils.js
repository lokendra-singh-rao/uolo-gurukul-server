import bcryptjs from "bcryptjs";

export async function encryptPassword({ password }) {
  const salt = await bcryptjs.genSalt(10);
  const encryptedPassword = await bcryptjs.hash(password, salt);
  return encryptedPassword;
}

export async function comparePassword({ originalPassword, requestPassword }) {
  const passwordSame = await bcryptjs.compare(
    originalPassword,
    requestPassword
  );
  if (!passwordSame) {
    return false;
  } else {
    return true;
  }
}
