import { EventEmitter } from 'events'

export default class EventEmitterSingleton extends EventEmitter {
  protected static _instance: EventEmitterSingleton

  public static get instance (): EventEmitterSingleton {
    return this._instance || new this()
  }

  public constructor () {
    super()
    if ((this.constructor as typeof EventEmitterSingleton)._instance) {
      throw new Error('Can not create multiple instances of singleton.')
    }

    (this.constructor as typeof EventEmitterSingleton)._instance = this

    this.emit('ready')
  }
}
