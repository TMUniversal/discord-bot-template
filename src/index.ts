/* eslint-disable */
require('dotenv').config()

import BotClient from './client/BotClient'

const client = new BotClient()
client.start()
