import express from 'express';
import dpdController from "~controller/provider/dpd.mjs";
const router = express.Router();

router.post('/getLabel', dpdController.getLabel);
router.post('/sanitizeAddress', dpdController.sanitizeAddress);
router.post('/checkAddress', dpdController.checkAddress);

export default router;