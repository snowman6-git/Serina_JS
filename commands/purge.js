// 1 (String): 일반적인 텍스트 문자열입니다.
// 4 (Integer): 정수 숫자입니다.
// 5 (Boolean): 참 또는 거짓 값입니다.
// 3 (Number): 부동 소수점 숫자입니다. (정수형 숫자도 포함될 수 있습니다.)
// 7 (User): 사용자 (멘션) 입니다.
// 8 (Channel): 채널 입니다.
// 9 (Role): 역할 입니다.

module.exports = {
  name: '삭제',
  description: '메세지 삭제',
  options: [
    {
      name: "count",
      description: "메세지 지울거 갯수",
      required: true,
      type: 4, //정수값
    }
  ],
  async execute(interaction) {
    try {

      let purge_count = interaction.options.get('count').value
      
      let int_check = /^[0-9]+$/.test(purge_count)
      
      if(!int_check){
        console.log(interaction.user)
        await interaction.reply(`정말 놀랐어요 ${interaction.user.username}님, 어떻게 한건진 모르겠지만,\ndiscord의 int만 받기를 무시하고 저에게 정수값이 아닌걸 주셨군요!`);
      }

      await interaction.deferReply({ content: `삭제중이에요...${purge_count}개 남음` });


      try{
        if (purge_count >= 100){
          for (let i = 0; i < 10; i++) {
            await interaction.channel.bulkDelete(100);
            await new Promise(resolve => setTimeout(resolve, 3000));
            purge_count -= 100 //100씩 줄이기
          }
        }
      } catch(er) {
        if(er.code == 50034){
          console.log("오래된 메세지를 발견하여 개별삭제합니다")
          const fetch_messages = await interaction.channel.messages.fetch({ limit: 100 });
          const messagesArray = fetch_messages.values();
          const messages = Array.from(messagesArray);
          for(const target of messages){await target.delete();}
        }
      }
      finally{
        interaction.channel.bulkDelete(purge_count)
      }
      

    } catch (error) {
      console.error('Error responding to interaction:', error);
      await interaction.reply('오류가 발생했습니다.');
    }
  },
}