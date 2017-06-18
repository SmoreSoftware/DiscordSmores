const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const Discord = require('discord.js');
const webhook = require('discord-bot-webhook');

module.exports = class SuggestCommand extends commando.Command {
  constructor(client) {
    super(client, {
      name: 'order',
      group: 'main',
      memberName: 'order',
      description: 'order something from discord smores!',
      details: oneLine `
        order smores or other food from Discord S'mores!
			`,
      examples: ['echo lol'],
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
    webhook.hookId = '326095138273099776';
    webhook.hookToken = 'bV7gSkK4_lQRqztqkViAr5L8gBjrmjHR6z5UPlC5ruaeP8YZfu25Lt4F9F7HoIf_83Xh';
    webhook.userName = 'Captain WebHook Jr.';
    webhook.avatarUrl = 'https://images-ext-2.webhookapp.net/external/XxKYPOL-ChuF72uX5riG6BbhiOHtBty-gn1wqxBoDIg/%3Fsize%3D128/https/cdn.webhookapp.com/avatars/325041838748860418/47171ef1d03580dec233cc3aa60ec478.jpg';
    webhook.sendMessage(`New Order: ${args.toOrder}`)
  }
};