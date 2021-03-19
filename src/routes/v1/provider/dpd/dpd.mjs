import express from 'express';
import dotenv from 'dotenv';
import dpdController from '~controller/v1/provider/dpd.mjs';

const router = express.Router();
dotenv.config();


router.post('/getLabel', dpdController.info);
router.post('/checkAddress', dpdController.info);
router.post('/sanitizeAddress', dpdController.info);

export default router;