module.exports = {
  name: '멤버수',
  description: '길드 내 멤버수를 세는 채널을 만듭니다.',
  async execute(interaction, client) {
      try {
        const guild = client.guilds.cache.get(interaction.guild.id);
        if (!guild) return console.error('Guild not found');
        await guild.members.fetch();

        const member_count = guild.members.cache.filter(member => !member.user.bot).map(member => member.user.id).length


        await interaction.reply(member_count);

      } catch (error) {
        console.error('Error responding to interaction:', error);
      }
  }
}