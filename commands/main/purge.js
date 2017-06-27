const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const client = require(`discord.js`)

module.exports = class PurgeCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'purge',
      aliases: ['apocalypse', `prune`],
      group: 'main',
      memberName: 'purge',
      description: 'purges the channel',
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
    message.channel.bulkDelete(args.toPurge + 2)
    await message.channel.send("PURGE COMPLETE")
  }
};
