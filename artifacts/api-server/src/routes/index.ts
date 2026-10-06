import { Router, type IRouter } from "express";
import healthRouter from "./health";
import discoveryRouter from "./discovery";
import communicationRouter from "./communication";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(discoveryRouter);
router.use(communicationRouter);
router.use(authRouter);

export default router;
