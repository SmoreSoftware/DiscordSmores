//eslint-disable-next-line
const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

module.exports = class SettingsCommand extends commando.Command {
  constructor(client) {
    super(client, {
      argsPromptLimit: 0,
      name: 'settings',
      aliases: ['set', 'setting'],
      group: 'misc',
      memberName: 'settings',
      description: 'Sets or shows server settings.',
      details: oneLine `
				This command allows you to set server settings.
        This is required for many comamnds to work.
			`,
      examples: ['settings add starboard #starboard'],

      args: [{
          key: 'action',
          label: 'action',
          type: 'string',
          prompt: 'What would you like to do? (View/ Add)',
          infinite: false
        },
        {
          key: 'setting',
          label: 'setting',
          type: 'string',
          prompt: 'What setting would you like?',
          infinite: false
        },
        {
          key: 'value',
          label: 'value',
          type: 'string',
          prompt: '',
          default: '',
          infinite: true
        }
      ],

      guildOnly: true,

      guarded: true
    });
  }

  hasPermission(msg) {
    if (!msg.guild) return this.client.isOwner(msg.author);

    return msg.member.hasPermission('ADMINISTRATOR');
  }

  //eslint-disable-next-line class-methods-use-this
  async run(message, args) {
    if (args.action.toLowerCase() === 'add') {
      if (args.setting.toLowerCase() === 'starboard') {
        const rawChan = message.mentions.channels.first()
        if (!rawChan) return message.reply('Please specify a channel to set as the starboard!')
        const chanToLog = rawChan.id
        message.guild.settings.set('starboard', chanToLog)
        message.reply(`Set the starboard to "<#${message.guild.settings.get('starboard')}>"`)
      } else {
        message.reply('That\'s not a setting. Please try again.');
      }
      //eslint-disable-next-line no-empty
    } else if (args.action.toLowerCase() === 'view') {

    } else {
      message.reply('Invalid command usage. Please try again.');
    }
  }
};
