import express from 'express';
import dhlController from "~controller/provider/dhl.mjs";
const router = express.Router();

router.post('/checkAddress', dhlController.checkAddress);
router.post('/getLabel', dhlController.getLabel);
router.post('/getOldLabel/:tracking', dhlController.getOldLabel);

export default router;