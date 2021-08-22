import soap from "soap";
import dotenv from "dotenv";
import util from "../../../util/util.mjs";
import requestBuilder from "./requestBuilder.mjs";

dotenv.config();

let dev = parseInt(process.env.DHL_DEV);

let httpAuthUser = dev ? process.env.DHL_HTTP_AUTH_USER_DEV : process.env.DHL_HTTP_AUTH_USER;
let httpAuthPassword = dev ? process.env.DHL_HTTP_AUTH_PASS_DEV : process.env.DHL_HTTP_AUTH_PASS;
let endpoint = dev ? "https://cig.dhl.de/services/sandbox/soap" : "https://cig.dhl.de/services/production/soap";


async function checkAddress(data, callback) {
  try {
    soap.createClient(
      "https://cig.dhl.de/cig-wsdls/com/dpdhl/wsdl/geschaeftskundenversand-api/3.1/geschaeftskundenversand-api-3.1.wsdl",
      { endpoint },
      async function(err, client) {
        if (err) throw err;
        client.setSecurity(new soap.BasicAuthSecurity(httpAuthUser, httpAuthPassword));
        client.addSoapHeader(requestBuilder.buildHeader("validateShipment"));

        if (data.recipient.countryCode !== "DE") {
          await client.validateShipment(requestBuilder.buildBody(data, false), function(err, result, rawResponse, soapHeader, rawRequest) {
            console.log(err, rawResponse);
            if (err) return callback({ err, rawResponse });
            if (result.Status.statusCode !== 0) return callback(JSON.stringify(result));
            callback(null);
          });

        } else {
          await client.validateShipment(requestBuilder.buildBody(data, true), function(err, result, rawResponse, soapHeader, rawRequest) {
            if (err) return callback(err);
            if (result.Status.statusCode !== 0) return callback(JSON.stringify(result));
            callback(null);
          });
        }
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
        client.addSoapHeader(requestBuilder.buildHeader("getLabel"));
        //console.log("httpUser: " + httpAuthUser);
        //console.log("httpPassword:" + httpAuthPassword);
        //console.log(buildHeader("createShipmentOrder"));
        if (data.recipient.countryCode !== "DE") {
          await client.createShipmentOrder(requestBuilder.buildBody(data, false), function(err, result, rawResponse, soapHeader, rawRequest) {
            if (err) return callback(err);
            if (result.Status.statusCode !== 0) return callback(JSON.stringify(result));
            callback(null, {
              trackingNumber: result.CreationState[0].shipmentNumber,
              labelContent: result.CreationState[0].LabelData.labelData
            });
          });
        } else {
          await client.createShipmentOrder(requestBuilder.buildBody(data, true), function(err, result, rawResponse, soapHeader, rawRequest) {
            if (err) return callback(err);
            if (result.Status.statusCode !== 0) return callback(JSON.stringify(result));
            callback(null, {
              trackingNumber: result.CreationState[0].shipmentNumber,
              labelContent: result.CreationState[0].LabelData.labelData
            });
          });

        }
      }
    );
  } catch (e) {
    callback(e);
  }
}

async function getOldLabel(tracking, callback) {
  try {
    soap.createClient(
      "https://cig.dhl.de/cig-wsdls/com/dpdhl/wsdl/geschaeftskundenversand-api/3.1/geschaeftskundenversand-api-3.1.wsdl",
      { endpoint },
      async function(err, client) {
        if (err) throw err;
        client.setSecurity(new soap.BasicAuthSecurity(httpAuthUser, httpAuthPassword));
        client.addSoapHeader(requestBuilder.buildHeader("createShipmentOrder"));
        await client.getLabel(requestBuilder.buildGetLabelBody(tracking), function(err, result, rawResponse, soapHeader, rawRequest) {
          console.log(err);
          if (err) return callback(err);
          if (result.Status.statusCode !== 0) return callback(JSON.stringify(result));
          callback(null, {
            trackingNumber: result.CreationState[0].shipmentNumber,
            labelContent: result.CreationState[0].LabelData.labelData
          });
        });
      }
    );
  } catch (e) {
    callback(e);
  }
}

export default { checkAddress, getLabel, getOldLabel };
