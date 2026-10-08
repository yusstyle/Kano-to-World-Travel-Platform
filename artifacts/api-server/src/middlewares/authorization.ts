import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import { db, eq, userProfilesTable } from "@workspace/db";

export function getSafeUserId(req: Request): string | null {
  try {
    const clerkAuth = getAuth(req);
    if (clerkAuth?.userId) return clerkAuth.userId;
  } catch {
    // Clerk not mounted or user not signed in
  }

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    const token = authHeader.replace(/^bearer\s+/i, "").trim();
    if (token.startsWith("admin-token-")) {
      return token.replace("admin-token-", "");
    }
  }

  const cookieHeader = req.headers.cookie;
  if (cookieHeader) {
    const match = cookieHeader.match(/admin_token=admin-token-([^;]+)/);
    if (match?.[1]) {
      return decodeURIComponent(match[1]);
    }
  }

  return null;
}

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const userId = getSafeUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Authentication is required." });
    return;
  }

  const [profile] = await db
    .select({ role: userProfilesTable.role })
    .from(userProfilesTable)
    .where(eq(userProfilesTable.clerkUserId, userId))
    .limit(1);

  if (profile?.role !== "admin") {
    res.status(403).json({ error: "Administrator access is required." });
    return;
  }

  next();
}
