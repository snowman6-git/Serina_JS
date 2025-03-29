import { Hono } from 'hono'
import { cors } from 'hono/cors'

//route
import { welcome } from './routes/welcome'
import { sinner } from './routes/sinner'
import { report } from './routes/report'

//bun
import { mysql } from 'mysql2/promise'

const dbConfig = {
  host: 'localhost', // MySQL 서버 호스트
  user: 'your_user', // MySQL 사용자 이름
  password: 'your_password', // MySQL 비밀번호
  database: 'your_database' // 사용할 데이터베이스 이름
}

const pool = mysql.createPool(dbConfig)


const app = new Hono()

app.use(
    '*',
    cors({
    //   origin: '*',
      origin: 'http://localhost:5173',
    //   allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
      allowMethods: ['POST', 'GET', 'OPTIONS'],
    //   exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
      maxAge: 600,
      credentials: true,
    })
)


app.get('/', welcome) //함수자체를 인자로 씀
app.get('/report', report)
// app.get('/report/:what', report)

export default app