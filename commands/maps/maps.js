const { SlashCommandBuilder } = require('discord.js')
const { MongoClient } = require('mongodb');
const { dbConnStr } = require('../../config.json');
const MapHelper = require('../../Helpers/MapHelpers');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('maps')
        .setDescription('Lists active maps sorted by zone'),
    async execute(interaction) {
        const client = new MongoClient(dbConnStr);

        console.log(`Get Maps Called`);
        try {
            await client.connect();
            let output = await MapHelper.fetchActiveMaps(client);

            await interaction.reply(output);
        } catch (ex) {
            await interaction.reply(`Error Generating Map Location List. ${ex}`);
        } finally {
            client.close();
        }
    }
};