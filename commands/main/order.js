const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const Discord = require('discord.js');

module.exports = class SuggestCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'order',
      group: 'main',
      memberName: 'order',
      description: 'order something from discord smores!',
      details: oneLine `
        order smores or other food from Discord S'mores!
			`,
      examples: ['order Radioactive Smore'],
      args: [{
        key: 'toOrder',
        label: 'order',
        prompt: 'What would you like to order?',
        type: 'string',
        infinite: false
      }],
      guarded: true
    })
  }

  async run(message, args) {
    const embed = new Discord.RichEmbed()
      .setAuthor(`${message.author.tag}`, `${message.author.avatarURL}`)
      .setColor(0x0000FF)
      .setDescription(`${args.toOrder}`)
      .setFooter(`Order from: ${message.author.username} in ${message.guild.name}`)
      .setTimestamp()
    this.client.channels.get('329303695407841280').send({embed: embed})
  }
};