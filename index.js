const fs = require('fs');
const path = require('path');

import { Database } from "bun:sqlite";
const { DB, TOKEN, CLIENT_ID, GUILD_ID } = require('./config.json');
const { Client, GatewayIntentBits, REST, ActionRowBuilder, ButtonBuilder, ButtonStyle, Routes } = require('discord.js');


const db = new Database(DB)
// db.query("drop table community_chat").run()
// db.query(`CREATE TABLE IF NOT EXISTS community_chat(id INTEGER PRIMARY KEY AUTOINCREMENT, user text, uid INTEGER, chat text, guild_id INTEGER, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`).run()
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

// db.query("drop table community_chat;").run()

client.on('messageCreate', async(message) => {
  if (message.author.bot) return;
  let text = message.content
  

  if (message.attachments.size > 0) {
    text += message.attachments.map((attachment) => attachment.url);
  }

  const chat_sql_preset = `INSERT INTO chat_log(user, uid, chat, guild_id) Values(?, ?, ?, ?);`
  db.run(chat_sql_preset, [message.author.displayName, message.author.id, text, message.guild.id])

});

client.on('ready', () => {
  console.log(`✅ ${client.user.tag} 로그인 성공`);
  db.run("CREATE TABLE IF NOT EXISTS chat_log(id INTEGER PRIMARY KEY AUTOINCREMENT, user text, uid INTEGER, chat text, guild_id, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP);")
  Command_Setup();
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;
  const command = commands.find(cmd => cmd.name === interaction.commandName);
  if (command) {
    await command.execute(interaction, client);
  }
});
client.login(TOKEN);