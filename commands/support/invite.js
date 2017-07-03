const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class InviteCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'invite',
      aliases: ['invite', 'join'],
      group: 'support',
      memberName: 'invite',
      description: 'Sends an invite for the bot',
      details: oneLine `
        sends an invite for the bot
			`,
      examples: ['support'],
      guildOnly: true,
      guarded: true
    })
  }

  async run(message) {
    message.channel.send(`Here is a link to add me: https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=8`)
  }
};
