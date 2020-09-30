import {
  CommandHandler,
  ListenerHandler,
  InhibitorHandler
} from 'discord-akairo'
import StatusUpdater from '@tmware/status-rotate'
import { Presence } from 'discord.js'
import EventEmitterSingleton from '../structures/EventEmitterSingleton'
import { WebhookLogger } from '../structures/WebhookLogger'
import CounterManager from '../structures/CounterManager'
import BotClient, { BotOptions } from './BotClient'

declare module 'discord-akairo' {
  interface AkairoClient {
    commandHandler: CommandHandler
    listenerHandler: ListenerHandler
    inhibitorHandler: InhibitorHandler
    config: BotOptions
    logger: WebhookLogger
    statusUpdater: StatusUpdater
    customEmitter: EventEmitterSingleton
    counter: CounterManager

    start(): Promise<BotClient>
    changeStatus(): Promise<Presence>
    stop(): void
  }
}
