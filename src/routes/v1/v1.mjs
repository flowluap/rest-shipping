import express from 'express';
import dotenv from 'dotenv';
import v1Controller from '../../controller/v1/v1.mjs';

const router = express.Router();

dotenv.config();


router.get('/', v1Controller.info);

export default router;