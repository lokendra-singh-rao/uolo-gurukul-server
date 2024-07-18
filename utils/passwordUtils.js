import bcryptjs from "bcryptjs";

export async function encryptPassword({ password }) {
  const salt = await bcryptjs.genSalt(10);
  const encryptedPassword = await bcryptjs.hash(password, salt);
  return encryptedPassword;
}

export async function comparePassword({ originalPassword, requestedPassword }) {
  const passwordSame = await bcryptjs.compare(
    requestedPassword,
    originalPassword
  );
  if (!passwordSame) {
    return false;
  } else {
    return true;
  }
}
