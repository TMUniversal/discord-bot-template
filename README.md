# Discord Bot Template (TypeScript)

<div>
	<p align="center">
		<a href="https://github.com/TMUniversal/discord-bot-template/blob/stable/package.json#L3">
			<img src="https://img.shields.io/badge/discord--bot--template-v0.1.1-c4c4c4.svg?style=flat" />
		</a>
		<a href="https://tmuniversal.eu/redirect/patreon">
			<img src="https://img.shields.io/badge/Patreon-support_me-fa6956.svg?style=flat&logo=patreon" />
		</a>
		<br />
		<a href="https://github.com/TMUniversal/discord-bot-template/actions">
			<img src="https://github.com/TMUniversal/discord-bot-template/workflows/Test/badge.svg" />
		</a>
		<a href="https://github.com/TMUniversal/discord-bot-template/issues">
			<img src="https://img.shields.io/github/issues/TMUniversal/discord-bot-template.svg?style=flat">
		</a>
		<a href="https://github.com/TMUniversal/discord-bot-template/graphs/contributors">
			<img src="https://img.shields.io/github/contributors/TMUniversal/discord-bot-template.svg?style=flat">
		</a>
		<a href="https://github.com/TMUniversal/discord-bot-template/blob/stable/LICENSE.md">
			<img src="https://img.shields.io/github/license/TMUniversal/discord-bot-template.svg?style=flat">
		</a>
	</p>
</div>

# Getting Started

Hosting a discord bot comes with some requirements:

## Installation

Assuming you have [Node.js](https://nodejs.org/en/download/current/) installed, install the required packages:
> Please use the latest version on Node.js, as this project is constantly keeping up to date.
> discord-bot-template is built and tested with the latest version of Node.js (as of now that is v14.4.0)

- In the project folder: `npm install`

## Setup

- Make a copy of `data.example.json`, name it `data.json`.
- Fill in the necessary values, remove the comment (since comments are not supported in JSON).
  - `owners` may be an array of strings


```JS
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

# License

discord-bot-template is released under the [MIT License](LICENSE.md).
