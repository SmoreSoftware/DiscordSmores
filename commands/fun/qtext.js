const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

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

  //eslint-disable-next-line class-methods-use-this
  async run(message) {
    //eslint-disable-next-line newline-per-chained-call
    let toQbert = message.content.split(' ').slice(1).join(' ')

    function randomtext() {
      let text = '';
      let possible = '@#%><?!&^+=';

      for (let i = 0;i < toQbert.length;i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }

    let qbert = randomtext()
    message.delete(1)
      .then(() => {
        message.channel.send(qbert)
      })
  }
};
