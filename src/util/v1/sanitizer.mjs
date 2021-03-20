import shopify from "./sources/shopify/shopifySanitization.mjs"
const supportedSources = ["shopify"]

async function sanitizeSender (sender){
    return sender;
}

async function generic(receipient) {
    return receipient;
}

async function specific(receipient, source){
    let sanitizedReceipient; 
    console.log(source)

    if (!supportedSources.includes(source)) {
        throw new Error("Not supported address Source")
    }

    if (source == "shopify"){
        sanitizedReceipient = await shopify.sanitizeAddress(receipient);
    }
    return sanitizedReceipient;
}


export default { generic, specific, sanitizeSender}