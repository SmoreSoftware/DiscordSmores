const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const Discord = require('discord.js');

module.exports = class HQCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'menu',
      aliases: [`itemlist`],
      group: 'main',
      memberName: 'menu',
      description: 'Lists items you can order',
      details: oneLine `
        list of items you can order!
			`,
      examples: ['menu'],
      guarded: true
    })
  }

  async run(message, args) {
    const embed = new Discord.RichEmbed()
      .setAuthor(`Menu`, `${this.client.user.avatarURL}`)
      .setColor(0x0000FF)
      .setDescription(`__**Menu**__\n*S\'mores- Any kind of S\'mores\nDonuts - Any kind of Donuts*\n__**Drinks**__\n*Coffee - Any flavor of coffee\nMilk - milk duh.\nWater - Basic, Normal, Water.*`)
      .setFooter(`Requested by: ${message.author.username}`)
      .setTimestamp()
    await message.channel.send({
      embed
    })
  }
};

