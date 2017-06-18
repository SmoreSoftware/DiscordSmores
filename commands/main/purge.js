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
      guildOnly: true,
      guarded: true
    })
  }

  hasPermission(msg) {
    return msg.member.hasPermission('MANAGE_MESSAGES');
  }

  async run(message, args) {
    message.channel.send("PURGING")
    let messagecount = parseInt(args[0]);
    message.channel.fetchMessages({
        limit: 100
      })
      .then(messages => {
        let msg_array = messages.array();
        msg_array.length = messagecount + 1;
        msg_array.map(m => m.delete().catch(console.error));
      });
    message.channel.send("PURGE COMPLETE")
  }
};