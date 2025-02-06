const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: '버튼',
  description: '버튼 테스트',
  data: new SlashCommandBuilder()
    .setName('버튼')
    .setDescription('버튼을 사용한 반복적인 인터랙션 예제'),
  async execute(interaction) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('next')
        .setLabel('다음')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('exit')
        .setLabel('종료')
        .setStyle(ButtonStyle.Danger)
    );

    const sentMessage = await interaction.reply({ 
      content: '버튼을 선택하세요!', 
      components: [row],
      fetchReply: true // interaction.reply의 반환값을 Message 객체로 받기 위해 필요
    });

    let isRunning = true; // 반복문 제어 플래그
    let count = 0;

    while (isRunning) {
      try {
        // 버튼 클릭을 기다림 (최대 10초)
        const buttonInteraction = await sentMessage.awaitMessageComponent({ 
          filter: i => i.user.id === interaction.user.id, // 명령어를 입력한 사용자만 처리
          time: 10_000 // 10초 대기
        });

        // 버튼 ID별 분기 처리
        if (buttonInteraction.customId === 'next') {
          count++;
          await buttonInteraction.update({
            content: `${count}`,
            components: [row] // 버튼 유지
          });
        } else if (buttonInteraction.customId === 'exit') {
          isRunning = false; // 반복문 종료
          await buttonInteraction.update({ 
            content: '종료합니다.', 
            components: [] // 버튼 제거
          });
        }
      } catch (error) {
        console.log('시간 초과 또는 오류 발생');
        await interaction.followUp('버튼 선택 시간이 초과되었습니다.');
        isRunning = false; // 반복문 종료
      }
    }
  },
};