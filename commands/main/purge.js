const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const client = require(`discord.js`)

module.exports = class HQCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'purge',
      aliases: ['apocalypse'],
      group: 'main',
      memberName: 'purge',
      description: 'purges the channe;',
      details: oneLine `
        DESTROY IT!
			`,
      examples: ['purge'],
      args: [{
        key: 'toPurge',
        label: 'purge',
        prompt: 'how many messages?',
        type: 'string',
        infinite: false
      }],
      guildOnly: true,
      guarded: true
    })
  }

  hasPermission(msg) {
    return msg.member.hasPermission('MANAGE_MESSAGES');
  }

  async run(message, args) {
    message.channel.send("PURGING")
    message.channel.bulkDelete(args.toPurge)
    message.channel.send("PURGE COMPLETE")
  }
};