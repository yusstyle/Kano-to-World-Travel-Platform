import { Router, type IRouter } from "express";
import healthRouter from "./health";
import discoveryRouter from "./discovery";
import communicationRouter from "./communication";
import authRouter from "./auth";
import siteContentRouter from "./site-content";

const router: IRouter = Router();

router.use(healthRouter);
router.use(discoveryRouter);
router.use(communicationRouter);
router.use(authRouter);
router.use(siteContentRouter);

export default router;
