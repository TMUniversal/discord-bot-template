import { Message } from 'discord.js'
import { Listener, Command } from 'discord-akairo'
import { WebhookLogger } from '../structures/WebhookLogger'
import EventEmitterSingleton from '../structures/EventEmitterSingleton'

export default class MissingPermissionsHandler extends Listener {
  logger: WebhookLogger
  eventEmitter: EventEmitterSingleton
  constructor () {
    super('missingPermissions', {
      emitter: 'commandHandler',
      event: 'missingPermissions',
      category: 'commandHandler'
    })
    this.logger = WebhookLogger.instance
    this.eventEmitter = EventEmitterSingleton.instance
  }

  public async exec (
    message: Message,
    command: Command,
    missingFrom: string,
    missing: string[]
  ): Promise<Message> {
    return await message.util.send(
      `❗ |   ${
        missingFrom === 'client' ? 'I am' : 'You are'
      } missing the following permission${
        missing.length > 1 ? 's' : ''
      }: **${missing.join('**, **')}**`
    )
  }
}
