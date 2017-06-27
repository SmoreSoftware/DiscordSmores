const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const Discord = require('discord.js');

module.exports = class SuggestCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'qtext',
      group: 'fun',
      memberName: 'qtext',
      description: 'random qbert text!',
      details: oneLine `
        qbert like text!
			`,
      examples: ['qtext'],
      args: [{
        key: 'toQtext',
        label: 'qtext',
        prompt: 'Random Text',
        type: 'string',
        infinite: false
      }],
      guildOnly: true,
      guarded: true
    })
  }

  async run(message, args) {
    let toQbert = message.content.split(" ").slice(1).join(" ")

    function randomtext() {
      let text = "";
      let possible = "@#%><?!&^+=";

      for (var i = 0; i < toQbert.length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }

    let qbert = randomtext()
    message.delete(1)
      .then(() => {
        message.channel.send(qbert)
      })
  }
};
