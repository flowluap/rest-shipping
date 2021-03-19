import express from 'express';
import dotenv from 'dotenv';
import v1Controller from '~controller/v1/v1.mjs';
import providerController from './provider/provider.mjs'
import { authenticateService } from './middleware/authentication.mjs';

const router = express.Router();

dotenv.config();


router.get('/info', authenticateService, v1Controller.info);
router.use('/provider', providerController)

export default router;