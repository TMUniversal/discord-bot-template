import { AkairoClient, CommandHandler, ListenerHandler, InhibitorHandler } from 'discord-akairo'
import { User, Message, ActivityType, ActivityOptions, Presence } from 'discord.js'
import * as path from 'path'
import axios, { AxiosInstance } from 'axios'
import { WebhookLogger } from '../structures/WebhookLogger'
import configFile from '../config'
import appRootPath from 'app-root-path'
import EventEmitterSingleton from '../structures/EventEmitterSingleton'
import CounterManager from '../structures/CounterManager'
import StatusUpdater from '../structures/StatusUpdater'

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

    start (): Promise<BotClient>
    changeStatus (): Promise<Presence>
    stop (): void
  }
}

interface BotOptions {
  token?: string
  owners?: string | string[]
}

export default class BotClient extends AkairoClient {
  public config: BotOptions
  public logger: WebhookLogger
  public statusUpdater: StatusUpdater
  public eventEmitter: EventEmitterSingleton
  public counter: CounterManager

  public listenerHandler: ListenerHandler = new ListenerHandler(this, {
    directory: path.join(__dirname, '..', 'events')
  })

  public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
    directory: path.join(__dirname, '..', 'inhibitors')
  })

  public commandHandler: CommandHandler = new CommandHandler(this, {
    directory: path.join(__dirname, '..', 'commands'),
    prefix: configFile.prefix,
    allowMention: false,
    handleEdits: false,
    commandUtil: true,
    commandUtilLifetime: 60 * 1000,
    defaultCooldown: 6e3,
    argumentDefaults: {
      prompt: {
        modifyStart: (_: Message, str: string): string => `${str}\n\nType \`cancel\` to cancel this command...`,
        modifyRetry: (_: Message, str: string): string => `${str}\n\nType \`cancel\` to cancel this command...`,
        timeout: 'You have kept me waiting too long.',
        ended: 'Exceeded maximum amount of attempts, cancelling....',
        retries: 3,
        time: 3e4
      },
      otherwise: ''
    },
    ignoreCooldown: configFile.owners,
    ignorePermissions: configFile.owners
  })

  public constructor (config: BotOptions) {
    super({
      ownerID: config.owners
    })

    // eslint-disable-next-line no-console
    console.log('[Client]', 'Initializing...')

    this.eventEmitter = EventEmitterSingleton.instance
    this.counter = new CounterManager()
    this.config = config
    this.logger = WebhookLogger.instance
    this.statusUpdater = new StatusUpdater(this, 'https://gist.githubusercontent.com/TMUniversal/253bd3172c3002be3e15e1152dd31bd4/raw/exampleFile.json')
  }

  private async _init (): Promise<void> {
    this.commandHandler.useListenerHandler(this.listenerHandler)
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler)
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
      process
    })

    // Load handler sub-modules
    this.inhibitorHandler.loadAll()
    this.commandHandler.loadAll()
    this.listenerHandler.loadAll()

    // Error handlers
    // Regex to match the root path of the project. Escapes path separators on windows and linux
    // tslint:disable-next-line: tsr-detect-non-literal-regexp
    const pathRegex = new RegExp(path.normalize(appRootPath.toString()).replace(/\\/g, '\\\\').replace(/\//g, '\\/'), 'gmi')

    this.on('error', e => this.logger.error('CLIENT', e.message))
    this.on('warn', w => this.logger.warn('CLIENT', w))

    //  Process handling / do not crash on error
    process.once('SIGINT', () => this.stop())
    process.once('SIGTERM', () => this.stop())
    process.on('uncaughtException', (err: Error) => {
      const errorMsg = (err ? err.stack || err : '').toString().replace(pathRegex, '.')
      this.logger.error('EXCEPTION', errorMsg)
    })
    process.on('unhandledRejection', (err: Error) => {
      const errorMsg = (err ? err.stack || err : '').toString().replace(pathRegex, '.')
      this.logger.error('REJECTION', 'Uncaught Promise error: \n' + errorMsg)
    })
  }

  public async start (): Promise<BotClient> {
    // eslint-disable-next-line no-console
    console.log('[Bot]', 'Starting up...')
    await this._init()
    await this.login(this.config.token)

    // Register event handling for custom events
    this.eventEmitter.on('changeStatus', () => this.changeStatus())

    // Set a startup notice. This will be overridden upon ready.
    this.user.setActivity({ name: 'Starting up...', type: 'PLAYING' })

    // Automate status changes and upload stat uploads.
    this.setInterval(() => this.eventEmitter.emit('changeStatus'), 5 * 60 * 1000) // every five minutes

    return this
  }

  public async changeStatus (options?: ActivityOptions) {
    if (options) return this.statusUpdater.updateStatus(options)
    return this.statusUpdater.updateStatus()
  }

  public stop () {
    this.logger.warn('PROCESS', 'Received exit signal => quitting in 4 seconds...')
    this.destroy()
    this.counter.destroy()
    setTimeout(() => {
      this.logger.warn('PROCESS', 'Exit.')
      process.exit(0)
    }, 4000)
  }
}
