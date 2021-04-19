import dpdService from "~services/providers/dpd/dpd.mjs";
import sanitizer from "~util/v1/sanitizer.mjs";
import { BadRequestError } from "../../../../util/restError.mjs";

async function getLabel(req, res, next) {
  try {
    res.json(await dpdService.getLabel(req.body));
  } catch (e) {
    return next(new BadRequestError(e));
  }
  // address is checked and works fine
}

async function _sanitizeAddress(sender, recipient, addressSource) {
  //only return the sanitized address
  let sanitizedRecipient;
  let sanitizedSender = await sanitizer.sanitizeSender(sender);

  if (addressSource) {
    sanitizedRecipient = await sanitizer.specific(recipient, addressSource);
  } else {
    sanitizedRecipient = await sanitizer.generic(recipient);
  }

  return { sender: sanitizedSender, recipient: sanitizedRecipient };
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

async function checkAddress(req, res, next) {
  let response;
  let sender = req.body.sender;
  let recipient = req.body.recipient;
  let addressSource = req.body.addressSource;
  try {
    response = await _sanitizeAddress(sender, recipient, addressSource);
    await dpdService.getLabel(response);
    res.json(response);
  } catch (e) {
    return next(new BadRequestError(e));
  }
}


export default { getLabel, sanitizeAddress, checkAddress };