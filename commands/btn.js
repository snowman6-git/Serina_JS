const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function into_player(username, uid) {
  player = {
    name: username,
    uid: uid,
    hp: 50,
    mental: 0,
  }
  return player
}

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
      time: 5_000,
    });

    let party = []
    collector.on('collect', async buttonInteraction => {
      let username = buttonInteraction.user.globalName
      let user_id = buttonInteraction.user.id
      if (buttonInteraction.customId === 'next') {

        if (!party.includes(username)) {
          party.push(await into_player(username, user_id))
        } else{
          await interaction.followUp({ 
            content: `-# 이 메세지는 저희가 지워드릴 수 없어요...\n${username}님은 이미 참가하셨어요.`, 
            ephemeral: true, // 해당 유저에게만 보이는 메시지
          })
        }
        //아니면 겜시작하고 플레이어로 만들던가
        const sorted_party = party.map(item => item.name).toString().replace(",", "\n");
        await buttonInteraction.update({
          content: `${sorted_party}`,
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

      let i = true
      while(i){
        
        party.forEach(async function(turn_of) {
          await sentMessage.edit({
            content: `${turn_of.name}의 차례!`,
            components: [] // 버튼 제거
          });
          await sleep(1000)
        });
        i = false
      }

      if (collected.size < 2) {
        await sentMessage.edit({
          content: '모집된 인원이 부족합니다! 종료합니다',
          components: [] // 버튼 제거
        });
      }
    });

  },
};