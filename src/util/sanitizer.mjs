import shopify from "./sources/shopify/shopifySanitization.mjs"
import woocommerce from "./sources/woocommerce/woocommerceSanitization.mjs";
const supportedSources = ["shopify", "woocommerce"]

async function sanitizeSender (sender){
    return sender;
}

async function generic(recipient) {
    return recipient;
}

async function specific(recipient, source){
    let sanitizedRecipient;
    console.log(source)

    if (!supportedSources.includes(source)) {
        throw new Error("Not supported address Source")
    }

    if (source == "shopify"){
        sanitizedRecipient = await shopify.sanitizeAddress(recipient);
    }

    if (source == "woocommerce"){
        sanitizedRecipient = await woocommerce.sanitizeAddress(recipient);
    }
    return sanitizedRecipient;
}


export default { generic, specific, sanitizeSender}
