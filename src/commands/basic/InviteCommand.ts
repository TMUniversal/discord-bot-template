import { Command } from 'discord-akairo'
import { Message } from 'discord.js'
import { MessageEmbed } from '../../structures/MessageEmbed'

export default class InviteCommand extends Command {
  public constructor () {
    super('invite', {
      aliases: ['invite'],
      category: 'basic',
      description: 'Generate an invite link for the bot.',
      ratelimit: 3
    })

    this.help = {
      usage: 'invite',
      examples: ['invite']
    }
  }

  public async exec (message: Message): Promise<Message> {
    return await message.util.send(
      MessageEmbed.common({ author: message.member.user })
        // Update the permissions your bot needs in the invite link below
        .setDescription(
          `[Add me to your server](https://discord.com/api/oauth2/authorize?client_id=${this.client.user.id}&permissions=8&scope=bot)`
        )
    )
  }
}
