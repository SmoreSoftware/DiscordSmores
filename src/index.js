const { AkairoClient, CommandHandler } = require("discord-akairo");
const config = require("./config");

class DSmoresClient extends AkairoClient {
	constructor() {
		super({
			ownerID: ["251383432331001856", "197891949913571329"]
		}, {
			disableEveryone: true
		});
	}
}

const client = new DSmoresClient();

client.on("ready", () => {
	// this.commandHandler = new CommandHandler(this, {
	// directory: "./commands/",
	// prefix: config.prefix
	// });

	// this.commandHandler.loadAll();

	// eslint-disable-next-line no-console
	console.log(`Logged in as ${client.user.tag} : ${client.user.id}
Prefix: ${config.prefix}
https://discordapp.com/oauth2/authorize?scope=bot&client_id=${client.user.id}`);
	client.user.setPresence({
		game: {
			name: `${config.prefix}help | ${client.guilds.size} servers`,
			type: 0
		}
	});
});

client.login(config.token);
