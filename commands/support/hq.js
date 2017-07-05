//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class HQCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'hq',
      aliases: ['server', 'helpserver', 'officialserver', 'devsserver'],
      group: 'support',
      memberName: 'hq',
      description: 'Sends an invite to the official SmoreSoftware Discord!',
      details: oneLine `
        Do you need help with Discord S'mores? Want to suggest a feature? Just want to drop by and meet the developers?
        This command sends an invite to the official SmoreSoftware Discord server.
			`,
      examples: ['hq'],
      guarded: true
    })
  }

  //eslint-disable-next-line class-methods-use-this
  async run(message) {
    message.channel.send(`**Need help?**
Come join the official Discord S'mores server!
https://discord.gg/pz5Pk5e
Come join the official SmoreSoftware Discord server!
https://discord.gg/89JttFv
Need some quick help? Call the developers!
Do \`${message.guild.commandPrefix}support\`
Want to suggest something?
Do \`${message.guild.commandPrefix}suggest\``)
  }
};
