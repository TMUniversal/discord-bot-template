/**
 * @author Hydractify
 * @see https://github.com/Hydractify/kanna_kobayashi
 */
import { MessageAttachment, WebhookClient, WebhookMessageOptions } from 'discord.js'

import { colors, LogLevel } from '../types/LogLevel'
import { Logger } from './Logger'
import { MessageEmbed } from './MessageEmbed'
import configFile from '../config'

const webhook: WebhookClient = new WebhookClient(configFile.webhook.id, configFile.webhook.secret)

export class WebhookLogger extends Logger {
  protected static _instance: WebhookLogger

  public static get instance (): WebhookLogger {
    return this._instance || new this()
  }

  private readonly _webhookLevel: LogLevel = LogLevel.SILLY

  protected _write (level: LogLevel, tag: string, data: any[]): void {
    super._write(level, `Webhook][${tag}`, data)
    if (this._webhookLevel < level) return

    const cleaned: string = this._prepareText(data)

    const embed: MessageEmbed = new MessageEmbed().setTimestamp().setColor(colors[level][2]).setFooter(this._processTag)
    const options: WebhookMessageOptions = {
      avatarURL: 'https://vignette.wikia.nocookie.net/avatar/images/1/1f/Joo_Dee.png/revision/latest?cb=20140422090643',
      embeds: [embed],
      username: '"Discord Bot" Status'
    }

    if (cleaned.length <= 2048) {
      embed.setDescription(cleaned)
    }
    else {
      embed.setDescription('Data is too long, falling back to file.')
      options.files = [new MessageAttachment(Buffer.from(cleaned), 'file.txt')]
    }

    if (tag) embed.setTitle(tag)

    webhook
      .send(options)
      // Message is still in the console
      .catch(() => undefined)
  }
}
