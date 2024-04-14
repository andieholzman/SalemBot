const { SlashCommandBuilder } = require('discord.js')
const { MongoClient } = require('mongodb');
const { dbConnStr } = require('../../config.json');



module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearmaps')
        .setDescription('Clear all active maps'),
        async execute(interaction) {
            const client = new MongoClient(dbConnStr);
            
            console.log(`Get Maps Called`);
            try {
                await client.connect();
                const db = client.db('Maps');
                const collection = db.collection('ActiveMaps');
                await collection.deleteMany({});

                            
                await interaction.reply(`Active Maps Cleared Successfully`);
            } catch (ex) {
                await interaction.reply(`Error Clearing Active Maps. Error: ${ex}`);
            } finally {
                client.close();
            }
        },
    };