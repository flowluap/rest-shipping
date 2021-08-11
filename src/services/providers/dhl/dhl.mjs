import soap from "soap";
import dotenv from "dotenv";
import util from "../../../util/util.mjs";

dotenv.config();

let dev = parseInt(process.env.DHL_DEV);

let httpAuthUser = dev ? process.env.DHL_HTTP_AUTH_USER_DEV : process.env.DHL_HTTP_AUTH_USER;
let httpAuthPassword = dev ? process.env.DHL_HTTP_AUTH_PASS_DEV : process.env.DHL_HTTP_AUTH_PASS;
let endpoint = dev ? "https://cig.dhl.de/services/sandbox/soap" : "https://cig.dhl.de/services/production/soap";

const buildHeader = (action) => {
  return {
    "cis:Authentification": {
      "cis:user": process.env.DHL_USER,
      "cis:signature": process.env.DHL_PASS
    },
    "cis:SOAPAction": `urn:${action}`
  };
};
const buildBody = (data) => {
  return {
    Version: {
      majorRelease: "3",
      minorRelease: "1"
    },
    ShipmentOrder: {
      SequenceNumber: "",
      Shipment: {
        ShipmentDetails: {
          product: "V01PAK",
          accountNumber: process.env.DHL_ACCOUNT_NUMBER,
          //customerReference: "Ref. 123456",
          shipmentDate: util.generateShipmentDate(),
          costCentre: "",
          ShipmentItem: {
            weightInKG: "3",
            lengthInCM: "60",
            widthInCM: "60",
            heightInCM: "60"
          },
          Service: "",
          Notification: {
            recipientEmailAddress: data.recipient.email || process.env.ALT_TRACKING_MAIL
          }
        },
        Shipper: {
          Name: {
            name1: `${data.sender.firstName} ${data.sender.lastName}`
            name2: `${data.sender.street} ${data.sender.streetNo}`,
            name3: `${data.sender.city} ${data.sender.zipCode}`,
          },
          Address: {
            streetName: data.sender.street,
            streetNumber: data.sender.streetNo,
            zip: data.sender.zipCode,
            city: data.sender.city,
            Origin: {
              country: "",
              countryISOCode: data.sender.country
            }
          },
          Communication: {
            phone: data.sender.phone,
            email: data.sender.email,
            contactPerson: `${data.sender.firstName} ${data.sender.lastName}`
          }
        },
        Receiver: {
          name1: `${data.recipient.firstName} ${data.recipient.lastName}`,
          Address: {
            name2: `${data.recipient.street} ${data.recipient.streetNo}`,
            name3: `${data.recipient.city} ${data.recipient.zipCode}`,
            streetName: data.recipient.street,
            streetNumber: data.recipient.streetNo,
            zip: data.recipient.zipCode,
            city: data.recipient.city,
            Origin: {
              country: "",
              countryISOCode: data.recipient.countryCode
            }
          },
          Communication: {
            phone: data.recipient.phone,
            email: data.recipient.email || process.env.ALT_TRACKING_MAIL,
            contactPerson: `${data.recipient.firstName} ${data.recipient.lastName}`
          }
        }
      }
      //"PrintOnlyIfCodeable active=1": ""
    },
    labelResponseType: "B64",
    groupProfileName: "",
    labelFormat: "",
    labelFormatRetoure: "",
    combinedPrinting: 0
  };
};

async function checkAddressInternational() {
}

async function checkAddress(data, callback) {
  try {
    soap.createClient(
      "https://cig.dhl.de/cig-wsdls/com/dpdhl/wsdl/geschaeftskundenversand-api/3.1/geschaeftskundenversand-api-3.1.wsdl",
      { endpoint },
      async function(err, client) {
        if (err) throw err;
        client.setSecurity(new soap.BasicAuthSecurity(httpAuthUser, httpAuthPassword));
        client.addSoapHeader(buildHeader("validateShipment"));
        console.log("httpUser: " + httpAuthUser);
        console.log("httpPassword:" + httpAuthPassword);
        console.log(buildHeader("validateShipment"));
        await client.validateShipment(buildBody(data), function(err, result, rawResponse, soapHeader, rawRequest) {
          if (err) return callback(err);
          if (result.Status.statusCode !== 0) return callback(JSON.stringify(result));
          callback(null);
        });
      }
    );
  } catch (e) {
    callback(e);
  }
}
async function getLabel(data, callback) {
  try {
    soap.createClient(
      "https://cig.dhl.de/cig-wsdls/com/dpdhl/wsdl/geschaeftskundenversand-api/3.1/geschaeftskundenversand-api-3.1.wsdl",
      { endpoint },
      async function(err, client) {
        if (err) throw err;
        client.setSecurity(new soap.BasicAuthSecurity(httpAuthUser, httpAuthPassword));
        client.addSoapHeader(buildHeader("createShipmentOrder"));
        console.log("httpUser: " + httpAuthUser);
        console.log("httpPassword:" + httpAuthPassword);
        console.log(buildHeader("createShipmentOrder"));
        await client.createShipmentOrder(buildBody(data), function(err, result, rawResponse, soapHeader, rawRequest) {
          if (err) return callback(err);
          if (result.Status.statusCode !== 0) return callback(JSON.stringify(result));
          console.log(result)
          callback(null, {
            trackingNumber:result.CreationState[0].shipmentNumber,
            labelContent:result.CreationState[0].LabelData.labelData
          });
        });
      }
    );
  } catch (e) {
    callback(e);
  }
}

export default { checkAddress, getLabel };