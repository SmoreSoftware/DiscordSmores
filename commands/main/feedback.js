//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const { RichEmbed } = require('discord.js');

module.exports = class PurgeCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'feedback',
      aliases: ['sendfeedback', 'complain'],
      group: 'main',
      memberName: 'feedback',
      description: 'Submits feedback to the Discord S\'mores team.',
      details: oneLine `
				Have a comment or complaint about your service?
				This command sends feedback about your service to the official server.
			`,
      examples: ['purge 25'],
      args: [{
        key: 'feedback',
        label: 'feedback',
        prompt: 'What feedback would you like to submit?',
        type: 'string',
        infinite: false
      }],
      guildOnly: true,
      guarded: true
    })
  }

  //eslint-disable-next-line class-methods-use-this
  async run(message, args) {
		const fChan = this.client.channels.get('394031452326723585')
		const embed = new RichEmbed()
		.setTitle('💬 New Feedback:')
		.setAuthor(message.author.tag, message.author.avatarURL)
		.setColor('0x0000FF')
		.setDescription(`**Message:** ${args.feedback}`)
		.setTimestamp()
		fChan.send({ embed })
		.then(() => {
			message.reply('Your feedback has been submitted! \nThank you. Your feedback will help my developers make me better. \nThank you for using Discord S\'mores!')
		})
  }
};
