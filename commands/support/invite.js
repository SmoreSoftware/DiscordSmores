//eslint-disable-next-line
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
        Do you like Discord S'mores? Do you want it on your very own server?
        This command sends an invite to the bot so you can spread the Smore love!
			`,
      examples: ['invite'],
      guildOnly: true,
      guarded: true
    })
  }

  async run(message) {
    message.channel.send(`Here is a link to add me: https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=8`)
  }
};
