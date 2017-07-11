//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class InviteCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'invite',
      aliases: ['addbot'],
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

  //eslint-disable-next-line class-methods-use-this
  async run(message) {
    message.channel.send('Here is a link to add me: https://discordapp.com/oauth2/authorize?permissions=388169&scope=bot&client_id=325041838748860418')
  }
};
