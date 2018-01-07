//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const fsn = require('fs-nextra');

module.exports = class ClaimCommand extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'manadd',
			group: 'overrides',
			memberName: 'manadd',
			description: 'Order some breakfast.',
			details: oneLine `
			This command claims a given order so that it can be handled manually.
			Orders must be claimed before a worker can handle them with override commands.
			`,
			examples: ['claim aBcDe'],
			args: [{
					key: 'orderID',
					label: 'orderID',
					prompt: 'What is the orderID of the order you want to add?',
					type: 'string',
					infinite: false
				},
				{
					key: 'orderAuth',
					label: 'orderAuth',
					prompt: 'What is the user ID of the order\'s author?',
					type: 'string',
					infinite: false
				},
				{
					key: 'guildID',
					label: 'guildID',
					prompt: 'What is the ID of the order\'s guild?',
					type: 'string',
					infinite: false
				},
				{
					key: 'channelID',
					label: 'channelID',
					prompt: 'What is the ID of the order\'s channel?',
					type: 'string',
					infinite: false
				},
				{
					key: 'status',
					label: 'status',
					prompt: 'What is the status of the order?',
					type: 'string',
					infinite: false
				},
				{
					key: 'order',
					label: 'order',
					prompt: 'What is the order?',
					type: 'string',
					infinite: false
				}
			],

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
				const orderAuth = this.client.users.get(args.userID)
				const orderChan = this.client.channels.get(args.channelID)
				const orderGuild = this.client.guilds.get(args.guildID)
				const oChan = this.client.channels.get('394031402758438912')

				if (!orderDB[args.orderID]) orderDB[args.orderID] = {
					'orderID': args.orderID,
					'userID': args.userID,
					'guildID': args.guildID,
					'channelID': args.channelID,
					'order': args.order,
					'manual': true,
					'status': args.status,
					'chef': message.author.id
				}
				oChan.fetchMessages({
						limit: 100
					})
					.then(msgs => {
						let msg = msgs.filter(m => m.content.includes(args.orderID))
						msg.first().edit(`__**Order**__
**OrderID:** ${args.orderID}
**Order:** ${args.order}
**Customer:** ${orderAuth.tag} (${orderAuth.id})
**Ordered from:** #${orderChan.name} (${orderChan.id}) in ${orderGuild.name} (${orderGuild.id})
**Status:** Claimed`)
					})

				fsn.writeJSON('./orders.json', orderDB, {
						replacer: null,
						spaces: 2
					})
					.then(() => {
						message.reply(`Order ${args.orderID} has been manually added to the order database.`)
					})
					.catch((err) => {
						if (err) {
							message.reply(`There was an error while writing to the database!
  Contact a developer and show them the following message:
  \`\`\`${err}\`\`\``)
						}
					})
			})
	}
};