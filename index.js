const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { MongoClient } = require('mongodb');

const { token } = require('./config.json');
const { dbConnStr } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const dbClient = new MongoClient(dbConnStr);

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();

    console.log("Mongo Ready! Active Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

client.once(Events.ClientReady, async readyClient => {
	console.log(`Discord Ready! Logged in as ${readyClient.user.tag}`);

	// try {
	// 	await dbClient.connect();
	// 	await  listDatabases(dbClient);
	// } catch (e) {
	// 	console.error(e)
	// } finally {
	// 	await dbClient.close();
	// }
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
		
	} catch (error) {
		console.error(`Error Executing Interaction. Error: ${error}`);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply(`Error Executing Command. Error: ${error}`);
		}
	}
});

/**
 * client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;
    const { commandName } = interaction;
    if (commandName === 'addmap') {
        const mapName = interaction.options.getString('map');
        const coordinates = interaction.options.getString('coordinates');
        let docRef = db.collection('maps').doc(mapName);
        let setWithOptions = docRef.set({
            mapName: mapName,
            coordinates: coordinates
        }, {merge: true});
        await interaction.reply(`Map ${mapName} with coordinates ${coordinates} added.`);
    }
});
 */

client.login(token);