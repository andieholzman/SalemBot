const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nudetayne')
        .setDescription('your wife is calling'),
    async execute(interaction) {
        const attachment = new AttachmentBuilder('https://c.tenor.com/iA_rAoqbmZ4AAAAC/tenor.gif','nudetayne.gif')
        await interaction.reply({files : [attachment]});
    }
}