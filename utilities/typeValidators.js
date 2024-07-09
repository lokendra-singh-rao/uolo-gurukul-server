const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const numCheck = /^[0-9]+$/;
const alphanumericCheck = /^[A-Za-z0-9]+$/;

export function isEmailValid(email) {
  if (!email || email.length > 254) return false;

  if (!emailRegex.test(email)) return false;

  const parts = email.split("@");
  if (parts[0].length > 64) return false;

  const domainParts = parts[1].split(".");

  if (domainParts.some((part) => part.length > 63) || domainParts.length < 2)
    return false;

  return true;
}

export function isAlphanumeric(string) {
  if (!string || string?.length < 3) return false;
  const parts = string.split(" ");
  return parts.every((part) => alphanumericCheck.test(part));
}

export function isNumbericalOnly(num) {
  if (numCheck.test(num)) return true;
  else return false;
}

export function isValidImage(type) {
  if (type !== "image/jpeg" && type !== "image/png") return false;
  else return true;
}
