const numberFromAddres = /[0-9](.*)/;
const addressOnly = /[^\d]*/;
const formatHouseNumber = /[^0-9a-zA-Z-//]+/g; //allowed: "/","-",0-9,A-Z,a-z

//Sometimes the houseNo is in address2 --> this needs to throw an address-correction 
function extractHouseFromStreet(address1, address2 = null, useAddress2 = false) {
    let streetNo = numberFromAddres.exec(useAddress2 ? address2 : address1)[0].replace(formatHouseNumber, '');
    let street = addressOnly.exec(address1)[0].replace(/\s+/g, '').trim()
    return { streetNo, street }
}

function checkJSON(address) {
    let required = ["first_name", "last_name", "address1", "city", "zip", "country_code"]

    for (let index of required) {
        if (!address[index] || address[index].length < 1) {
            return false;
        }
    }
    return true;
}

function sanitizeAddress(recipient) {
    let sanitizedAddress = {
        firstName: recipient.first_name,
        lastName: recipient.last_name,
        company: recipient.company,
        countryCode: recipient.country_code,
        zipCode: recipient.zip,
        city: recipient.city,
        phone: recipient.phone,
        notice: recipient.address2
    };

    if (checkJSON(recipient)) {

        try {
            sanitizedAddress = { ...sanitizedAddress, ...extractHouseFromStreet(recipient.address1) };
        } catch (e) {
            try {
                sanitizedAddress = { ...sanitizedAddress, ...extractHouseFromStreet(recipient.address1, recipient.address2, true) };
            } catch (e) {
                throw new Error("Could not extract streetNo");
            }
        }
        return sanitizedAddress;

    } else {
        throw new Error("Missing params in Shopify JSON");
    }
}


export default { sanitizeAddress }