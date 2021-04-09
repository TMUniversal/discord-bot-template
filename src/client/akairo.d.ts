/* eslint-disable @typescript-eslint/method-signature-style */
import StatusUpdater from '@tmware/status-rotate'
import { AkairoClient } from 'discord-akairo'
import { Presence } from 'discord.js'
import EventEmitterSingleton from '../structures/EventEmitterSingleton'
import { WebhookLogger } from '../structures/WebhookLogger'
import BotClient from './BotClient'

declare module 'discord-akairo' {
  interface AkairoClient {
    commandHandler: CommandHandler
    listenerHandler: ListenerHandler
    inhibitorHandler: InhibitorHandler
    logger: WebhookLogger
    statusUpdater: StatusUpdater
    customEmitter: EventEmitterSingleton

    start(): Promise<BotClient>
    changeStatus(): Promise<Presence>
    stop(): void
  }

  interface CommandHelpInformation extends Object {
    usage?: string
    examples?: string[]
  }

  interface Command {
    help?: CommandHelpInformation
  }
}

declare module 'discord.js' {
  interface Message {
    client: AkairoClient
  }
}
