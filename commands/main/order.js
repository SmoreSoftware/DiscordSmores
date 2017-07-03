//eslint-disable-next-line
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
      examples: ['order smore 1'],
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

    /*i know this is terrible coding practice and I should be stoned
    I'm bad, get over it
    Also please do stone me to death I would gladly be put out of my misery
    Life is misery, existance is pain*/

    let menu = ['smores 1', 's\'mores 1', 'smore 1', 's\'more 1', 'smores 2', 's\'mores 2', 'smore 2', 's\'more 2', 'smores 3', 's\'mores 3', 'smore 3', 's\'more 3', 'smores 4', 's\'mores 4', 'smore 4', 's\'more 4',
      'smores 5', 's\'mores 5', 'smore 5', 's\'more 5', 'smores 6', 's\'mores 6', 'smore 6', 's\'more 6', 'donut 1', 'donuts 1', 'donut 2', 'donuts 2', 'donut 3', 'donuts 3', 'donut 4', 'donuts 4', 'donut 5', 'donuts 5',
      'donut 6', 'donuts 6', 'donut 7', 'donuts 7', 'drink 1', 'drinks 1', 'beverage 1', 'beverages 1', 'drink 2', 'drinks 2', 'beverage 2', 'beverages 2', 'drink 3', 'drinks 3', 'beverage 3', 'beverages 3', 'drink 4',
      'drinks 4', 'beverage 4', 'beverages 4', 'drink 5', 'drinks 5', 'beverage 5', 'beverages 5'
    ]
    if (!menu.includes(args.toOrder.toLowerCase())) return message.reply(`Please order a menu item! Do \`${message.guild.commandPrefix}menu\` to see the menu.`)
    const collector = message.channel.createCollector(msg => msg.author === message.author, {
      time: 30000
    })
    //eslint-disable-next-line no-useless-escape
    message.channel.send('What note would you like to leave for the workers? Do \`blank\` to leave no note. This prompt times out in 30 seconds.')
    collector.on('message', (msg) => {
      if (msg.content === 'blank') collector.stop('aborted')
      else collector.stop('success')
    })
    collector.on('end', (collected, reason) => {
      if (reason === 'time') return message.reply('The prompt timed out. Pleace try again.')
      if (reason === 'aborted') {
        message.reply('Set note to blank.')
        const embed = new Discord.RichEmbed()
          .setAuthor(`${message.author.tag}, (${message.author.id})`, `${message.author.avatarURL}`)
          .setTitle('New order:')
          .setColor(0x0000FF)
          .addField('Order:', `${args.toOrder}`, true)
          .addField('Ordered from:', `#${message.channel.name} (${message.channel.id}) in ${message.guild.name} (${message.guild.id})`, true)
          .addField('Note:', '[No note left.]', false)
          .setFooter('Status: Awaiting a cook')
          .setTimestamp()
        let orderAuth = message.author
        let orderChan = message.channel
        let orderGuild = message.guild
        message.reply('Your order has been sent to Discord S\'mores! \nPlease note this may take up to 7 minutes to cook and deliver')
        this.client.channels.get('329303695407841280').send({
            embed: embed
          })
          .then((message) => {

            let min = 1
            let max = 3

            function getRandomInt(min, max) {
              min = Math.ceil(min);
              max = Math.floor(max);

              return Math.floor(Math.random() * (max - min)) + min;
            }

            let time = getRandomInt(min, max)
            time += '0000'
            time = parseInt(time)
            console.log(time)
            //eslint-disable-next-line no-use-before-define
            setTimeout(cook, time)

            function cook() {
              const embed = new Discord.RichEmbed()
                .setAuthor(`${orderAuth.tag}, (${orderAuth.id})`, `${orderAuth.avatarURL}`)
                .setTitle('New order:')
                .setColor(0x0000FF)
                .addField('Order:', `${args.toOrder}`, true)
                .addField('Ordered from:', `#${orderChan.name} (${orderChan.id}) in ${orderGuild.name} (${orderGuild.id})`, true)
                //eslint-disable-next-line no-undef
                .addField('Note:', `${note}`, false)
                .setFooter('Status: Cooking')
                .setTimestamp()
              message.edit({
                embed: embed
              })

              let chef = ['Bob#1234',
                'MellissaGamer#4076',
                'ILoveSmores#3256',
                'CoolDeveloper#4035',
                'YoMomma#9693',
                'SpaceX#0276',
                'jdenderplays#2316',
                'ROM Typo#9462',
                'TJDoesCode#6088',
                'Chronomly6#8108',
                'SmoreBot#0560'
              ]
              chef = chef[Math.floor(Math.random() * chef.length)]
              orderAuth.send(`Your order has been put in the oven by chef ${chef}`)
              orderAuth.send('Cooking will take 3 minutes.')
              //eslint-disable-next-line no-use-before-define
              setTimeout(deliver, 160000)
            }

            function deliver() {
              const embed = new Discord.RichEmbed()
                .setAuthor(`${orderAuth.tag}, (${orderAuth.id})`, `${orderAuth.avatarURL}`)
                .setTitle('New order:')
                .setColor(0x0000FF)
                .addField('Order:', `${args.toOrder}`, true)
                .addField('Ordered from:', `#${orderChan.name} (${orderChan.id}) in ${orderGuild.name} (${orderGuild.id})`, true)
                //eslint-disable-next-line no-undef
                .addField('Note:', `${note}`, false)
                .setFooter('Status: Cooked')
                .setTimestamp()
              message.edit({
                embed: embed
              })
              orderAuth.send('Your order has been cooked and will be delivered soon!')

              function getRandomInt2(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);

                return Math.floor(Math.random() * (max - min)) + min;
              }
              let time2 = getRandomInt2(min, max)
              time2 += '0000'
              time2 = parseInt(time)
              console.log(time2)

              //eslint-disable-next-line no-use-before-define
              setTimeout(sendToCustomer, time2)

              function sendToCustomer() {
                message.delete()
                orderAuth.send('Your order should be arriving now!')
                orderChan.send(`${orderAuth} Your order has arrived!`)
              }
            }
          })
      }
      if (reason === 'success') {
        let note = collected.first()
        message.reply(`Set note to "${note}"`)
        const embed = new Discord.RichEmbed()
          .setAuthor(`${message.author.tag}, (${message.author.id})`, `${message.author.avatarURL}`)
          .setTitle('New order:')
          .setColor(0xFF4000)
          .addField('Order:', `${args.toOrder}`, true)
          .addField('Ordered from:', `#${message.channel.name} (${message.channel.id}) in ${message.guild.name} (${message.guild.id})`, true)
          .addField('Note:', `${note}`, false)
          .setFooter('Status: Awaiting a cook')
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

            return Math.floor(Math.random() * (max - min)) + min; //the maximum is exclusive and the minimum is inclusive
          }

          let time = getRandomInt(min, max)
          time += '0000'
          time = parseInt(time)
          console.log(time)
          //eslint-disable-next-line no-use-before-define
          setTimeout(cook, 0) //time)

          function cook() {
            const embed = new Discord.RichEmbed()
              .setAuthor(`${orderAuth.tag}, (${orderAuth.id})`, `${orderAuth.avatarURL}`)
              .setTitle('New order:')
              .setColor(0xFFCC00)
              .addField('Order:', `${args.toOrder}`, true)
              .addField('Ordered from:', `#${orderChan.name} (${orderChan.id}) in ${orderGuild.name} (${orderGuild.id})`, true)
              .addField('Note:', `${note}`, false)
              .setFooter('Status: Cooking')
              .setTimestamp()
            message.edit({
              embed: embed
            })

            let chef = ['Bob#1234',
              'MellissaGamer#4076',
              'ILoveSmores#3256',
              'CoolDeveloper#4035',
              'YoMomma#9693',
              'SpaceX#0276',
              'jdenderplays#2316',
              'ROM Typo#9462',
              'TJDoesCode#6088',
              'Chronomly6#8108',
              'SmoreBot#0560'
            ]
            chef = chef[Math.floor(Math.random() * chef.length)]
            orderAuth.send(`Your order has been put in the oven by chef ${chef}`)
            orderAuth.send('Cooking will take 3 minutes.')
            //eslint-disable-next-line no-use-before-define
            setTimeout(deliver, 0) //160000)
          }

          function deliver() {
            const embed = new Discord.RichEmbed()
              .setAuthor(`${orderAuth.tag}, (${orderAuth.id})`, `${orderAuth.avatarURL}`)
              .setTitle('New order:')
              .setColor(0x00CC00)
              .addField('Order:', `${args.toOrder}`, true)
              .addField('Ordered from:', `#${orderChan.name} (${orderChan.id}) in ${orderGuild.name} (${orderGuild.id})`, true)
              .addField('Note:', `${note}`, false)
              .setFooter('Status: Cooked')
              .setTimestamp()
            message.edit({
              embed: embed
            })
            orderAuth.send('Your order has been cooked and will be delivered soon!')

            function getRandomInt2(min, max) {
              min = Math.ceil(min);
              max = Math.floor(max);

              return Math.floor(Math.random() * (max - min)) + min; //the maximum is exclusive and the minimum is inclusive
            }
            let time2 = getRandomInt2(min, max)
            time2 += '0000'
            time2 = parseInt(time)
            console.log(time2)

            //eslint-disable-next-line no-use-before-define
            setTimeout(sendToCustomer, 0) //time2)

            function sendToCustomer() {
              let smores = ['https://busyfoodie.files.wordpress.com/2015/02/dsc01984.jpg',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-n2VlKwdEbHH9xbRh_LZAhjCVa9VFspdIGzHNJyzT6YatArSE2Q',
                'https://cdn.farmersalmanac.com/wp-content/uploads/2013/08/mmm-smore-420x240.jpg',
                'http://cookingwithcurls.com/wp-content/uploads/2015/07/Outdoor-Smores-with-Homemade-Peanut-Butter-perfectly-charred-marshmallows-and-Hersheys-chocolate-bars-cookingwithcurls.com-LetsMakeSmores-Ad.jpg',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUK6T-2tPjXpgs9cITVGxqsQ4nRQ-jSDh-QCgrlPsdclA2W5rg https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9KNWVBLj6Ds0ay0KVqQ-ei6n5o9a-aITuBdGb8QUpI7-MXK9r'
              ]
              let donuts = ['http://i.imgur.com/hUogZJF.jpg',
                'http://wdy.h-cdn.co/assets/cm/15/09/54ef9111b81cb_-_chocolate-glazed-yeast-doughnuts-recipe-wdy1012-de.jpg',
                'https://previews.123rf.com/images/stootsy/stootsy1204/stootsy120400089/13335065-Close-up-picture-of-a-strawberry-donut-on-a-white-background-Stock-Photo.jpg',
                'https://www.krispykreme.com/SharedContent/User/fe/fe4179e6-dd6a-4047-8a35-1990f95885c0.png',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhcFw5Sr7IwsvV2U2UqjIV24JG59CLWwGW6Bk7EEETkNVaWNT9IA',
                'https://s-media-cache-ak0.pinimg.com/736x/d3/f6/06/d3f6068348a5c3e3d23ef8678cfa990e--single-quotes-funny-single-life-humor.jpg'
              ]
              let drinks = ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAwI9Db5c-fxdBiWn-ErVO2m3zzp96Cdgtv8f2iznymYhrK8CZcQ',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOTLkelJm9DpeR-7vXPejvhJCscxoGU6krzow-zHI-ZWcuFF5csQ',
                'http://www.newhealthadvisor.com/images/1HT19185/soy-milk.gif',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx3XE9LKfTGrppEV0oMcAejRwqAwMDAgOqEVDqtrwSVavqM0CDpA',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhtwJK3rKLac82kKQJIqsOH9vW43aH4BK6v5tkP90uBUn3UylbevOXDpc'
              ]

              message.delete()
              orderAuth.send('Your order should be arriving now!')
              if (args.toOrder.toLowerCase().includes('smore 1') || args.toOrder.toLowerCase().includes('s\'more 1') || args.toOrder.toLowerCase().includes('smores 1') || args.toOrder.toLowerCase().includes('s\'mores 1')) {
                orderChan.send(`${orderAuth} Your order has arrived!`)
                orderChan.send(smores[0])
              } else if (args.toOrder.toLowerCase().includes('smore 2') || args.toOrder.toLowerCase().includes('s\'more 2') || args.toOrder.toLowerCase().includes('smores 2') || args.toOrder.toLowerCase().includes('s\'mores 2')) {
                orderChan.send(`${orderAuth} Your order has arrived!`)
                orderChan.send(smores[1])
              } else if (args.toOrder.toLowerCase().includes('smore 3') || args.toOrder.toLowerCase().includes('s\'more 3') || args.toOrder.toLowerCase().includes('smores 3') || args.toOrder.toLowerCase().includes('s\'mores 3')) {
                orderChan.send(`${orderAuth} Your order has arrived!`)
                orderChan.send(smores[2])
              } else if (args.toOrder.toLowerCase().includes('smore 4') || args.toOrder.toLowerCase().includes('s\'more 4') || args.toOrder.toLowerCase().includes('smores 4') || args.toOrder.toLowerCase().includes('s\'mores 4')) {
                orderChan.send(`${orderAuth} Your order has arrived!`)
                orderChan.send(smores[3])
              } else if (args.toOrder.toLowerCase().includes('smore 5') || args.toOrder.toLowerCase().includes('s\'more 5') || args.toOrder.toLowerCase().includes('smores 5') || args.toOrder.toLowerCase().includes('s\'mores 5')) {
                orderChan.send(`${orderAuth} Your order has arrived!`)
                orderChan.send(smores[4])
              } else if (args.toOrder.toLowerCase().includes('smore 6') || args.toOrder.toLowerCase().includes('s\'more 6') || args.toOrder.toLowerCase().includes('smores 6') || args.toOrder.toLowerCase().includes('s\'mores 6')) {
                smores = smores[Math.floor(Math.random() * smores.length)]
                orderChan.send(`${orderAuth} Your order has arrived!`)
                orderChan.send(smores)
              } else if (args.toOrder.toLowerCase().includes('donut 1') || args.toOrder.toLowerCase().includes('donuts 1')) {
                orderChan.send(`${orderAuth} Your order has arrived!`)
                orderChan.send(donuts[0])
              } else if (args.toOrder.toLowerCase().includes('donut 2') || args.toOrder.toLowerCase().includes('donuts 2')) {
                orderChan.send(`${orderAuth} Your order has arrived!`)
                orderChan.send(donuts[1])
              } else if (args.toOrder.toLowerCase().includes('donut 3') || args.toOrder.toLowerCase().includes('donuts 3')) {
                orderChan.send(`${orderAuth} Your order has arrived!`)
                orderChan.send(donuts[2])
              } else if (args.toOrder.toLowerCase().includes('donut 4') || args.toOrder.toLowerCase().includes('donuts 4')) {
                orderChan.send(`${orderAuth} Your order has arrived!`)
                orderChan.send(donuts[3])
              } else if (args.toOrder.toLowerCase().includes('donut 5') || args.toOrder.toLowerCase().includes('donuts 5')) {
                orderChan.send(`${orderAuth} Your order has arrived!`)
                orderChan.send(donuts[4])
              } else if (args.toOrder.toLowerCase().includes('donut 6') || args.toOrder.toLowerCase().includes('donuts 6')) {
                orderChan.send(`${orderAuth} Your order has arrived!`)
                orderChan.send(donuts[5])
              } else if (args.toOrder.toLowerCase().includes('donut 7') || args.toOrder.toLowerCase().includes('donuts 7')) {
                donuts = donuts[Math.floor(Math.random() * donuts.length)]
                orderChan.send(`${orderAuth} Your order has arrived!`)
                orderChan.send(donuts)
              } else if (args.toOrder.toLowerCase().includes('drink 1') || args.toOrder.toLowerCase().includes('drinks 1') || args.toOrder.toLowerCase().includes('beverage 1') || args.toOrder.toLowerCase().includes('beverages 1')) {
                orderChan.send(`${orderAuth} Your order has arrived!`)
                orderChan.send(drinks[0])
              } else if (args.toOrder.toLowerCase().includes('drink 2') || args.toOrder.toLowerCase().includes('drinks 2') || args.toOrder.toLowerCase().includes('beverage 2') || args.toOrder.toLowerCase().includes('beverages 2')) {
                orderChan.send(`${orderAuth} Your order has arrived!`)
                orderChan.send(drinks[1])
              } else if (args.toOrder.toLowerCase().includes('drink 3') || args.toOrder.toLowerCase().includes('drinks 3') || args.toOrder.toLowerCase().includes('beverage 3') || args.toOrder.toLowerCase().includes('beverages 3')) {
                orderChan.send(`${orderAuth} Your order has arrived!`)
                orderChan.send(drinks[2])
              } else if (args.toOrder.toLowerCase().includes('drink 4') || args.toOrder.toLowerCase().includes('drinks 4') || args.toOrder.toLowerCase().includes('beverage 4') || args.toOrder.toLowerCase().includes('beverages 4')) {
                orderChan.send(`${orderAuth} Your order has arrived!`)
                orderChan.send(drinks[3])
              } else if (args.toOrder.toLowerCase().includes('drink 5') || args.toOrder.toLowerCase().includes('drinks 5') || args.toOrder.toLowerCase().includes('beverage 5') || args.toOrder.toLowerCase().includes('beverages 5')) {
                orderChan.send(`${orderAuth} Your order has arrived!`)
                orderChan.send(drinks[4])
              } else {
                orderChan.send(`${orderAuth} Your order had an issue and has not arrived properly.`)
                orderChan.send(`Do \`${message.guild.commandPrefix}hq\` to get a list of ways to contact the developers.`)
              }
            }
          }
        })
      }
    })
  }
};
