import express from 'express';
import dpdRouter from './dpd/dpd.mjs';
const router = express.Router();

router.use('/dpd', dpdRouter);

export default router;