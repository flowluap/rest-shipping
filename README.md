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
- [ ] DPD
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


## ProviderSpecific:
