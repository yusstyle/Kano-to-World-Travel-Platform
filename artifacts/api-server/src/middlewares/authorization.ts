import { getAuth } from "@clerk/express";
import type { NextFunction, Request, Response } from "express";
import { db, eq, userProfilesTable } from "@workspace/db";

export function getSafeUserId(req: Request): string | null {
  try {
    return getAuth(req).userId ?? null;
  } catch {
    return null;
  }
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
