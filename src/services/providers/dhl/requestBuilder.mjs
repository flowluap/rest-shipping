import util from "../../../util/util.mjs";
/*
A4: common label laser printing A4 plain paper;
910-300-700: common label laser printing 105 x 205 mm (910-300-700);
910-300-700-oz: common label laser printing 105 x 205 mm (910-300-700) without additional label;
910-300-600: common label thermal printing 103 x 199 (910-300-600, 910-300-610);
910-300-710: common label laser printing 105 x 208 mm (910-300-710); 100x70mm:
100x70mm (only for Warenpost);
*/
let labelSize = "910-300-700-oz";
let dev = parseInt(process.env.DHL_DEV);

const buildHeader = (action) => {
  return {
    "cis:Authentification": {
      "cis:user": dev ? process.env.DHL_HTTP_AUTH_USER_DEV : process.env.DHL_USER,
      "cis:signature": dev ? process.env.DHL_PASS_DEV : process.env.DHL_PASS
    },
    "cis:SOAPAction": `urn:${action}`
  };
};

const buildBody = (data, national) => {
  let product = national ? "V01PAK" : "V53WPAK";
  return {
    Version: {
      majorRelease: "3",
      minorRelease: "1"
    },
    ShipmentOrder: {
      SequenceNumber: "",
      Shipment: {
        ShipmentDetails: {
          product,
          accountNumber: dev ? process.env.DHL_ACCOUNT_NUMBER_DEV : national ? process.env.DHL_ACCOUNT_NUMBER : process.env.DHL_ACCOUNT_NUMBER_INT,
          //customerReference: "Ref. 123456",
          shipmentDate: util.generateShipmentDate(),
          costCentre: "",
          ShipmentItem: {
            weightInKG: "3",
            lengthInCM: "60",
            widthInCM: "60",
            heightInCM: "60"
          },
          //Service:"",
          _xml: `<Service>
                    ${national ? "" : "<Premium active=\"1\"/>"}
                 </Service>`,
          Notification: {
            recipientEmailAddress: data.recipient.email || process.env.ALT_TRACKING_MAIL
          }
        },
        Shipper: {
          Name: {
            name1: `${data.sender.firstName} ${data.sender.lastName}`,
            name2: `${data.sender.street} ${data.sender.streetNo}`,
            name3: `${data.sender.city} ${data.sender.zip}`
          },
          Address: {
            streetName: data.sender.street,
            streetNumber: data.sender.streetNo,
            zip: data.sender.zip,
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
            name3: `${data.recipient.city} ${data.recipient.zip}`,
            streetName: data.recipient.street,
            streetNumber: data.recipient.streetNo,
            zip: data.recipient.zip,
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
        },
/*
        ExportDocument: {
          invoiceNumber: "RE123",
          exportType: "OTHER",
          exportTypeDescription: "Permanent",
          termsOfTrade: "",
          placeOfCommital: "",
          additionalFee: "",
          permitNumber: "",
          attestionNumber: "",
          //<WithElectronicExportNtfctn active=? />
          ExportDocPosition: {
            description: "ExportPosOne",
            countryCodeOrigin: "DE",
            customsTariffNumber: 1234,
            amount: 1,
            netWeightInKG: 1,
            customsValue: 1.00
          }
        }
*/
      }
      //"PrintOnlyIfCodeable active=1": ""
    },
    labelResponseType: "B64",
    groupProfileName: "",
    labelFormat: labelSize,
    labelFormatRetoure: labelSize,
    combinedPrinting: 0
  };
};

const buildGetLabelBody = (number) => {
  return {
    Version: {
      majorRelease: "3",
      minorRelease: "1"
    },
    shipmentNumber: number,
    labelResponseType: "B64",
    groupProfileName: "",
    labelFormat: labelSize,
    labelFormatRetoure: labelSize,
    combinedPrinting: 0
  };
};

export default { buildBody, buildGetLabelBody, buildHeader };