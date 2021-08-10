import express from 'express';
import dhlController from "~controller/provider/dhl.mjs";
const router = express.Router();

router.post('/checkAddress', dhlController.checkAddress);

export default router;