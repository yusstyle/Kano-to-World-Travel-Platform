import { Router, type IRouter } from "express";
import healthRouter from "./health";
import discoveryRouter from "./discovery";
import communicationRouter from "./communication";
import authRouter from "./auth";
import siteContentRouter from "./site-content";
import contentRouter from "./content";
import bookingsRouter from "./bookings";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(discoveryRouter);
router.use(communicationRouter);
router.use(authRouter);
router.use(siteContentRouter);
router.use(contentRouter);
router.use(bookingsRouter);
router.use(adminRouter);

export default router;
