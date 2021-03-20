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

function sanitizeAddress(receipient) {
    let sanitizedAddress = {
        firstName: receipient.first_name,
        lastName: receipient.last_name,
        company: receipient.company,
        countryCode: receipient.country_code,
        zipCode: receipient.zip,
        city: receipient.city,
        phone: receipient.phone,
        notice: receipient.address2
    };

    if (checkJSON(receipient)) {

        try {
            sanitizedAddress = { ...sanitizedAddress, ...extractHouseFromStreet(receipient.address1) };
        } catch (e) {
            try {
                sanitizedAddress = { ...sanitizedAddress, ...extractHouseFromStreet(receipient.address1, receipient.address2, true) };
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