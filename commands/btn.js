const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: '모집',
  description: '미니게임 모집 테스트',
  data: new SlashCommandBuilder()
    .setName('버튼')
    .setDescription('버튼을 사용한 반복적인 인터랙션 예제'),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('next')
        .setLabel('참여')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('exit')
        .setLabel('나가기(테스트)')
        .setStyle(ButtonStyle.Danger)
        .setDisabled()
    );

    const sentMessage = await interaction.reply({ 
      content: '버튼을 선택하세요!', 
      components: [row],
    });
    const collector = sentMessage.createMessageComponentCollector({
      time: 60_000,
    });

    let party = []
    collector.on('collect', async buttonInteraction => {
      let username = buttonInteraction.user.globalName
      if (buttonInteraction.customId === 'next') {

        if (!party.includes(username)) {
          party.push(username)
        } else{
          await interaction.followUp({ 
            content: `-# 이 메세지는 저희가 지워드릴 수 없어요...\n${username}님은 이미 참가하셨어요.`, 
            ephemeral: true, // 해당 유저에게만 보이는 메시지
          })
        }

        await buttonInteraction.update({
          content: `${party.toString().replace(",", "\n")}`,
          components: [row] // 버튼 유지
        });
      } else if (buttonInteraction.customId === 'exit') {
      }
    });

    collector.on('end', async collected => {
      await sentMessage.edit({
        content: '게임을 시작합니다!',
        components: [] // 버튼 제거
      });
      if (collected.size < 2) {
        await sentMessage.edit({
          content: '모집된 인원이 부족합니다! 종료합니다',
          components: [] // 버튼 제거
        });
      }
    });

  },
};