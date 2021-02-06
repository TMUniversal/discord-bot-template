import { Command } from 'discord-akairo'
import { Message } from 'discord.js'

export default class PingCommand extends Command {
  public constructor () {
    super('ping', {
      aliases: ['ping'],
      category: 'basic',
      description: 'Check latency',
      help: {
        usage: 'ping',
        examples: ['ping']
      },
      ratelimit: 3
    })
  }

  public async exec (message: Message): Promise<Message> {
    return await message.util.send(`Pong! ${this.client.ws.ping}ms`)
  }
}
