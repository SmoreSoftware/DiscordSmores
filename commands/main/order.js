//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const fs = require('fs');

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
		//eslint-disable-next-line no-sync
		const orderDB = JSON.parse(fs.readFileSync('./orders.json', 'utf8'));

		/*i know this is terrible coding practice and I should be stoned
		I'm bad, get over it
		Also please do stone me to death I would gladly be put out of my misery
		Life is misery, existance is pain*/

		let menu = ['smores 1', 's\'mores 1', 'smore 1', 's\'more 1', 'smores 2', 's\'mores 2', 'smore 2', 's\'more 2', 'smores 3', 's\'mores 3', 'smore 3', 's\'more 3', 'smores 4', 's\'mores 4', 'smore 4',
			's\'more 4', 'smores 5', 's\'mores 5', 'smore 5', 's\'more 5', 'smores 6', 's\'mores 6', 'smore 6', 's\'more 6', 'poptart 1', 'poptarts 1', 'pop-tart 1', 'pop-tarts 1', 'poptart 2', 'poptarts 2',
			'pop-tart 2', 'pop-tarts 2', 'poptart 3', 'poptarts 3', 'pop-tart 3', 'pop-tarts 3', 'poptart 4', 'poptarts 4', 'pop-tart 4', 'pop-tarts 4', 'poptart 5', 'poptarts 5', 'pop-tart 5', 'pop-tarts 5', 
			'poptart 6', 'poptarts 6', 'pop-tart 6', 'pop-tarts 6', 'poptart 7', 'poptarts 7', 'pop-tart 7', 'pop-tarts 7', 'poptart 8', 'poptarts 8', 'pop-tart 8', 'pop-tarts 8', 'poptart 9', 'poptarts 9',
			'pop-tart 9', 'pop-tarts 9', 'poptart 10', 'poptarts 10', 'pop-tart 10', 'pop-tarts 10', 'drink 1', 'drinks 1', 'beverage 1', 'beverages 1', 'drink 2', 'drinks 2', 'beverage 2', 'beverages 2', 'drink 3',
			'drinks 3', 'beverage 3', 'beverages 3', 'drink 4', 'drinks 4', 'beverage 4', 'beverages 4', 'drink 5', 'drinks 5', 'beverage 5', 'beverages 5'
		]
		if (!menu.includes(args.toOrder.toLowerCase())) return message.reply(`Please order a menu item! Do \`${message.guild.commandPrefix}menu\` to see the menu.`)
		if (this.client.cooldown.includes(message.author.id)) return message.reply('You already have an active order!')
		this.client.cooldown.push(message.author.id)

		function makeID() {
			let id = '';
			let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
			for (let i = 0;i < 5;i++) id += possible.charAt(Math.floor(Math.random() * possible.length));
			//eslint-disable-next-line newline-before-return
			return id;
		}
		const orderID = makeID()

		if (!orderDB[orderID]) orderDB[orderID] = {
			'orderID': orderID,
			'userID': message.author.id,
			'guildID': message.guild.id,
			'channelID': message.channel.id,
			'order': args.toOrder,
			'status': 'Waiting'
		}
		fs.writeFile('./orders.json', JSON.stringify(orderDB, null, 2), (err) => {
			if (err) {
				message.reply(`There was a database error!
Show the following message to a developer:
\`\`\`${err}\`\`\``)
				console.error(err)
			}
		})

		message.reply('Your order has been sent to Discord S\'mores! \nPlease note this may take up to 9 minutes to cook and deliver')
		let ordersChan = this.client.channels.get('329303695407841280')
		ordersChan.send(`__**New order:**__
**OrderID** ${orderID}
**Ordered from:** #${message.channel.name} (${message.channel.id}) in ${message.guild.name} (${message.guild.id})
**Status:** Awaiting a cook`)
	}
};
