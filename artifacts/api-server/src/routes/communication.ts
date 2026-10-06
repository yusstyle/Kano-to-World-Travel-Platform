import { Router, type IRouter } from "express";
import {
  SubmitContactBody,
  SubmitContactResponse,
  SubscribeNewsletterBody,
  SubscribeNewsletterResponse,
} from "@workspace/api-zod";
import {
  contactInquiriesTable,
  db,
  newsletterSubscribersTable,
} from "@workspace/db";

const router: IRouter = Router();

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [inquiry] = await db
    .insert(contactInquiriesTable)
    .values({
      ...parsed.data,
      phone: parsed.data.phone ?? null,
    })
    .returning({ id: contactInquiriesTable.id });

  req.log.info({ inquiryId: inquiry.id }, "Contact inquiry stored");
  res.status(201).json(
    SubmitContactResponse.parse({
      id: inquiry.id,
      message: "Your inquiry has been received.",
    }),
  );
});

router.post("/newsletter", async (req, res): Promise<void> => {
  const parsed = SubscribeNewsletterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const normalizedEmail = parsed.data.email.trim().toLowerCase();
  const [subscriber] = await db
    .insert(newsletterSubscribersTable)
    .values({ email: normalizedEmail })
    .onConflictDoUpdate({
      target: newsletterSubscribersTable.email,
      set: { status: "active" },
    })
    .returning({ id: newsletterSubscribersTable.id });

  res.status(201).json(
    SubscribeNewsletterResponse.parse({
      id: subscriber.id,
      message: "You are subscribed to travel updates.",
    }),
  );
});

export default router;
