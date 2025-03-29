import { Root_of } from '../lib/SGears';
import { Database } from "bun:sqlite";

const root_of = new Root_of

export function sinner(c: any){

    const db = new Database(root_of.file("main.db"))
    const action = c.req.param('what');

    let result = ""

    switch (action) {
        case "find":
            const name = c.req.query('name')?.toString()
            const keyword = c.req.query('keyword')?.toString() || undefined

            let sql_init = ""
            //차후 동적추가 쿼리 만들기

            if(keyword == undefined){
                //id도 리턴해서 나중에 프론트 이미지 아님 디비에 넣든가 따로 호출하던지 알아서 ㄱㄱ 
                let sinner = db.query(`
                    SELECT s_keyword.personality, s_keyword.id
                    FROM sinner_keyword s_keyword
                    JOIN sinner s_name ON s_keyword.id = s_name.id AND s_name.name = '${name}'
                `).all()
                return c.json(sinner)
            } else {
                let sinner_with_keyword = db.query(`
                    SELECT s_keyword.* 
                    FROM sinner_keyword s_keyword
                    JOIN sinner s_name ON s_keyword.id = s_name.id AND s_name.name = '${name}'
                    WHERE s_keyword.keyword = '${keyword}';
                `).all()
                return c.json(sinner_with_keyword)
            }

        case "list":
            return c.text("list")

        case "by_keyword":
            return c.text("key")
    }
}