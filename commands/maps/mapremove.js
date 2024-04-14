const { SlashCommandBuilder } = require('discord.js')
const { MongoClient } = require('mongodb');
const { dbConnStr } = require('../../config.json');
const MapHelper = require('../../Helpers/MapHelpers');

//Thavnair ( 14.7  , 15.0 )
module.exports = {
    data: new SlashCommandBuilder()
        .setName('removemap')
        .setDescription('remove a map from map collection')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('Input in format "Location (XX.X, YY.Y)"')
                .setRequired(true)),
    async execute(interaction) {
        const input = interaction.options.getString('input');
        const client = new MongoClient(dbConnStr);

        console.log(`Remove Map Called. Input: ${input}`);
        try {
            const [user, zone, ...coordsParts] = input.split(',');
            const coords = coordsParts.join(',').trim();

            await client.connect();
            const db = client.db('Maps');
            const collection = db.collection('ActiveMaps');
            const query = { user: user.trim(), zone: zone.trim(), coords: coords };
            const result = await collection.deleteOne(query);
            if (result.deletedCount === 1) {
                let activeMaps = await MapHelper.fetchActiveMaps(client);
                let response = `Successfully removed the map with User: ${user} in Zone" ${zone} at Coords: (${coords})` + '\n' + '\n' + activeMaps;
                await interaction.reply(response);
                // await interaction.followUp(activeMaps);
            } else {
                throw new Error(`No map found with User: ${user} in Zone" ${zone} at Coords: (${coords})`)
            }
        } catch (ex) {
            await interaction.reply(`Error Removing Map Location. ${ex}`);
        } finally {
            client.close();
        }

    },
    parseInput(input) {
        const match = input.match(/^(.+)\s*\((.+)\)$/);
        if (!match) {
            throw new Error('Invalid input format');
        }
        return [match[1].trim(), match[2].trim()];
    }
};