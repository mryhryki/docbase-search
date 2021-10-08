export const verifyBasicAuth = (authorization: unknown): boolean => {
  const basicAuthUser = (process.env.BASIC_AUTH_USER ?? "").trim();
  const basicAuthPass = (process.env.BASIC_AUTH_PASS ?? "").trim();
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
