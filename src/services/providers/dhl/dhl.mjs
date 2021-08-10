import soap from 'soap';
import dotenv from 'dotenv';

dotenv.config()

let dev = parseInt(process.env.DHL_DEV);

let httpAuthUser = dev ? process.env.DHL_HTTP_AUTH_USER_DEV : process.env.DHL_HTTP_AUTH_USER;
let httpAuthPassword = dev ? process.env.DHL_HTTP_AUTH_PASS_DEV : process.env.DHL_HTTP_AUTH_PASS;
let endpoint = dev ? 'https://cig.dhl.de/services/sandbox/soap' : 'https://cig.dhl.de/services/production/soap';

let header = {
    'cis:Authentification': {
        'cis:user': process.env.DHL_USER,
        'cis:signature': process.env.DHL_PASS
    },
    'cis:SOAPAction': 'urn:createShipmentOrder'
};

let body = {
    Version: {
        majorRelease: '3',
        minorRelease: '1'
    },
    ShipmentOrder: {
        SequenceNumber: '',
        Shipment: {
            ShipmentDetails: {
                product: 'V01PAK',
                accountNumber: process.env.DHL_ACCOUNT_NUMBER,
                customerReference: 'Ref. 123456',
                shipmentDate: '2021-12-29',
                costCentre: '',
                ShipmentItem: {
                    weightInKG: '5',
                    lengthInCM: '60',
                    widthInCM: '60',
                    heightInCM: '60'
                },
                Service: '',
                Notification: {
                    recipientEmailAddress: 'test@test.de'
                }
            },
            Shipper: {
                Name: {
                    name1: 'Absender Zeile 1',
                    name2: 'Absender Zeile 2',
                    name3: 'Absender Zeile 3'
                },
                Address: {
                    streetName: 'Teststraße',
                    streetNumber: '111',
                    zip: '54290',
                    city: 'Trier',
                    Origin: {
                        country: 'Deutschland',
                        countryISOCode: 'DE'
                    }
                },
                Communication: {
                    phone: '1234567',
                    email: 'absender@test.de',
                    contactPerson: 'Kontakt Absender'
                }
            },
            Receiver: {
                name1: 'Empfänger Zeile 1',
                Address: {
                    name2: 'Empfänger Zeile 2',
                    name3: 'Empfänger Zeile 3',
                    streetName: 'An der Weide',
                    streetNumber: '50a',
                    zip: '54290',
                    city: 'Trier',
                    Origin: {
                        country: 'Deutschland',
                        countryISOCode: 'DE'
                    }
                },
                Communication: {
                    phone: '1234567',
                    email: 'empfänger@test.de',
                    contactPerson: 'Empfänger Absender'
                }
            }
        }
        //"PrintOnlyIfCodeable active=1": ""
    },
    labelResponseType: 'URL',
    groupProfileName: '',
    labelFormat: '',
    labelFormatRetoure: '',
    combinedPrinting: 0
};

soap.createClient(
    'https://cig.dhl.de/cig-wsdls/com/dpdhl/wsdl/geschaeftskundenversand-api/3.1/geschaeftskundenversand-api-3.1.wsdl',
    { endpoint },
    function (err, client) {
        client.setSecurity(new soap.BasicAuthSecurity(httpAuthUser, httpAuthPassword));
        client.addSoapHeader(header);
        console.log(endpoint);
        console.log('httpUser: ' + httpAuthUser);
        console.log('httpPassword:' + httpAuthPassword);
        console.log(header);
        client.createShipmentOrder(body, function (err, result, rawResponse, soapHeader, rawRequest) {
            //console.log(rawRequest);
            if (err) {
                console.warn(err.response);
            } else {
                console.log(result);
            }
        });
    }
);
