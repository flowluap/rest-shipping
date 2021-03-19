
import express from 'express';
import dotenv from 'dotenv';
import dpdRouter from './dpd/dpd.mjs';

const router = express.Router();
dotenv.config();


router.use('/dpd',dpdRouter)

export default router;