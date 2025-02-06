module.exports = {
    name: 'ping',
    description: '핑 속도 확인',
    async execute(interaction) {
        try {
          await interaction.reply('🏓 Pong!');
        } catch (error) {
          console.error('Error responding to interaction:', error);
        }
    }
}