# Discord Bot Template (TypeScript)

![Test](https://github.com/TMUniversal/discord-bot-template/workflows/Test/badge.svg)

## Installation

Assuming you have [npm](https://nodejs.org/en/download/current/) or [yarn](https://classic.yarnpkg.com/en/docs/install/) installed, run the respective installer:

- For npm: `npm install`

- For yarn: `yarn`

## Setup

- Make a copy of `data.example.json`, name it `data.json`.
- Fill in the necessary values, remove the comment (since comments are not supported in JSON).
  - `owners` may be an array of strings


```JSON
  {
    "clientToken": "<Discord Bot Token>",
    "webhook": {
      "id": "",
      "secret": ""
    },
    "botstatToken": "<Token>",  // Closed API. Request key (more info on website) or leave empty
    "prefix": ">",
    "owners": "<Your Discord ID>",
    // OR
    "owners": ["<Your Discord ID>", "<Another Discord ID>"]
  }
```

## Starting

To start the bot, it must first be complied.

- Run `npm run build`
- You may then start with `npm start` or, if you have pm2 installed: `pm2 start pm2-start.json`
- Alternatively: Run `npm run cs` to build and then start.

`npm run startmon` will launch the bot in monitor mode, i.e. it will reload anytime you save a file.

# Credits

Credits to [Hydractify](https://github.com/Hydractify/kanna_kobayashi) for their logging system.
