import { Router, type IRouter } from "express";
import { getSafeUserId, requireAdmin } from "../middlewares/authorization";
import {
  db,
  eq,
  siteContentTable,
  type InsertSiteContent,
} from "@workspace/db";
import { z } from "zod";

const router: IRouter = Router();

const updateSiteContentSchema = z.object({
  founderName: z.string().trim().min(2).max(120),
  founderBio: z.string().trim().min(10).max(5000),
  founderImageUrl: z.string().trim().min(1).max(2048),
});

router.get("/admin/site-content", requireAdmin, async (_req, res): Promise<void> => {
  const [content] = await db
    .select()
    .from(siteContentTable)
    .orderBy(siteContentTable.id)
    .limit(1);

  if (!content) {
    res.status(404).json({ error: "Site content has not been initialized." });
    return;
  }

  res.json({
    founderName: content.founderName,
    founderBio: content.founderBio,
    founderImageUrl: content.founderImageUrl,
  });
});

router.put("/admin/site-content", requireAdmin, async (req, res): Promise<void> => {
  const input = updateSiteContentSchema.safeParse(req.body);
  if (!input.success) {
    res.status(400).json({ error: input.error.issues[0]?.message ?? "Invalid content." });
    return;
  }

  const userId = getSafeUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Authentication is required." });
    return;
  }

  const [content] = await db
    .select({ id: siteContentTable.id })
    .from(siteContentTable)
    .limit(1);

  if (!content) {
    res.status(404).json({ error: "Site content has not been initialized." });
    return;
  }

  const values: Partial<InsertSiteContent> = input.data;
  await db
    .update(siteContentTable)
    .set({
      ...values,
      updatedAt: new Date(),
    })
    .where(eq(siteContentTable.id, content.id));

  res.json(input.data);
});

export default router;
