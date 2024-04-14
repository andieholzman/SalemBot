const { SlashCommandBuilder } = require('discord.js')
const { MongoClient } = require('mongodb');
const { dbConnStr } = require('../../config.json');


//Thavnair ( 14.7  , 15.0 )
module.exports = {
    data: new SlashCommandBuilder()
        .setName('addmap')
        .setDescription('add a map to the map collection')
        .addStringOption(option =>
            option.setName('input')
                .setDescription('Input in format "Location (XX.X, YY.Y)"')
                .setRequired(true)),
        async execute(interaction) {
            const input = interaction.options.getString('input');
            const client = new MongoClient(dbConnStr);
            
            console.log(`Add Map Called. Input: ${input}`);
            try {
                const [location, coords] = this.parseInput(input);
               
                await client.connect();
                const db = client.db('Maps');
                const collection = db.collection('ActiveMaps');
                const document = {
                    user: interaction.user.displayName.trim(),
                    zone: location.slice(1).trim(),
                    coords: coords.trim(),
                    timestamp: new Date()
                };
                await collection.insertOne(document);
                await interaction.reply(`Map Location ${input} added successfully with ID: ${document._id}`);
            } catch (ex) {
                await interaction.reply(`Error Registering Map Location. Error: ${ex}`);
            } finally {
                client.close();
            }

        },
        parseInput(input) {
            const match = input.match(/^(.+)\s*\((.+)\)$/);
            if (!match) {
                throw new Error('Invalid input format');
            }
            return [match[1], match[2]];
        }
    };