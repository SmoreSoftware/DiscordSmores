//eslint-disable-next-line
const commando = require('discord.js-commando');
const config = require('./config.json');
const client = new commando.Client({
	owner: ['197891949913571329', '251383432331001856', '156019409658314752'],
	commandPrefix: config.prefix,
	unknownCommandResponse: false
});
//const defclient = new Discord.Client();
const { RichEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');
const sqlite = require('sqlite');
const request = require('superagent');
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
client.dispatcher.addInhibitor(msg => {
	//eslint-disable-next-line no-sync
	let blacklist = JSON.parse(fs.readFileSync('./blacklist.json', 'utf8'));
	if (blacklist.guilds.includes(msg.guild.id)) return [`Guild ${msg.guild.id} is blacklisted`, msg.channel.send('This guild has been blacklisted. Appeal here: https://discord.gg/6P6MNAU')];
});
client.dispatcher.addInhibitor(msg => {
	//eslint-disable-next-line no-sync
	let blacklist = JSON.parse(fs.readFileSync('./blacklist.json', 'utf8'));
	if (blacklist.users.includes(msg.author.id)) return [`User ${msg.author.id} is blacklisted`, msg.reply('You have been blacklisted. Appeal here: https://discord.gg/6P6MNAU')];
});

client.cooldown = [];

client
	.on('error', console.error)
	.on('warn', console.warn)
	.on('debug', console.log)
	.on('ready', () => {
		console.log(`Client ready; logged in as ${client.user.tag} (${client.user.id}) with prefix ${config.prefix}`)
		const dbotsToken1 = config.dbotstoken1
		request.post(`https://discordbots.org/api/bots/${client.user.id}/stats`)
			.set('Authorization', dbotsToken1)
			.send({
				'server_count': client.guilds.size
			})
			.end();
		console.log('DBotsList guild count updated.')
		const dbotsToken2 = config.dbotstoken2
		request.post(`https://bots.discord.pw/api/bots/${client.user.id}/stats`)
			.set('Authorization', dbotsToken2)
			.send({
				'server_count': client.guilds.size
			})
			.end();
		console.log('DBots guild count updated.')
		client.user.setGame(`${config.prefix}help | ${client.guilds.size} servers`)
		console.log('Awaiting actions.')
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
	//eslint-disable-next-line
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
		console.log(`New guild added:
Guild: ${guild.id}
Name: ${guild.name}
Owner: ${guild.owner.user.tag} (${guild.owner.id})
Members: ${guild.members.size}
Bots: ${guild.members.filter(u => u.user.bot).size} (${Math.floor(guild.members.filter(u => u.user.bot).size / guild.members.size * 100)}%)
Humans: ${guild.members.filter(u => !u.user.bot).size} (${Math.floor(guild.members.filter(u => !u.user.bot).size / guild.members.size * 100)}%)
Now on: ${client.guilds.size} servers`)
		client.channels.get('330701184698679307').send(`New guild added:
Guild: ${guild.id}
Name: ${guild.name}
Owner: ${guild.owner.user.tag} (${guild.owner.id})
Members: ${guild.members.size}
Bots: ${guild.members.filter(u => u.user.bot).size} (${Math.floor(guild.members.filter(u => u.user.bot).size / guild.members.size * 100)}%)
Humans: ${guild.members.filter(u => !u.user.bot).size} (${Math.floor(guild.members.filter(u => !u.user.bot).size / guild.members.size * 100)}%)
Now on: ${client.guilds.size} servers`)
		let botPercentage = Math.floor(guild.members.filter(u => u.user.bot).size / guild.members.size * 100)
		if (botPercentage >= 80) {
			guild.defaultChannel.send('**ALERT:** Your guild has been marked as an illegal guild. \nThis may be due to it being marked as a bot guild or marked as a spam guild. \nThe bot will now leave this server. \nIf you wish to speak to my developer, you may join here: https://discord.gg/t8xHbHY')
			guild.owner.send(`**ALERT:** Your guild, "${guild.name}", has been marked as an illegal guild. \nThis may be due to it being marked as a bot guild or marked as a spam guild. \nThe bot will now leave the server. \nIf you wish to speak to my developer, you may join here: https://discord.gg/t8xHbHY`)
			guild.leave()
			//eslint-disable-next-line newline-before-return
			return
		}
		client.user.setGame(`${config.prefix}help | ${client.guilds.size} servers`)
		guild.settings.set('announcements', 'on')
		const embed = new RichEmbed()
			.setAuthor(client.user.username, client.user.avatarURL)
			.setTitle(`Hello, I'm ${client.user.username}!`)
			.setColor(0x00FF00)
			.setDescription(`Thanks for adding me to your server, "${guild.name}"! To see commands do ${guild.commandPrefix}help. Please note: By adding me to your server and using me, you affirm that you agree to [our TOS](https://smoresoft.uk/tos.html).`)
		guild.owner.send({
			embed
		})
	})
	.on('guildDelete', (guild) => {
		console.log(`Existing guild left:
Guild: ${guild.id}
Name: ${guild.name}
Owner: ${guild.owner.user.tag} (${guild.owner.id})
Members: ${guild.members.size}
Bots: ${guild.members.filter(u => u.user.bot).size} (${Math.floor(guild.members.filter(u => u.user.bot).size / guild.members.size * 100)}%)
Humans: ${guild.members.filter(u => !u.user.bot).size} (${Math.floor(guild.members.filter(u => !u.user.bot).size / guild.members.size * 100)}%)
Now on: ${client.guilds.size} servers`)
		client.channels.get('330701184698679307').send(`Existing guild left:
Guild: ${guild.id}
Name: ${guild.name}
Owner: ${guild.owner.user.tag} (${guild.owner.id})
Members: ${guild.members.size}
Bots: ${guild.members.filter(u => u.user.bot).size} (${Math.floor(guild.members.filter(u => u.user.bot).size / guild.members.size * 100)}%)
Humans: ${guild.members.filter(u => !u.user.bot).size} (${Math.floor(guild.members.filter(u => !u.user.bot).size / guild.members.size * 100)}%)
Now on: ${client.guilds.size} servers`)
		client.user.setGame(`ds.help | ${client.guilds.size} servers`)
	})

function doOrders() {
	console.log('Handling orders')
	//eslint-disable-next-line no-sync
	const orderDB = JSON.parse(fs.readFileSync('./orders.json', 'utf8'))
	const oArray = Object.values(orderDB)
	oArray.forEach((o) => {
		console.log(o)
		const orderAuth = client.users.get(o.userID)
		const orderChan = client.channels.get(o.channelID)
		const orderGuild = client.guilds.get(o.guildID)
		let min = 0.59
		let max = 2.59
		if (o.status === 'Waiting') {
			//eslint-disable-next-line
			function getRandomInt(min, max) {
				//eslint-disable-next-line no-mixed-operators
				let number = (Math.random() * (max - min) + min).toFixed(4)
				//eslint-disable-next-line newline-before-return
				return number
			}

			//let time = getRandomInt(min, max)
			//eslint-disable-next-line no-mixed-operators
			let time = (Math.random() * (max - min) + min).toFixed(1)
			time = time.replace('.', '')
			time += '0000'
			console.log(`Order: ${o.orderID}
	Status: Awaiting Chef
	Time until claimed: ${time}`)
			//eslint-disable-next-line no-use-before-define
			setTimeout(cook, 750)

			//eslint-disable-next-line no-inner-declarations
			function cook() {
				orderDB[o.orderID] = {
					'orderID': o.orderID,
					'userID': o.userID,
					'guildID': o.guildID,
					'channelID': o.channelID,
					'order': o.order,
					'status': 'Cooking'
				}
				fs.writeFile('./orders.json', JSON.stringify(orderDB, null, 2), (err) => {
					if (err) {
						orderAuth.send(`There was a database error!
	Show the following message to a developer:
	\`\`\`${err}\`\`\``)
						console.error(err)
					}
				})
			}
		} else if (o.status === 'Cooking') {
			let chef = ['Bob#1234',
				'MellissaGamer#4076',
				'ILoveSmores#3256',
				'CoolDeveloper#4035',
				'YoMomma#9693',
				'SpaceX#0276',
				'jdenderplays#2316',
				'ROM Typo#9462',
				'TJDoesCode#6088',
				'Chronomly6#8108',
				'SmoreBot#0560'
			]
			chef = chef[Math.floor(Math.random() * chef.length)]
			orderDB[o.orderID] = {
				'orderID': o.orderID,
				'userID': o.userID,
				'guildID': o.guildID,
				'channelID': o.channelID,
				'order': o.order,
				'status': 'Cooking'
			}
			fs.writeFile('./orders.json', JSON.stringify(orderDB, null, 2), (err) => {
				if (err) {
					orderAuth.send(`There was a database error!
	Show the following message to a developer:
	\`\`\`${err}\`\`\``)
					console.error(err)
				}
			})
			orderAuth.send(`Your order has been put in the oven by chef ${chef}`)
			orderAuth.send('Cooking will take 3 minutes.')
			//eslint-disable-next-line no-use-before-define
			setTimeout(deliver, 750)

			//eslint-disable-next-line no-inner-declarations
			function deliver() {
				orderDB[o.orderID] = {
					'orderID': o.orderID,
					'userID': o.userID,
					'guildID': o.guildID,
					'channelID': o.channelID,
					'order': o.order,
					'status': 'Awaiting delivery'
				}
				fs.writeFile('./orders.json', JSON.stringify(orderDB, null, 2), (err) => {
					if (err) {
						orderAuth.send(`There was a database error!
		Show the following message to a developer:
		\`\`\`${err}\`\`\``)
						console.error(err)
					}
				})
			}
		} else if (o.status === 'Awaiting delivery') {
			orderAuth.send('Your order has been cooked and will be delivered soon!')

			//eslint-disable-next-line no-mixed-operators
			let time2 = (Math.random() * (0.30 - 0.59) + 0.30).toFixed(1)
			time2 = time2.replace('.', '')
			time2 += '0000'
			console.log(`Order: ${o.orderID}
	Status: Awaiting Delivery
	Time until delivered: ${time2}`)

			//eslint-disable-next-line no-use-before-define
			setTimeout(sendToCustomer, 750)

			//eslint-disable-next-line no-inner-declarations
			function sendToCustomer() {
				let smores = ['https://busyfoodie.files.wordpress.com/2015/02/dsc01984.jpg',
					'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-n2VlKwdEbHH9xbRh_LZAhjCVa9VFspdIGzHNJyzT6YatArSE2Q',
					'https://cdn.farmersalmanac.com/wp-content/uploads/2013/08/mmm-smore-420x240.jpg',
					'http://cookingwithcurls.com/wp-content/uploads/2015/07/Outdoor-Smores-with-Homemade-Peanut-Butter-perfectly-charred-marshmallows-and-Hersheys-chocolate-bars-cookingwithcurls.com-LetsMakeSmores-Ad.jpg',
					'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUK6T-2tPjXpgs9cITVGxqsQ4nRQ-jSDh-QCgrlPsdclA2W5rg https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9KNWVBLj6Ds0ay0KVqQ-ei6n5o9a-aITuBdGb8QUpI7-MXK9r'
				]
				let poptarts = ['https://images-na.ssl-images-amazon.com/images/I/81qfBv6ec6L._SL1500_.jpg',
					'https://www.dollargeneral.com/media/catalog/product/cache/image/700x700/e9c3970ab036de70892d86c6d221abfe/1/4/14429001_kellog_pop-tarts_frosted_cherry_14.7_right_facing_1.jpg',
					'https://images-na.ssl-images-amazon.com/images/G/01/aplusautomation/vendorimages/9558c871-1eb4-4645-b7ba-2218082ede06.jpg._CB289937741_.jpg',
					'https://www.usafoodstore.co.uk/user/products/large/HOT-FUDGE-SUNDAE.JPG',
					'https://i5.walmartimages.com/asr/fe94dbb8-a1ce-4d3e-815d-d95119fcba28_1.baab75fba6936d81ddca29edfecdbe20.jpeg?odnHeight=450&odnWidth=450&odnBg=FFFFFF',
					'https://images-na.ssl-images-amazon.com/images/I/51pRL2lUNwL.jpg',
					'https://www.dollargeneral.com/media/catalog/product/cache/image/700x700/e9c3970ab036de70892d86c6d221abfe/0/0/00834101_kellogg_pop-tarts_chocolate_fudge_right_facing.jpg',
					'https://www.pacificcandywhsle.com/wp-content/uploads/2017/03/84b005924f9544052e3aa4a74f1a825b.jpg',
					'https://images-na.ssl-images-amazon.com/images/I/61GkXdZ-GvL._SY300_QL70_.jpg'
				]
				let drinks = ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAwI9Db5c-fxdBiWn-ErVO2m3zzp96Cdgtv8f2iznymYhrK8CZcQ',
					'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOTLkelJm9DpeR-7vXPejvhJCscxoGU6krzow-zHI-ZWcuFF5csQ',
					'http://www.newhealthadvisor.com/images/1HT19185/soy-milk.gif',
					'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx3XE9LKfTGrppEV0oMcAejRwqAwMDAgOqEVDqtrwSVavqM0CDpA',
					'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhtwJK3rKLac82kKQJIqsOH9vW43aH4BK6v5tkP90uBUn3UylbevOXDpc'
				]

				orderAuth.send('Your order should be arriving now!')
				if (o.order.toLowerCase().includes('smore') || o.order.toLowerCase().includes('s\'more') || o.order.toLowerCase().includes('smores') || o.order.toLowerCase().includes('s\'mores')) {
					orderChan.send(`${orderAuth} Your order has arrived!`)
					orderChan.send(smores[parseInt(o.order.split(' ').slice(1)) - 1])
					let userIndex = client.cooldown.indexOf(orderAuth.id)
					client.cooldown.splice(userIndex, 1)
					delete orderDB[o.orderID]
					fs.writeFile('./orders.json', JSON.stringify(orderDB, null, 2), (err) => {
						if (err) {
							orderAuth.send(`There was a database error!
Show the following message to a developer:
\`\`\`${err}\`\`\``)
							console.error(err)
						}
					})
				} else if (o.order.toLowerCase().includes('poptart') || o.order.toLowerCase().includes('poptarts') || o.order.toLowerCase().includes('pop-tart') || o.order.toLowerCase().includes('pop-tarts')) {
					orderChan.send(`${orderAuth} Your order has arrived!`)
					orderChan.send(poptarts[parseInt(o.order.split(' ').slice(1)) - 1])
					let userIndex = client.cooldown.indexOf(orderAuth.id)
					client.cooldown.splice(userIndex, 1)
					delete orderDB[o.orderID]
					fs.writeFile('./orders.json', JSON.stringify(orderDB, null, 2), (err) => {
						if (err) {
							orderAuth.send(`There was a database error!
Show the following message to a developer:
\`\`\`${err}\`\`\``)
							console.error(err)
						}
					})
				} else if (o.order.toLowerCase().includes('drink') || o.order.toLowerCase().includes('drinks') || o.order.toLowerCase().includes('beverage') || o.order.toLowerCase().includes('beverages')) {
					orderChan.send(`${orderAuth} Your order has arrived!`)
					orderChan.send(drinks[parseInt(o.order.split(' ').slice(1)) - 1])
					let userIndex = client.cooldown.indexOf(orderAuth.id)
					client.cooldown.splice(userIndex, 1)
					delete orderDB[o.orderID]
					fs.writeFile('./orders.json', JSON.stringify(orderDB, null, 2), (err) => {
						if (err) {
							orderAuth.send(`There was a database error!
Show the following message to a developer:
\`\`\`${err}\`\`\``)
							console.error(err)
						}
					})
				} else {
					orderChan.send(`${orderAuth} Your order had an issue and has not arrived properly.`)
					orderChan.send(`Do \`${orderGuild.commandPrefix}hq\` to get a list of ways to contact the developers.`)
					orderChan.send('We apoligize for any inconvinience.')
					let userIndex = client.cooldown.indexOf(orderAuth.id)
					client.cooldown.splice(userIndex, 1)
					delete orderDB[o.orderID]
					fs.writeFile('./orders.json', JSON.stringify(orderDB, null, 2), (err) => {
						if (err) {
							orderAuth.send(`There was a database error!
Show the following message to a developer:
\`\`\`${err}\`\`\``)
							console.error(err)
						}
					})
				}
			}
		}
	})
}

setInterval(doOrders, 10000)


client.login(config.token).catch(console.error);

process.on('unhandledRejection', err => {
	console.error('Uncaught Promise Error: \n' + err.stack);
});
