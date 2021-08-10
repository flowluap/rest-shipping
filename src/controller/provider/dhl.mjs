import dhlService from "~services/providers/dhl/dhl.mjs";
import sanitizer from "~util/sanitizer.mjs";
import { BadRequestError } from "../../util/restError.mjs";

/*
async function getLabel(req, res, next) {
  try {
    res.json(await dpdService.getLabel(req.body));
  } catch (e) {
    return next(new BadRequestError(e));
  }
  // address is checked and works fine
}

async function sanitizeAddress(req, res, next) {
  //only return the sanitized address
  let response;
  let sender = req.body.sender;
  let recipient = req.body.recipient;
  let addressSource = req.body.addressSource;

  try {
    response = _sanitizeAddress(sender, recipient, addressSource);

  } catch (e) {
    return next(new BadRequestError(e));
  }

  res.json(response);
}
*/

async function checkAddress(req, res, next) {
  let response;
  let sender = req.body.sender;
  let recipient = req.body.recipient;
  let addressSource = req.body.addressSource;
  try {
    response = await sanitizer._sanitizeAddress(sender, recipient, addressSource);
    await dhlService.checkAddress(response);
    res.json(response);
  } catch (e) {
    return next(new BadRequestError(e));
  }
}


export default { checkAddress };