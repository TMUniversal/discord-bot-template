import { Command, Listener } from 'discord-akairo'
import { Message } from 'discord.js'
import { WebhookLogger } from '../structures/WebhookLogger'

export default class CommandLoggerListener extends Listener {
  logger: WebhookLogger
  constructor () {
    super('commandStarted', {
      emitter: 'commandHandler',
      event: 'commandStarted',
      category: 'commandHandler'
    })
    this.logger = WebhookLogger.instance
  }

  public async exec (message: Message, command: Command, args?: any): Promise<void> {
    return await this.logger.info('Command Issued', `in ${!message.guild ? 'DMs' : 'a guild'} > ${command.id}`)
  }
}
