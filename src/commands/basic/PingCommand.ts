import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class PingCommand extends Command {
  public constructor () {
    super('ping', {
      aliases: ['ping'],
      category: 'basic',
      description: 'Check latency',
      ratelimit: 3
    })

    this.help = {
      usage: 'ping',
      examples: ['ping']
    }
  }

  public async exec (message: Message): Promise<Message> {
    return await message.util.send(`Pong! ${this.client.ws.ping}ms`)
  }
}
