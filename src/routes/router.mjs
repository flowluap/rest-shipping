import express from 'express';
import providerRouter from "./provider/_provider.mjs"
import { authenticateService } from '~routes/middleware/authentication.mjs';

const router = express.Router();
router.get("/info", )
router.use('/provider', authenticateService, providerRouter);

export default router;