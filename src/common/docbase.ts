export const getDocBaseDomain = (): string => {
  const domain = process.env.DOCBASE_DOMAIN
  if (typeof domain === "string" && domain.trim().length > 0) {
    return domain
  }
  throw new Error("Undefined environment variable: DOCBASE_DOMAIN")
}
