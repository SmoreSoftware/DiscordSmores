//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const fsn = require('fs-nextra');
const ms = require('ms');

module.exports = class CookCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'cook',
			group: 'overrides',
			memberName: 'cook',
			description: 'Cooks a given order.',
			details: oneLine `
      This command puts a given order in the oven.
      What else would we do, serve uncooked food to our customers?
      Gross. Just gross.
			`,
			examples: ['cook aBcDe'],
			args: [{
				key: 'orderID',
				label: 'orderID',
				prompt: 'What is the orderID of the order you want to cook?',
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
				const deliveryChan = this.client.channels.get('398309128189247498')


				if (o.status.toLowerCase() === 'waiting') {
					message.reply('You must claim the order before you can cook it!')
				} else if (o.status.toLowerCase() === 'claimed') {
					//eslint-disable-next-line no-negated-condition
					if (o.chef !== message.author.id) {
						message.reply(`That order has already been claimed by chef ${this.client.users.get(o.chef).tag}!`)
					}

					delete orderDB[args.orderID]
					orderDB[o.orderID] = {
						'orderID': o.orderID,
						'userID': o.userID,
						'guildID': o.guildID,
						'channelID': o.channelID,
						'order': o.order,
						'manual': true,
						'status': 'Cooking',
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
**Status:** Cooking`)
					})

					fsn.writeJSON('./orders.json', orderDB, {
							replacer: null,
							spaces: 2
						})
						.then(() => {
							message.reply(`You've put order \`${o.orderID}\` in the oven. It will be cooked in 3 minutes.`)
							orderAuth.send(`Your order has been put in the oven by chef ${message.author.tag}`)
							orderAuth.send('Cooking will take 3 minutes.')
							//eslint-disable-next-line no-use-before-define
							setTimeout(cook, 180000)
						})
						.catch((err) => {
							if (err) {
								message.reply(`There was an error while writing to the database!
Show the the following message to a developer:
\`\`\`${err}\`\`\``)
							}
						})

					//eslint-disable-next-line no-inner-declarations
					async function cook() {
						delete orderDB[args.orderID]
						orderDB[o.orderID] = {
							'orderID': o.orderID,
							'userID': o.userID,
							'guildID': o.guildID,
							'channelID': o.channelID,
							'order': o.order,
							'manual': true,
							'status': 'Awaiting Delivery',
							'chef': o.chef
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
								deliveryChan.send(`Order \`${o.orderID}\` is ready for delivery!`)
								orderAuth.send('Your order has been cooked and will be delivered soon!')
							})
							.catch((err) => {
								if (err) {
									message.reply(`There was an error while writing to the database!
Show the following message to a developer:
\`\`\`${err}\`\`\``)
								}
							})
					}
				} else if (o.status.toLowerCase() === 'cooking') {
					message.reply('That order is already in the oven!')
				} else if (o.status.toLowerCase() === 'awaiting delivery') {
					message.reply('You can\'t cook a cooked order! Are you trying to burn it?')
				}
			})
	}
};