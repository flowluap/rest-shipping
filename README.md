# rest-shipping

The goal of this repository is to provide a service to those, who are also impressed by the inability of large shipping services to provide us, developers, with rest-based, well documented, and maintained API endpoints to fetch their service in an automated way.

## Installation

```
git clone https://github.com/flowluap/rest-shipping
cd rest-shipping
npm i
cp .env.example .env
```
Now edit .env to fit your needs
```
npm start
```

## Getting started! 
- [DHL Keys](docs%20dhl%20GETKEYS.md)

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
- [ ] Cache address Status
- [ ] Google Places to correct addresses
- [ ] Service integrationtest
- [ ] Provider integration/availability - test for each provider (e.g. is service up like: https://status.jtl-shipping.de/)

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


## Available Endpoints:


- POST /v1/provider/dpd/sanitizeAddress
--> can sanitize the address according to the provider/addressSource

- POST /v1/provider/dpd/checkAddress
--> can sanitize the address according to the provider/addressSourceand AND checks if the provider will return data or errors

- POST /v1/provider/dpd/getLabel
--> requires a working address set and returns a base64 encoded pdf

See insomnia requests down below:

![Screenshot from 2021-03-20 19-33-32](https://user-images.githubusercontent.com/49984289/111882365-7205ca00-89b5-11eb-880a-f63442b82868.png)
![Screenshot from 2021-03-20 19-33-20](https://user-images.githubusercontent.com/49984289/111882367-729e6080-89b5-11eb-9a05-c11c6301ea5d.png)
![Screenshot from 2021-03-20 19-33-05](https://user-images.githubusercontent.com/49984289/111882368-729e6080-89b5-11eb-9194-ba045fbf1dfd.png)

# Why can you define an addressSource?

`sanitizeAddress` or `checkAddress` can be used with shop-specific json fields in the `recipient` object. So that you can directly pass shopify REST data to the rest-shipping-service, without any translation

Shopify has the speciality to not validate user addresses in their basic plan. So arround 15% of the addresses we imported (3k) have "address2" field set as theire houseNo, as it is the default next field for the TAB key after street. 
So if you add the `addressSource : 'shopify'` to either `sanitizeAddress` or `checkAddress` it will translate the object, but also check `address2` for houseNo if it is not present in `address1`

You can freely chain the methods to each other, as the following example states:

--> sanitize address (addressSource : 'shopify' is set) --> the addres is piped through the **shopify sanitizer** --> then through the **generic sanitizer** --> then through the **provider-parser** 
--> the sanitized address is returned (Object can be directly passed to `getLabel`)




### Authentication (http Basic auth)
Well its pretty much to not have the service exposed directly, i would consider adding an accesstoken management lateron.

- username (does not matter, as it is used to identify who is requesting data)
- password needs to be defined in the .env file (ACCESS_TOKEN)


