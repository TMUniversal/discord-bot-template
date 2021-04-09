/* eslint-disable @typescript-eslint/no-base-to-string */
import StatusUpdater from '@tmware/status-rotate'
import appRootPath from 'app-root-path'
import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from 'discord-akairo'
import { ActivityOptions, Message } from 'discord.js'
import * as path from 'path'
import config from '../config'
import EventEmitterSingleton from '../structures/EventEmitterSingleton'
import { WebhookLogger } from '../structures/WebhookLogger'

export default class BotClient extends AkairoClient {
  public logger = WebhookLogger.instance
  public eventEmitter = EventEmitterSingleton.instance
  public statusUpdater: StatusUpdater = new StatusUpdater(
    this,
    'https://gist.githubusercontent.com/TMUniversal/253bd3172c3002be3e15e1152dd31bd4/raw/exampleFile.json'
  )

  public listenerHandler: ListenerHandler = new ListenerHandler(this, {
    directory: path.join(__dirname, '..', 'events')
  })

  public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
    directory: path.join(__dirname, '..', 'inhibitors')
  })

  public commandHandler: CommandHandler = new CommandHandler(this, {
    directory: path.join(__dirname, '..', 'commands'),
    prefix: config.prefix,
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
    ignoreCooldown: config.owners,
    ignorePermissions: config.owners
  })

  public constructor () {
    super({
      ownerID: config.owners
    })

    // eslint-disable-next-line no-console
    console.log('[Client]', 'Initializing...')
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
    const pathRegex = new RegExp(
      path.normalize(appRootPath.toString()).replace(/\\/g, '\\\\').replace(/\//g, '\\/'),
      'gmi'
    )

    this.on('error', async e => await this.logger.error('CLIENT', e.message))
    this.on('warn', async w => await this.logger.warn('CLIENT', w))

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
    await this.login(config.clientToken)

    // Register event handling for custom events
    this.eventEmitter.on('changeStatus', async () => await this.changeStatus())

    // Set a startup notice. This will be overridden upon ready.
    this.user.setActivity({ name: 'Starting up...', type: 'PLAYING' })

    // Automate status changes and upload stat uploads.
    this.setInterval(() => this.eventEmitter.emit('changeStatus'), 5 * 60 * 1000) // every five minutes

    return this
  }

  public async changeStatus (options?: ActivityOptions) {
    if (options) return await this.statusUpdater.updateStatus(options)
    return await this.statusUpdater.updateStatus()
  }

  public stop () {
    this.logger.warn('PROCESS', 'Received exit signal => quitting in 4 seconds...')
    this.destroy()
    setTimeout(() => {
      this.logger.warn('PROCESS', 'Exit.')
      process.exit(0)
    }, 4000)
  }
}
