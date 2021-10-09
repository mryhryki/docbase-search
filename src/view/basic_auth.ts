import { getBasicAuthPass, getBasicAuthUser } from "../common/env";

export const verifyBasicAuth = (authorization: unknown): boolean => {
  const basicAuthUser = getBasicAuthUser();
  const basicAuthPass = getBasicAuthPass();
  const useBasicAuth = basicAuthUser !== "" && basicAuthPass !== "";

  if (!useBasicAuth) {
    return true;
  }

  if (typeof authorization !== "string") {
    return false;
  } else if (!authorization.toLowerCase().startsWith("basic ")) {
    return false;
  }

  const token = authorization.substr(6);
  const [user, pass] = Buffer.from(token, "base64").toString("utf-8").split(":");
  return user === basicAuthUser && pass === basicAuthPass;
};
