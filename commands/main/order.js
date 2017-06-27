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
        let orderAuth = message.author
        let orderChan = message.channel
        let orderGuild = message.guild
        message.reply('Your order has been sent to Discord S\'mores! \nPlease note this may take up to 7 minutes to cook and deliver')
        this.client.channels.get('329303695407841280').send({
          embed: embed
        }).then((message) => {

          let min = 1
          let max = 3

          function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
          }

          let time = getRandomInt(min, max)
          time += '0000'
          time = parseInt(time)
          console.log(time)
          setTimeout(cook, time)

          function cook() {
            const embed = new Discord.RichEmbed()
              .setAuthor(`${orderAuth.tag}, (${orderAuth.id})`, `${orderAuth.avatarURL}`)
              .setTitle('New order:')
              .setColor(0x0000FF)
              .addField('Order:', `${args.toOrder}`, true)
              .addField('Ordered from:', `#${orderChan.name} (${orderChan.id}) in ${orderGuild.name} (${orderGuild.id})`, true)
              .addField('Note:', `${note}`, false)
              .setFooter(`Status: Cooking`)
              .setTimestamp()
            message.edit({
              embed: embed
            })

            let chef = ['Bob#1234',
              'MellissaGamer#4076',
              'ILoveSmores#3256',
              'CoolDeveloper#4035',
              'YoMomma#9693'
            ]
            chef = chef[Math.floor(Math.random() * chef.length)]
            orderAuth.send(`Your order has been put in the oven by chef ${chef}`)
            orderAuth.send('Cooking will take 3 minutes.')
            setTimeout(deliver, 160000)
          }

          function deliver() {
            const embed = new Discord.RichEmbed()
              .setAuthor(`${orderAuth.tag}, (${orderAuth.id})`, `${orderAuth.avatarURL}`)
              .setTitle('New order:')
              .setColor(0x0000FF)
              .addField('Order:', `${args.toOrder}`, true)
              .addField('Ordered from:', `#${orderChan.name} (${orderChan.id}) in ${orderGuild.name} (${orderGuild.id})`, true)
              .addField('Note:', `${note}`, false)
              .setFooter(`Status: Cooked`)
              .setTimestamp()
            message.edit({
              embed: embed
            })
            orderAuth.send('Your order has been cooked and will be delivered soon!')

            function getRandomInt2(min, max) {
              min = Math.ceil(min);
              max = Math.floor(max);
              return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
            }
            let time2 = getRandomInt2(min, max)
            time2 += '0000'
            time2 = parseInt(time)
            console.log(time2)

            setTimeout(sendToCustomer, time2)

            function sendToCustomer() {
              message.delete()
              orderAuth.send('Your order should be arriving now!')
              orderChan.send(`${orderAuth} Your order has arrived!`)
            }
          }
        })
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
        let orderAuth = message.author
        let orderChan = message.channel
        let orderGuild = message.guild
        message.reply('Your order has been sent to Discord S\'mores! \nPlease note this may take up to 7 minutes to cook and deliver')
        let ordersChan = this.client.channels.get('329303695407841280')
        ordersChan.send({
          embed: embed
        }).then((message) => {

          let min = 1
          let max = 3

          function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
          }

          let time = getRandomInt(min, max)
          time += '0000'
          time = parseInt(time)
          console.log(time)
          setTimeout(cook, time)

          function cook() {
            const embed = new Discord.RichEmbed()
              .setAuthor(`${orderAuth.tag}, (${orderAuth.id})`, `${orderAuth.avatarURL}`)
              .setTitle('New order:')
              .setColor(0x0000FF)
              .addField('Order:', `${args.toOrder}`, true)
              .addField('Ordered from:', `#${orderChan.name} (${orderChan.id}) in ${orderGuild.name} (${orderGuild.id})`, true)
              .addField('Note:', `${note}`, false)
              .setFooter(`Status: Cooking`)
              .setTimestamp()
            message.edit({
              embed: embed
            })

            let chef = ['Bob#1234',
              'MellissaGamer#4076',
              'ILoveSmores#3256',
              'CoolDeveloper#4035',
              'YoMomma#9693'
            ]
            chef = chef[Math.floor(Math.random() * chef.length)]
            orderAuth.send(`Your order has been put in the oven by chef ${chef}`)
            orderAuth.send('Cooking will take 3 minutes.')
            setTimeout(deliver, 160000)
          }

          function deliver() {
            const embed = new Discord.RichEmbed()
              .setAuthor(`${orderAuth.tag}, (${orderAuth.id})`, `${orderAuth.avatarURL}`)
              .setTitle('New order:')
              .setColor(0x0000FF)
              .addField('Order:', `${args.toOrder}`, true)
              .addField('Ordered from:', `#${orderChan.name} (${orderChan.id}) in ${orderGuild.name} (${orderGuild.id})`, true)
              .addField('Note:', `${note}`, false)
              .setFooter(`Status: Cooked`)
              .setTimestamp()
            message.edit({
              embed: embed
            })
            orderAuth.send('Your order has been cooked and will be delivered soon!')

            function getRandomInt2(min, max) {
              min = Math.ceil(min);
              max = Math.floor(max);
              return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
            }
            let time2 = getRandomInt2(min, max)
            time2 += '0000'
            time2 = parseInt(time)
            console.log(time2)

            setTimeout(sendToCustomer, time2)

            function sendToCustomer() {
              message.delete()
              orderAuth.send('Your order should be arriving now!')
              orderChan.send(`${orderAuth} Your order has arrived!`)
            }
          }
        })
      }
    })
  }
};