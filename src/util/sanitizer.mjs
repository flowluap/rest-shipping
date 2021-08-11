import shopify from "./sources/shopify/shopifySanitization.mjs"
import woocommerce from "./sources/woocommerce/woocommerceSanitization.mjs";
const supportedSources = ["shopify", "woocommerce"]

async function _sanitizeAddress(sender, recipient, addressSource) {
    //only return the sanitized address
    let sanitizedRecipient;
    let sanitizedSender = await sanitizeSender(sender);

    if (addressSource) {
        sanitizedRecipient = await specific(recipient, addressSource);
    } else {
        sanitizedRecipient = await generic(recipient);
    }

    return { sender: sanitizedSender, recipient: sanitizedRecipient };
}

async function sanitizeSender (sender){
    return sender;
}

async function generic(recipient) {
    return recipient;
}

async function specific(recipient, source){
    let sanitizedRecipient;

    if (!supportedSources.includes(source)) {
        throw new Error("Not supported address Source")
    }

    if (source === "shopify"){
        sanitizedRecipient = await shopify.sanitizeAddress(recipient);
    }

    if (source === "woocommerce"){
        sanitizedRecipient = await woocommerce.sanitizeAddress(recipient);
    }
    return sanitizedRecipient;
}


export default { generic, specific, sanitizeSender, _sanitizeAddress}
