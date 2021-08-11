# For Production

You will need the following ENV config for DHL to work.

**You have to be DHL customer** (register via [link](https://www.dhl.de/de/geschaeftskunden/paket/kunde-werden/angebot-dhl-geschaeftskunden-online.html))

```
DHL_DEV=0
```
Turn off dev mode

```
DHL_ACCOUNT_NUMBER=638393895389535
```
Your customer number found [here](https://geschaeftskunden.dhl.de/frame/customeradministration/customerdataoverview)

```
DHL_USER=dhluser
DHL_PASS=dhlpassword
```
Via [this link](https://entwickler.dhl.de/group/ep/myapps) you can create your application and let it be approved by DHL.
Your appId is the DHL_USER and your token is the DHL_PASS

```
DHL_HTTP_AUTH_USER=appprod_1
DHL_HTTP_AUTH_PASS=verylonktokenstringgenrated
```
Either your account data to log into [geschaeftskunden.dhl.de](geschaeftskunden.dhl.de) or (recommended)
you create a specific user for the api via [link](https://geschaeftskunden.dhl.de/frame/customeradministration/externaluseradministration)
