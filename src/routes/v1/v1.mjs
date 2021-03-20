import express from 'express';
import providerRouter from "./provider/provider.mjs"
import { authenticateService } from '~routes/v1/middleware/authentication.mjs';

const router = express.Router();
router.get("/info", )
router.use('/provider', authenticateService, providerRouter);

export default router;