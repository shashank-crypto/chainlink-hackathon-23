# Youtube Donations Chainlink Functions Quick Start

## Requirements

- Node.js version [18](https://nodejs.org/en/download/)

## Steps

1. Clone this repository to your local machine.<br><br>
2. Open this directory in your command line, then run `npm install` to install all dependencies.<br><br>
3. Set the required environment variables.
   1. Set an encryption password for your environment variables to a secure password by running:<br>`npx env-enc set-pw`<br>
   2. Use the command `npx env-enc set` to set the required environment variables:
      - _POLYGON_MUMBAI_RPC_URL_ from RPC provider like alchemy or infura (https://www.alchemy.com/dapps/alchemy)
      - _PRIVATE_KEY_ private key to your development wallet
      - _YOUTUBE_API_KEY_ obtained from https://console.developers.google.com/
        - Go to https://console.developers.google.com/
        - Sign in or create a new account
        - Click on "Enable APIs and Services."
        - Search for "Youtube Data API v3" and enable it.
        - Go to the "Credentials" tab and create a new API key.<br><br>
4. Set constants in helper-hardhat-config.js 
    - Use `const YOUTUBE_USERNAME = "Masampso"` and `const ETHEREUM_ADDRESS = "0x8C48ff0F9af301Ae5F00541Fa00b2D8796C42196"` for quick testing<br><br>
5. Set requiredStringIncluded in Functions-request-source.js to target different Youtube Videos
    - Use `const requiredStringIncluded = "This video accepts donations at ${ethereumAddress}"` for quick testing<br><br>
6. run `npx hardhat functions-simulate` to make an api call to youtube and simulate the response in the sandbox<br><br>

## This was built with Chainlink Functions Starter Kit

Please refer to the original repo for more commands and documentation: https://github.com/smartcontractkit/functions-hardhat-starter-kit



