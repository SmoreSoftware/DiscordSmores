const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const client = require(`discord.js`)

module.exports = class HQCommand extends commando.Command {
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

  async run(message, args) {
    message.channel.send(`Here is a link to add me: https://discordapp.com/oauth2/authorize?client_id=${client.ClientUser.id}&scope=bot&permissions=2146958463`)
  }
};