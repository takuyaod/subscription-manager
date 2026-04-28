import { createRemoteJWKSet, jwtVerify } from "jose";
import { headers } from "next/headers";

const DEV_USER_ID = "dev-user-00000000-0000-0000-0000-000000000001";

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks(): ReturnType<typeof createRemoteJWKSet> {
  if (!jwks) {
    const teamName = process.env.CF_ACCESS_TEAM_NAME;
    if (!teamName) throw new Error("CF_ACCESS_TEAM_NAME is not set");
    jwks = createRemoteJWKSet(
      new URL(
        `https://${teamName}.cloudflareaccess.com/cdn-cgi/access/certs`,
      ),
    );
  }
  return jwks;
}

export async function getUserId(): Promise<string> {
  if (process.env.NODE_ENV !== "production") {
    return DEV_USER_ID;
  }

  const headersList = await headers();
  const jwt = headersList.get("CF-Access-JWT-Assertion");
  if (!jwt) throw new Error("CF-Access-JWT-Assertion header is missing");

  const teamName = process.env.CF_ACCESS_TEAM_NAME!;
  const aud = process.env.CF_ACCESS_AUD;
  if (!aud) throw new Error("CF_ACCESS_AUD is not set");

  const { payload } = await jwtVerify(jwt, getJwks(), {
    issuer: `https://${teamName}.cloudflareaccess.com`,
    audience: aud,
  });

  if (!payload.sub) throw new Error("sub claim is missing in JWT");
  return payload.sub;
}
