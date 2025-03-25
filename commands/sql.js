const { DB } = require('../config.json');
const { Database } = require("bun:sqlite");

const db = new Database(DB)

module.exports = {

  name: '조회',
  description: '데이터베이스에 기록된 정보를 조회합니다.',
  options: [

    {
      name: "uid",
      description: "유저 아이디를 입력 받아서 조회해요",
      required: true,
      type: 3, //정수값
    },

    // {
    //   name: "조회할 갯수",
    //   description: "조회갯수를 정해요",
    //   required: false,
    //   type: 4, //정수값
    // }

  ],
  async execute(interaction) {
    let log = ""
    
    let uid = interaction.options.get('uid').value
    // const result = db.query(`SELECT * FROM chat_log WHERE uid = ${uid}`).all()
    const result = db.query(`SELECT * FROM chat_log WHERE uid = ${uid} ORDER BY id DESC LIMIT 2`).all()


    result.forEach(function(sql_block) {
      log += `-# ${sql_block["created"]}\n${sql_block["user"]}: ${sql_block["chat"]}\n`
    });


    
    await interaction.reply(log);
    // await interaction.reply(`${JSON.stringify(result)}`);
  },
}