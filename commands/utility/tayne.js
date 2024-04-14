const { SlashCommandBuilder } = require('@discordjs/builders');
const { AttachmentBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tayne')
        .setDescription('a new beta sequence ive been working on'),
    async execute(interaction) {
        const attachment = new AttachmentBuilder('https://c.tenor.com/115eUl2XUaAAAAAC/tenor.gif','tayne.gif')
        await interaction.reply({files : [attachment]});
    }
}