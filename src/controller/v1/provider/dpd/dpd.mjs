import dpdService from "~services/providers/dpd/dpd.mjs";
import sanitizer from "~util/v1/sanitizer.mjs"
import { BadRequestError } from "../../../../util/restError.mjs";

async function getLabel(req, res, next) {
    res.json(await dpdService.getLabel(
        req.body
    ));
}
async function sanitizeAddress(req, res, next) {
    let sender = req.body.sender;
    let receipient = req.body.receipient;
    let addressSource = req.body.addressSource;
    let sanitizedReceipient;
    let sanitizedSender = await sanitizer.sanitizeSender(sender);

    try {
        if (addressSource) {
            sanitizedReceipient = await sanitizer.specific(receipient, addressSource)
        } else {
            sanitizedReceipient = await sanitizer.generic(receipient)
        }


    } catch (e) {
        return next(new BadRequestError(e));
    }

    res.json({ sender: sanitizedSender, receipient: sanitizedReceipient })
}

async function checkAddress(req, res, next) {
    try {
        await dpdService.getLabel(req.body);
    } catch (e) {
        return next(new BadRequestError(e));
    }

    res.sendStatus(200)



}


export default { getLabel, sanitizeAddress, checkAddress }