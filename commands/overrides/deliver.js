//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const ms = require('ms');
const fsn = require('fs-nextra');

module.exports = class DeliverCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'deliver',
			group: 'overrides',
			memberName: 'deliver',
			description: 'Delivers a given order.',
			details: oneLine `
      This command sends an invite to the channel where the given order originated.
      How else would orders reach the customers?
			`,
			examples: ['deliver aBcDe'],
			args: [{
				key: 'orderID',
				label: 'orderID',
				prompt: 'What is the orderID of the order you want to deliver?',
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
				const oChan = this.client.channels.get('394031402758438912')
				let img

				//eslint-disable-next-line no-undefined
				if (o === undefined) {
					message.reply('Couldn\'t find that order. Please try again.')
					//eslint-disable-next-line newline-before-return
					return
				}

				if (o.status.toLowerCase() === 'awaiting delivery') {
					if (o.manual !== true) return message.reply('This order is not claimed!')

					const orderAuth = this.client.users.get(o.userID)
					this.client.channels.get(o.channelID).createInvite({
							temporary: false,
							maxAge: 10,
							maxUses: 1
						})
						.then(async invite => {
							let smores = ['https://i.imgur.com/eh93oM9.png',
								'https://i.imgur.com/DvoQEdX.png',
								'https://i.imgur.com/zdsGDa4.png',
								'https://i.imgur.com/o3hD2Mv.png',
								'https://i.imgur.com/LS2b4Mc.png https://i.imgur.com/btwgJnw.png'
							]
							let poptarts = ['https://i.imgur.com/oe7QRAO.png',
								'https://i.imgur.com/Rfe1DQK.png',
								'https://i.imgur.com/PGROXYh.png',
								'https://i.imgur.com/06haJcC.png',
								'https://i.imgur.com/yzTqGyx.png',
								'https://i.imgur.com/dCPHlv8.png',
								'https://i.imgur.com/ZvCRNS2.png',
								'https://i.imgur.com/buTEr8Y.png',
								'https://i.imgur.com/si3DNR6.png'
							]
							let drinks = ['https://i.imgur.com/z2UWBeZ.png',
								'https://i.imgur.com/cCaTqGH.png',
								'https://i.imgur.com/EyFkzax.png',
								'https://i.imgur.com/Q5Hf10B.png',
								'https://i.imgur.com/mWFPQf6.png'
							]

							orderAuth.send('Your order should be arriving now!')
							if (o.order.toLowerCase().includes('smore') || o.order.toLowerCase().includes('s\'more') || o.order.toLowerCase().includes('smores') || o.order.toLowerCase().includes('s\'mores')) {
								//eslint-disable-next-line no-negated-condition
								if (!o.order.toLowerCase().includes('6')) {
									img = smores[parseInt(o.order.split(' ').slice(1)) - 1]
								} else {
									img = smores[Math.floor(Math.random() * smores.length)]
								}
								let userIndex = this.client.cooldown.indexOf(orderAuth.id)
								this.client.cooldown.splice(userIndex, 1)
								delete orderDB[o.orderID]

								fsn.writeJSON('./orders.json', orderDB, {
										replacer: null,
										spaces: 2
									})
									.catch((err) => {
										if (err) {
											orderAuth.send(`There was a database error!
Show the following message to a developer:
\`\`\`${err}\`\`\``)
											console.error(`Error in order ${o.orderID} \n${err}`)
										}
									})

								oChan.fetchMessages({
										limit: 100
									})
									.then(msgs => {
										let msg = msgs.filter(m => m.content.includes(o.orderID))
										msg.first().delete(1)
									})
							} else if (o.order.toLowerCase().includes('poptart') || o.order.toLowerCase().includes('poptarts') || o.order.toLowerCase().includes('pop-tart') || o.order.toLowerCase().includes('pop-tarts')) {
								//eslint-disable-next-line no-negated-condition
								if (!o.order.toLowerCase().includes('10')) {
									img = poptarts[parseInt(o.order.split(' ').slice(1)) - 1]
								} else {
									img = poptarts[Math.floor(Math.random() * poptarts.length)]
								}
								let userIndex = this.client.cooldown.indexOf(orderAuth.id)
								this.client.cooldown.splice(userIndex, 1)
								delete orderDB[o.orderID]

								fsn.writeJSON('./orders.json', orderDB, {
										replacer: null,
										spaces: 2
									})
									.catch((err) => {
										if (err) {
											orderAuth.send(`There was a database error!
Show the following message to a developer:
\`\`\`${err}\`\`\``)
											console.error(`Error in order ${o.orderID} \n${err}`)
										}
									})

								oChan.fetchMessages({
										limit: 100
									})
									.then(msgs => {
										let msg = msgs.filter(m => m.content.includes(o.orderID))
										msg.first().delete(1)
									})
							} else if (o.order.toLowerCase().includes('drink') || o.order.toLowerCase().includes('drinks') || o.order.toLowerCase().includes('beverage') || o.order.toLowerCase().includes('beverages')) {
								img = drinks[parseInt(o.order.split(' ').slice(1)) - 1]
								let userIndex = this.client.cooldown.indexOf(orderAuth.id)
								this.client.cooldown.splice(userIndex, 1)
								delete orderDB[o.orderID]

								fsn.writeJSON('./orders.json', orderDB, {
										replacer: null,
										spaces: 2
									})
									.catch((err) => {
										if (err) {
											orderAuth.send(`There was a database error!
Show the following message to a developer:
\`\`\`${err}\`\`\``)
											console.error(`Error in order ${o.orderID} \n${err}`)
										}
									})

								oChan.fetchMessages({
										limit: 100
									})
									.then(msgs => {
										let msg = msgs.filter(m => m.content.includes(o.orderID))
										msg.first().delete(1)
									})
							}

							message.author.send(`The order ${o.orderID} is now in your hands. Here's the order's information:

**Customer**: \`\`\`${this.client.users.get(o.userID).tag}\`\`\`
**Server**: \`\`\`${this.client.guilds.get(o.guildID).name} (${o.guildID})\`\`\`
**Channel** \`\`\`#${this.client.channels.get(o.channelID).name} (${o.channelID})\`\`\`
**Order**: \`\`\`${o.order}\`\`\`
**Image**: \`\`\`${img}\`\`\`

The following invite is good for 10 minutes. Please only deliver to the channel the order was ordered from, unless you do not have access to that channel.
${invite}`)
						})
						.catch(console.error)
					message.reply('Information on the order has been DMed to you.')
					orderAuth.send(`${message.author.tag} has taken your order out for delivery! It should arrive soon! Thank you for your business!`)

					delete orderDB[args.orderID]
					fsn.writeJSON('./orders.json', orderDB, {
						replacer: null,
						spaces: 2
					})
				} else {
					message.reply('That order is not ready to be delivered yet!')
				}
			})
	}
};
