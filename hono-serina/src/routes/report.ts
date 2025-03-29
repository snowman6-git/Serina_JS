import { Root_of } from '../lib/SGears';
import { Database } from "bun:sqlite";

const root_of = new Root_of

export function report(c: any){
    // const action = c.req.param('what');
    const uid = c.req.query('uid');
    const db = new Database(root_of.file("main.db"))

    
    const chat_sql_preset = `SELECT * FROM chat_log WHERE uid = ? ORDER BY id DESC LIMIT 2;`
    let a = db.run(chat_sql_preset, [uid])


    console.log(a)
    return c.json(a)
}