//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class ABLCommand extends commando.Command {
	constructor(bot) {
		super(bot, {
			name: 'reply',
			aliases: ['replytouser', 'dmuser', 'alertuser'],
			group: 'control',
			memberName: 'reply',
			description: 'Sends a message to a user about their order not being delivered.',
			details: oneLine `
			This command sends an apoligy to a user if their order could not be delivered.
      This is used by devs if TJ was a dumbass and had to fix a bug.
      Permission is locked to developers. Duh!
			`,
			examples: ['reply 1234567890'],

			args: [{
					key: 'id',
					label: 'id',
					prompt: 'What is the ID you would like to alert?',
					type: 'string',
					infinite: false
				}
			],

			guarded: true
		});
	}

	hasPermission(msg) {
		return this.client.isOwner(msg.author);
	}

	async run(message, args) {
		this.client.users.get(args.id).send(`Apoligies about your order not being delivered.
My developers have patched an issue that was causing orders to break.
You should now be able to order something and have it delivered.
Thank you for using Discord S'mores.`)
		message.reply(`Reply sent to "${this.client.users.get(args.id}.tag}".`)
	}
};
