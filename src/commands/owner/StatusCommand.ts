import { Command } from 'discord-akairo'
import { Activity, Message } from 'discord.js'

export default class StatusCommand extends Command {
  public constructor () {
    super('status', {
      aliases: ['status'],
      category: 'owner',
      description: "Set the bot's status",
      ratelimit: 3,
      args: [
        {
          id: 'status',
          type: 'string',
          default: '',
          match: 'rest',
          description: 'The status message'
        }
      ],
      ownerOnly: true
    })

    this.help = {
      usage: 'status [message]',
      examples: ['status', 'status [Hello there]']
    }
  }

  public async exec (message: Message, args: { status: string }) {
    let newStatus: Activity
    if (!args.status || args.status === '' || args.status == null) {
      newStatus = (await this.client.statusUpdater.updateStatus()).activities[0]
    }
    else {
      newStatus = (await this.client.statusUpdater.updateStatus({ name: args.status })).activities[0]
    }
    return await message.util.send(`Status changed to: \`${newStatus.type} ${newStatus.name}\``)
  }
}
