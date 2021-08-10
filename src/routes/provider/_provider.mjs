import express from 'express';
import dpdRouter from './dpd.mjs';
import dhlRouter from './dhl.mjs';
const router = express.Router();

router.use('/dpd', dpdRouter);
router.use('/dhl', dhlRouter);

export default router;