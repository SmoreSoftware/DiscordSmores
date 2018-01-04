//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const fsn = require('fs-nextra');

module.exports = class ClaimCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'claim',
      group: 'overrides',
      memberName: 'claim',
      description: 'Order some breakfast.',
      details: oneLine `
			This command claims a given order so that it can be handled manually.
			Orders must be claimed before a worker can handle them with override commands.
			`,
      examples: ['claim aBcDe'],
      args: [{
        key: 'orderID',
        label: 'orderID',
        prompt: 'What is the orderID of the order you want to claim?',
        type: 'string',
        infinite: false
      }],

      guildOnly: true,
      guarded: true
    })
  }

  hasPermission(msg) {
    return this.client.workers.includes(msg.author.id)
  }

  async run(message, args) {
    if (message.guild.id !== '326086487659511818') {
      message.reply('Worker commands may only be used within the official server designated channels! This incident will be reported!')
      console.warn(`${message.author.tag} (${message.author.id}) attempted a worker command outside of official server.`)
      return
    }

    fsn.readJSON('./orders.json')
      .then((orderDB) => {
				const o = orderDB[args.orderID]

        //eslint-disable-next-line no-undefined
        if (o === undefined) {
          message.reply('Couldn\'t find that order. Please try again.')
          //eslint-disable-next-line newline-before-return
          return
				}

				const orderAuth = this.client.users.get(o.userID)
				const orderChan = this.client.channels.get(o.channelID)
				const orderGuild = this.client.guilds.get(o.guildID)
				const oChan = this.client.channels.get('394031402758438912')

        if (o.status.toLowerCase() === 'waiting') {
          delete orderDB[args.orderID]
          orderDB[o.orderID] = {
						'orderID': o.orderID,
						'userID': o.userID,
						'guildID': o.guildID,
						'channelID': o.channelID,
						'order': o.order,
						'manual': true,
						'status': 'Claimed',
						'chef': message.author.id
					}
					oChan.fetchMessages({
						limit: 100
					})
					.then(msgs => {
						let msg = msgs.filter(m => m.content.includes(o.orderID))
						msg.first().edit(`__**Order**__
**OrderID:** ${o.orderID}
**Order:** ${o.order}
**Customer:** ${orderAuth.tag} (${orderAuth.id})
**Ordered from:** #${orderChan.name} (${orderChan.id}) in ${orderGuild.name} (${orderGuild.id})
**Status:** Claimed`)
					})

          fsn.writeJSON('./orders.json', orderDB, {
              replacer: null,
              spaces: 2
            })
            .then(() => {
              message.reply(`You've been set as the chef for order ${args.orderID}. You may now handle it.`)
              orderAuth.send(`Your order has been claimed by chef ${message.author.tag} and should be put in the oven soon!`)
            })
            .catch((err) => {
              if (err) {
                message.reply(`There was an error while writing to the database!
  Contact a developer and show them the following message:
  \`\`\`${err}\`\`\``)
              }
						})
        } else if (o.status.toLowerCase() === 'claimed') {
          //eslint-disable-next-line no-negated-condition
          if (o.chef !== message.author.id) {
            message.reply(`That order has already been claimed by chef ${this.client.users.get(o.chef).tag}!`)
          } else {
            message.reply('Something weird happened with the storage of this order to the DB! Contact a developer.')
					}
				} else if (o.status.toLowerCase() === 'awaiting delivery') {
					delete orderDB[args.orderID]
          orderDB[o.orderID] = {
						'orderID': o.orderID,
						'userID': o.userID,
						'guildID': o.guildID,
						'channelID': o.channelID,
						'order': o.order,
						'manual': true,
						'status': 'Awaiting Delivery',
						'deliverer': message.author.id
					}
					oChan.fetchMessages({
						limit: 100
					})
					.then(msgs => {
						let msg = msgs.filter(m => m.content.includes(o.orderID))
						msg.first().edit(`__**Order**__
**OrderID:** ${o.orderID}
**Order:** ${o.order}
**Customer:** ${orderAuth.tag} (${orderAuth.id})
**Ordered from:** #${orderChan.name} (${orderChan.id}) in ${orderGuild.name} (${orderGuild.id})
**Status:** Awaiting delivery`)
					})

					fsn.writeJSON('./orders.json', orderDB, {
						replacer: null,
						spaces: 2
					})
					.then(() => {
						message.reply(`You've been set as the deliverer for order ${args.orderID}. You may now deliver it.`)
						orderAuth.send(`Your order has been claimed for manual delivery by ${message.author.tag}.`)
					})
					.catch((err) => {
						if (err) {
							message.reply(`There was an error while writing to the database!
Contact a developer and show them the following message:
\`\`\`${err}\`\`\``)
						}
					})
				}
      })
  }
};
