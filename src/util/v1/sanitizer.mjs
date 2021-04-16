import shopify from "./sources/shopify/shopifySanitization.mjs"
const supportedSources = ["shopify"]

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
    return sanitizedRecipient;
}


export default { generic, specific, sanitizeSender}