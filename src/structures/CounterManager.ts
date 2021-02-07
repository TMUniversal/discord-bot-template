import Counter from '@tmuniversal/counter'
import countapi from 'countapi-js'
import { EventEmitter } from 'events'
import config from '../config'
import { WebhookLogger } from './WebhookLogger'

enum UpdateType {
  some
}

export default class CounterManager {
  private readonly eventEmitter: EventEmitter
  private readonly logger: WebhookLogger
  private readonly someCounter: Counter
  // eslint-disable-next-line no-undef
  private readonly updateInterval: NodeJS.Timeout

  public constructor () {
    this.logger = WebhookLogger.instance

    this.eventEmitter = new EventEmitter()

    this.someCounter = new Counter(0)

    this.logger.silly('CounterManager', 'Initializing counter...')

    // periodically post updates

    this.updateInterval = setInterval(() => {
      this.eventEmitter.emit('postUpdates')
    }, 5 * 60 * 1000)

    // Event handlers

    this.eventEmitter.on('incSome', amount =>
      this.someCounter.increment(amount)
    )

    this.eventEmitter.on('postUpdates', () => this.postUpdates())

    this.eventEmitter.on('ready', async () => {
      this.logger.silly('CounterManager', 'Ready.')
      this.logger.debug(
        'CounterManager',
        'API Data:',
        `Somes: ${await this.getSomeCount()}`
      )
    })

    this.eventEmitter.emit('ready')
  }

  public async getSomeCount () {
    try {
      return (
        await countapi.get(config.counter.namespace, config.counter.someKey)
      ).value
    }
    catch (err) {
      this.logger.error('CountAPI', err || new Error())
      throw err || new Error()
    }
  }

  public postUpdates () {
    this.logger.debug(
      'CounterManager',
      'Uploading counts\n',
      `some: ${this.someCounter}`
    )
    try {
      this._updateSomeCount(this.someCounter.value).then(() =>
        this.someCounter.reset()
      )
    }
    catch (err) {
      this.logger.error('CounterManager', err || new Error())
      throw err || new Error()
    }
  }

  public updateSomeCount (amount: number = 1) {
    if (amount === 0) return this.someCounter.value
    return this.someCounter.increment(amount)
  }

  public async _updateSomeCount (amount: number) {
    try {
      return await this._updateCount(amount, config.counter.someKey)
    }
    catch (err) {
      this.logger.error('CountAPI', err || new Error())
      throw err || new Error()
    }
  }

  public async _updateCount (
    amount: number,
    key: string,
    type: UpdateType = UpdateType.some
  ) {
    if (amount === 0) {
      return await this.logger.silly('CounterManager', 'Delta is 0, passing.')
    }
    try {
      this.logger.silly('CountAPI', `Updating type ${type}: adding ${amount}`)
      return await this._update(config.counter.namespace, key, amount)
    }
    catch (err) {
      try {
        return await this._create(
          key,
          config.counter.namespace,
          amount,
          true,
          0,
          type === UpdateType.some ? 50 : 1
        )
      }
      catch (err) {
        this.logger.error('CountAPI', err || new Error())
        throw err || new Error()
      }
    }
  }

  private async _update (
    namespace: string,
    key: string,
    amount: number
  ): Promise<Object> {
    return await countapi.update(namespace, key, amount)
  }

  private async _create (
    key: string,
    namespace: string,
    value = 0,
    enableReset = true,
    updateLowerbound = -1,
    updateUpperbound = 1
  ): Promise<Object> {
    return await countapi.create({
      key,
      namespace,
      value,
      enable_reset: enableReset,
      update_lowerbound: updateLowerbound,
      update_upperbound: updateUpperbound
    })
  }

  public destroy () {
    this.logger.silly('CounterManager', 'Exiting...')
    clearInterval(this.updateInterval)
    this.eventEmitter.emit('postUpdates')
  }
}
