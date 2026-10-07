import { clerkClient, getAuth } from "@clerk/express";
import { Router, type IRouter } from "express";
import { GetAuthProfileResponse, InitializeAdminResponse } from "@workspace/api-zod";
import { db, eq, sql, userProfilesTable } from "@workspace/db";

const router: IRouter = Router();

function toProfileResponse(
  profile: typeof userProfilesTable.$inferSelect,
  canInitializeAdmin = false,
) {
  return {
    clerkUserId: profile.clerkUserId,
    role: profile.role,
    createdAt: profile.createdAt.toISOString(),
    updatedAt: profile.updatedAt.toISOString(),
    canInitializeAdmin,
  };
}

router.get("/auth/me", async (req, res): Promise<void> => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Authentication is required." });
    return;
  }

  await db
    .insert(userProfilesTable)
    .values({ clerkUserId: userId })
    .onConflictDoNothing();

  const [profile] = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.clerkUserId, userId))
    .limit(1);

  if (!profile) {
    res.status(500).json({ error: "Account profile could not be loaded." });
    return;
  }

  const [existingAdmin] = await db
    .select({ clerkUserId: userProfilesTable.clerkUserId })
    .from(userProfilesTable)
    .where(eq(userProfilesTable.role, "admin"))
    .limit(1);

  res.json(
    GetAuthProfileResponse.parse(
      toProfileResponse(
        profile,
        Boolean(process.env.ADMIN_EMAIL?.trim()) && !existingAdmin,
      ),
    ),
  );
});

router.post("/auth/initialize-admin", async (req, res): Promise<void> => {
  const { userId } = getAuth(req);
  if (!userId) {
    res.status(401).json({ error: "Authentication is required." });
    return;
  }

  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!configuredEmail) {
    res.status(503).json({ error: "Administrator initialization is not configured." });
    return;
  }

  let account;
  try {
    account = await clerkClient.users.getUser(userId);
  } catch (error) {
    req.log.warn({ err: error }, "Clerk account verification failed");
    res.status(503).json({ error: "The account identity could not be verified." });
    return;
  }

  const primaryEmail = account.primaryEmailAddress;
  if (
    !primaryEmail ||
    primaryEmail.verification?.status !== "verified" ||
    primaryEmail.emailAddress.trim().toLowerCase() !== configuredEmail
  ) {
    res.status(403).json({
      error: "The signed-in account does not match the configured administrator email.",
    });
    return;
  }

  const profile = await db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(416319729)`);
    const [existingAdmin] = await tx
      .select({ clerkUserId: userProfilesTable.clerkUserId })
      .from(userProfilesTable)
      .where(eq(userProfilesTable.role, "admin"))
      .limit(1);

    if (existingAdmin) return null;

    const [initialized] = await tx
      .insert(userProfilesTable)
      .values({ clerkUserId: userId, role: "admin" })
      .onConflictDoUpdate({
        target: userProfilesTable.clerkUserId,
        set: { role: "admin", updatedAt: new Date() },
      })
      .returning();

    return initialized ?? null;
  });

  if (!profile) {
    res.status(409).json({
      error: "Administrator access has already been initialized.",
    });
    return;
  }

  req.log.info({ clerkUserId: userId }, "Administrator access initialized");
  res.status(201).json(InitializeAdminResponse.parse(toProfileResponse(profile)));
});

export default router;
