const express = require('express');
const app = express()
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const connectDB = require('./database/db')
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')
dotenv.config()

connectDB()
 
const corsOptions = {
  credentials : true,
  optionSuccessStatus : 200
}
app.use(cors(corsOptions))
app.use(morgan("dev"))
app.use(helmet())
app.use(cookieParser())
app.use(express.urlencoded({extended : true}))
app.use(express.json())

const authRouter = require("./routes/auth")
const candidateRouter = require("./routes/candidate")

app.use('/api/auth', authRouter)
app.use('/api/candidate', candidateRouter)

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Listening on https://localhost:${port}`)
})
module.exports = app