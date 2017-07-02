const commando = require('discord.js-commando');
const config = require('./config.json');
const client = new commando.Client({
  owner: ['197891949913571329', '251383432331001856'],
  commandPrefix: config.prefix,
  unknownCommandResponse: false
});
const Discord = require('discord.js');
//const defclient = new Discord.Client();
const path = require('path');
const sqlite = require('sqlite');
const oneLine = require('common-tags').oneLine;

client.registry
  .registerGroups([
    ['main', 'Main'],
    ['misc', 'Miscellaneous'],
    ['support', 'Support'],
    ['control', 'Bot Owners Only'],
    ['fun', 'Fun']
  ])

  .registerDefaults()

  .registerCommandsIn(path.join(__dirname, 'commands'));

client.setProvider(sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new commando.SQLiteProvider(db))).catch(console.error);

client
  .on('error', () => console.error)
  .on('warn', () => console.warn)
  .on('debug', () => console.log)
  .on('ready', () => {
    console.log(`Client ready; logged in as ${client.user.tag} (${client.user.id})`)
    client.user.setGame('ds.help | v0.3.0')
  })
  .on('disconnect', () => console.warn('Disconnected!'))
  .on('reconnecting', () => console.warn('Reconnecting...'))
  .on('commandError', (cmd, err) => {
    if (err instanceof commando.FriendlyError) return;
    console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
  })
  .on('commandBlocked', (msg, reason) => {
    console.log(oneLine `
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
  })
  .on('commandPrefixChange', (guild, prefix) => {
    console.log(oneLine `
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  })
  .on('commandStatusChange', (guild, command, enabled) => {
    console.log(oneLine `
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  })
  .on('groupStatusChange', (guild, group, enabled) => {
    console.log(oneLine `
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
  })
  .on('commandRun', (command, promise, msg, args) => {
    if (msg.guild) {
      console.log(`Command ran
        Guild: ${msg.guild.name} (${msg.guild.id})
        Channel: ${msg.channel.name} (${msg.channel.id})
        User: ${msg.author.tag} (${msg.author.id})
        Command: ${command.groupID}:${command.memberName}
        Message: "${msg.content}"`)
    } else {
      console.log(`Command ran:
        Guild: DM
        Channel: N/A
        User: ${msg.author.tag} (${msg.author.id})
        Command: ${command.groupID}:${command.memberName}
        Message: "${msg.content}"`)
    }
  })
  .on('guildCreate', (guild) => {
    console.log(`New guild added: ${guild.name} (${guild.id}), owned by ${guild.owner.user.tag} (${guild.owner.id}).`)
  })
  .on('messageReactionAdd', (reaction, user) => {
    //console.log('new reaction')
    if (reaction.emoji.name === '⭐') {
      let msg = reaction.message
      const embed = new Discord.RichEmbed()
        .setAuthor(msg.author.username, msg.author.avatarURL)
        .setColor(0xCCA300)
        .addField('Starred By', `${user.username}`, true)
        .addField('Channel', `${msg.channel}`, true)
        .addField('Message', `${msg.content}`, false)
        .setFooter(`⭐ ${client.user.username} Starboard ⭐`)
        .setTimestamp()
      let starboard = client.channels.get(msg.guild.settings.get('starboard'))
      if (!starboard) return
      if (user.id === msg.author.id) return msg.channel.send(`${msg.author}, You can't star your own messages!`)
      //eslint-disable-next-line no-undef
      reacts = msg.reactions.filter(function(reacts) {
        return reacts.emoji.name === '⭐'
      })
      //eslint-disable-next-line no-undef
      if (reacts.length > 1) return
      starboard.send({
        embed: embed
      })
    }
  })

client.login(config.token).catch(console.error);

process.on('unhandledRejection', err => {
  console.error('Uncaught Promise Error: \n' + err.stack);
});
