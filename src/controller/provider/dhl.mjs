import dhlService from "~services/providers/dhl/dhl.mjs";
import sanitizer from "~util/sanitizer.mjs";
import { BadRequestError } from "../../util/restError.mjs";
import { resizePdf, rotatePdf } from "../../util/pdf.mjs";

/*
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
  let sender = req.body.sender;
  let recipient = req.body.recipient;
  let addressSource = req.body.addressSource;
  let response = await sanitizer._sanitizeAddress(sender, recipient, addressSource);
  await dhlService.checkAddress(response, (error) => {
    if (error) return next(new BadRequestError(JSON.stringify(error)));

    res.json(response);
  });
}

async function getLabel(req, res, next) {
  let sender = req.body.sender;
  let recipient = req.body.recipient;
  let addressSource = req.body.addressSource;
  let response = await sanitizer._sanitizeAddress(sender, recipient, addressSource);
  await dhlService.getLabel(response, async (error, label) => {
    if (error) return next(new BadRequestError(error));
    label.labelContent = await resizePdf(label.labelContent);
    res.json(label);
  });
}
async function getOldLabel(req, res, next) {
  await dhlService.getOldLabel(req.params.tracking, async (error, label) => {
    if (error) return next(new BadRequestError(error));
    label.labelContent = await resizePdf(label.labelContent);
    res.json(label);
  });
}


export default { checkAddress, getLabel, getOldLabel };
