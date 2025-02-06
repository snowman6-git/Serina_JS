const fs = require('fs');
const path = require('path');

import { Database } from "bun:sqlite";
const { DB, TOKEN, CLIENT_ID, GUILD_ID } = require('./config.json');
const { Client, GatewayIntentBits, REST, ActionRowBuilder, ButtonBuilder, ButtonStyle, Routes } = require('discord.js');


const db = new Database(DB)
db.query("drop table community_chat").run()
db.query(`CREATE TABLE IF NOT EXISTS community_chat(id INTEGER PRIMARY KEY AUTOINCREMENT, user text, uid INTEGER, chat text, guild_id INTEGER, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`).run()
const client = new Client({
  disableMentions: "everyone",
  intents:  [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  // allowedMentions: { 
  //   repliedUser: false, // reply 멘션 비활성화
  //   users: false,       // 사용자 멘션 비활성화
  //   roles: false,       // 역할 멘션 비활성화
  //   everyone: false     // @everyone 및 @here 비활성화
  // }
});

const commands = [];
const rest = new REST().setToken(TOKEN);

const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command);
}

async function Command_Setup() {
  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log(`✅ 슬래시 명령어 등록 완료`);
  } catch (error) { console.error('❌ 명령어 등록 실패:', error) }
}

client.on('messageCreate', async message => {
  if (message.content === '!버튼') {
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
    const sentMessage = await message.reply({ 
      content: '버튼을 선택하세요!', 
      components: [row] 
    });
    let isRunning = true; // 반복문 제어 플래그
    let count = 0;
    while (isRunning) {
      try {
        // 버튼 클릭을 기다림 (최대 10초)
        const interaction = await sentMessage.awaitMessageComponent({ 
          filter: i => i.user.id === message.author.id, // 명령어를 입력한 사용자만 처리
          time: 10_000 // 10초 대기
        });

        // 버튼 ID별 분기 처리
        if (interaction.customId === 'next') {
          await interaction.update({
            content: `${count}`
          })
          count++

          // await interaction.reply('다음 버튼이 눌렸습니다!');
        } else if (interaction.customId === 'exit') {
          isRunning = false; // 반복문 종료
          await interaction.reply('종료합니다.');
        }
      } catch (error) {
        console.log('시간 초과 또는 오류 발생');
        await message.reply('버튼 선택 시간이 초과되었습니다.');
        isRunning = false; // 반복문 종료
      }
    }
  }
});


// client.on('messageCreate', async(message) => {
//   if (message.author.bot) return;
//   let text = message.content
//   if (message.attachments.size > 0) {
//     text += message.attachments.map((attachment) => attachment.proxyURL);
//   }
//   //나중에 길드별로 테이블할지 결정 id를 기반으로 테이블 2정규화 하기 + sql인젝션 방지(나만 되게) + 쓸만하다 싶으면 닉 말고 전부 id로만
//   db.query(`INSERT INTO community_chat(user, uid, chat, guild_id) Values('${message.author.displayName}', '${message.author.id}', '${text}', '${message.guild.id}');`).run()
// });

client.on('ready', () => {
  console.log(`✅ ${client.user.tag} 로그인 성공`);
  Command_Setup();
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const command = commands.find(cmd => cmd.name === interaction.commandName);
  if (command) {
    await command.execute(interaction);
  }
});
client.login(TOKEN);