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
        },
        {
					key: 'response',
					label: 'response',
					prompt: 'What is the response you would like to use? (bug, dberr, interrupt) ',
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
    const responses = {
      bug: `I apoligize about your order not being delivered.
There was an issue that caused your order to break.
The issue has been fixed by my developers.
You should now be able to order something and have it delivered properly.
Thank you for using Discord S'mores.`,
      dberr: `I apoligize about your order not being delivered.
The order database dropped your order.
Please reorder.
Thank you for using Discord S'mores.`,
      interrupt: `I apoligize about your order not being delivered.
There was an interruption that caused your order to stop being handled.
Please reorder.
Thank you for using Discord S'mores.`
    }

		this.client.users.get(args.id).send(responses[args.response])
    .then(() => message.reply(`Reply sent to "${this.client.users.get(args.id).tag}".`))
    .catch((err) => message.reply(`Could not send reply! \n\`\`\`${err}\`\`\``))
	}
};
