import { Router, type IRouter } from "express";
import crypto from "crypto";
import {
  bookingsTable,
  db,
  destinationsTable,
  eq,
  toursTable,
} from "@workspace/db";
import {
  CreateBookingBody,
  CreateBookingResponse,
  GetBookingParams,
  GetBookingResponse,
} from "@workspace/api-zod";
import { getSafeUserId } from "../middlewares/authorization";

const router: IRouter = Router();

function generateReference(): string {
  const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  const year = new Date().getFullYear();
  return `KB-${year}-${randomSuffix}`;
}

// POST /bookings - Submit a tour booking
router.post("/bookings", async (req, res): Promise<void> => {
  const parseResult = CreateBookingBody.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({ error: parseResult.error.issues[0]?.message ?? "Invalid booking information." });
    return;
  }

  const input = parseResult.data;

  // Check tour
  const [tour] = await db
    .select({
      id: toursTable.id,
      title: toursTable.title,
      priceAmount: toursTable.priceAmount,
      priceCurrency: toursTable.priceCurrency,
      destinationId: toursTable.destinationId,
    })
    .from(toursTable)
    .where(eq(toursTable.id, input.tourId))
    .limit(1);

  if (!tour) {
    res.status(404).json({ error: "Selected journey was not found." });
    return;
  }

  // Get destination
  const [destination] = await db
    .select({ name: destinationsTable.name })
    .from(destinationsTable)
    .where(eq(destinationsTable.id, tour.destinationId))
    .limit(1);

  const destinationName = destination?.name ?? "Destinations";
  const bookingReference = generateReference();
  const totalAmount = tour.priceAmount ? Number(tour.priceAmount) * input.travelers : null;
  const currency = tour.priceCurrency || "USD";
  const clerkUserId = getSafeUserId(req);

  const [booking] = await db
    .insert(bookingsTable)
    .values({
      bookingReference,
      tourId: tour.id,
      customerName: input.customerName.trim(),
      customerEmail: input.customerEmail.trim().toLowerCase(),
      customerPhone: input.customerPhone?.trim() || null,
      travelDate: input.travelDate.trim(),
      travelers: input.travelers,
      totalAmount,
      currency,
      status: "pending",
      specialRequests: input.specialRequests?.trim() || null,
      clerkUserId,
    })
    .returning();

  const responseData = {
    id: booking.id,
    bookingReference: booking.bookingReference,
    tourId: tour.id,
    tourTitle: tour.title,
    destinationName,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    travelDate: booking.travelDate,
    travelers: booking.travelers,
    totalAmount: booking.totalAmount,
    currency: booking.currency,
    status: booking.status as "pending" | "confirmed" | "cancelled",
    specialRequests: booking.specialRequests,
    createdAt: booking.createdAt.toISOString(),
  };

  res.status(201).json(CreateBookingResponse.parse(responseData));
});

// GET /bookings/:reference - Lookup booking
router.get("/bookings/:reference", async (req, res): Promise<void> => {
  const { reference } = GetBookingParams.parse(req.params);

  const [record] = await db
    .select({
      booking: bookingsTable,
      tourTitle: toursTable.title,
      destinationId: toursTable.destinationId,
    })
    .from(bookingsTable)
    .innerJoin(toursTable, eq(bookingsTable.tourId, toursTable.id))
    .where(eq(bookingsTable.bookingReference, reference))
    .limit(1);

  if (!record) {
    res.status(404).json({ error: "Booking reference not found." });
    return;
  }

  const [destination] = await db
    .select({ name: destinationsTable.name })
    .from(destinationsTable)
    .where(eq(destinationsTable.id, record.destinationId))
    .limit(1);

  const destinationName = destination?.name ?? "Destinations";

  res.json(
    GetBookingResponse.parse({
      id: record.booking.id,
      bookingReference: record.booking.bookingReference,
      tourId: record.booking.tourId,
      tourTitle: record.tourTitle,
      destinationName,
      customerName: record.booking.customerName,
      customerEmail: record.booking.customerEmail,
      customerPhone: record.booking.customerPhone,
      travelDate: record.booking.travelDate,
      travelers: record.booking.travelers,
      totalAmount: record.booking.totalAmount,
      currency: record.booking.currency,
      status: record.booking.status as "pending" | "confirmed" | "cancelled",
      specialRequests: record.booking.specialRequests,
      createdAt: record.booking.createdAt.toISOString(),
    }),
  );
});

export default router;

