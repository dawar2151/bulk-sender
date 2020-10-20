# bulk-sender

This projet generate wallets in json file, and send bulk tokens to those addresses, it can also used to consult wallet's balance.

## configuration

In order to skip MetaMask manual validation some parameters are required:

```shell
config.sm_address: smart contracts(ERC20) address when deployed
config.account_address: you account address please copy one of your Metamask account
config.node_api: past here your rinkbey/mainnet link from infura
config.private_key = copy your private key from Metamask it should be related to (account_address)
```

### `yarn`

Install required packages for the app.
### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.



