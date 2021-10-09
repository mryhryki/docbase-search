const getEnvironmentVariable = (key: string, required = true): string => {
  const value = (process.env[key] ?? "").trim()
  if (value.length > 0) {
    return value
  }  else if(!required) {
    return ""
  }
  throw new Error(`Environment variable not exists: ${key}`)
}

export const getDocBaseDomain = (): string => getEnvironmentVariable("DOCBASE_DOMAIN")
export const getDocBaseAccessToken = (): string => getEnvironmentVariable("DOCBASE_ACCESS_TOKEN")
export const getS3Bucket = (): string => getEnvironmentVariable("S3_BUCKET")
export const getBasicAuthUser = (): string => getEnvironmentVariable("BASIC_AUTH_USER")
export const getBasicAuthPass = (): string => getEnvironmentVariable("BASIC_AUTH_PASS")
