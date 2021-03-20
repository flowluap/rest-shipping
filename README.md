# rest-shipping

The goal of this repository is to provide a service to those, who are also impressed by the inability of large shipping services to provide us, developers, with rest-based, well documented, and maintained API endpoints to fetch their service in an automated way.

Special shoutout to:

- **DPD** - who were unable to provide us with the necessary information for over 3 weeks, while we were already in production
- **DPD** - who are unable to handle consecutive whitespaces in an address and not provide fitting errors, but unclear responses
- **DPD** - who seem to not have ever heard about HTTP status codes, rather send an empty or unclear array of errors
- **DPD** - who use google places API, but nevertheless struggle to find over 5% of the addresses we send them
- **DPD** - who send you the newest (2017) API Docs via mail, but reference old documents on their developer portal
- **DPD** - who won't show you the packets, you requested via API, until you enter the tracking-number in their search - then it will be displayed to you

If things, listed above, have been fixed, feel free to remove them in a pull request. Hopefully, the named provider will fix its stuff...

## General:

- [ ] Integration-Tests
- [ ] logo to Label rendering
- [ ] Webhooks on change
- [ ] Tracking
- [ ] Integrationtest for each provider (e.g. is service up like: https://status.jtl-shipping.de/)

## Providers:
- [x] DPD (kinda working)
- [ ] DPD SOAP to be able to set sender https://esolutions.dpd.com/entwickler/dpdwebservices/sandbox_show.aspx

- [ ] DHL
- [ ] Deutsche Post
- [ ] Hermes
- [ ] UPS
- [ ] GLS
- [ ] FedEx
- [ ] TNT
- [ ] RoyalMail
- [ ] UKMail
- [ ] Transoflex
- [ ] IFTMIN


## ProviderSpecific ToDo's:

## Installation

```
git clone https://github.com/flowluap/rest-shipping
cd rest-shipping
npm i
cp .env.example .env
```
Now edit .env to fit your needs (Tokens)

```
npm start
```
## Available Endpoints:

- /v1/provider/dpd/checkAddress
--> takes the output of sanitizeAddress and checks if the provider will return data or errors

- /v1/provider/dpd/sanitizeAddress
--> can sanitize the address according to the provider and addressSource

- /v1/provider/dpd/getLabel
--> requires a working addres set

sanitize address can be used with shop-specific json fiels. Shopify has the speciality to not validate user addresses in their basic plan. So arround 15% of the addresses we imported (3k) have "address2" field set as theire houseNo, as it is the default next field for the TAB key after street. 
You can freely chain the methods to each other, as the following example states:

--> sanitize address (addressSource="shopify" is set) --> the addres is piped through the **shopify sanitizer** --> then through the **generic sanitizer** --> then through the **provider-parser** 
--> the sanitized address is returned




### Authentication (http Basic auth)
Well its pretty much to not have the service exposed directly, i would consider adding an accesstoken management lateron.

- username (does not matter, as it is used to identify who is requesting data)
- password needs to be defined in the .env file (ACCESS_TOKEN)


