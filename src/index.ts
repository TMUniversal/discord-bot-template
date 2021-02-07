import BotClient from './client/BotClient'
import configFile from './config'

const client = new BotClient({
  token: configFile.clientToken,
  owners: configFile.owners
})
client.start()
