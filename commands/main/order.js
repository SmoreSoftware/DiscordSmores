const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const Discord = require('discord.js');

module.exports = class OrderCommand extends commando.Command {
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
    const collector = message.channel.createCollector(msg => msg.author === message.author, {
      time: 30000
    })
    message.channel.send('What note would you like to leave for the workers? Do \`blank\` to leave no note. This prompt times out in 30 seconds.')
    collector.on("message", (msg) => {
      if (msg.content === 'blank') collector.stop("aborted")
      else collector.stop("success")
    })
    collector.on("end", (collected, reason) => {
      if (reason === "time") return message.reply('The prompt timed out. Pleace try again.')
      if (reason === "aborted") {
        message.reply('Set note to blank.')
        const embed = new Discord.RichEmbed()
          .setAuthor(`${message.author.tag}, (${message.author.id})`, `${message.author.avatarURL}`)
          .setTitle('New order:')
          .setColor(0x0000FF)
          .addField('Order:', `${args.toOrder}`, true)
          .addField('Ordered from:', `#${message.channel.name} (${message.channel.id}) in ${message.guild.name} (${message.guild.id})`, true)
          .addField('Note:', `[No note left.]`, false)
          .setFooter(`Status: Awaiting a cook`)
          .setTimestamp()
        this.client.channels.get('329303695407841280').send({
          embed: embed
        })
        message.reply('Your order has been sent to Discord S\'mores! \nPlease note this may take up to 5 minutes to cook and deliver')
      }
      if (reason === "success") {
        let note = collected.first()
        message.reply(`Set note to "${note}"`)
        const embed = new Discord.RichEmbed()
          .setAuthor(`${message.author.tag}, (${message.author.id})`, `${message.author.avatarURL}`)
          .setTitle('New order:')
          .setColor(0x0000FF)
          .addField('Order:', `${args.toOrder}`, true)
          .addField('Ordered from:', `#${message.channel.name} (${message.channel.id}) in ${message.guild.name} (${message.guild.id})`, true)
          .addField('Note:', `${note}`, false)
          .setFooter(`Status: Awaiting a cook`)
          .setTimestamp()
        this.client.channels.get('329303695407841280').send({
          embed: embed
        })
        message.reply('Your order has been sent to Discord S\'mores! \nPlease note this may take up to 5 minutes to cook and deliver')
      }
    })
  }
};
