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
const pollRouter = require("./routes/poll")
const candidateRouter = require("./routes/candidate")
const adminRouter = require("./routes/admin")

app.use('/api/auth', authRouter)
app.use('/api/poll', pollRouter)
app.use('/api/candidate', candidateRouter)
app.use('/api/admin', adminRouter)

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//     var err = new Error('Not Found');
//     err.status = 404;
//     next(err);
//   });
  
//   // error handler
//   app.use(function(err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
  
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
//   });
  

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`Listening on https://localhost:${port}`)
})
module.exports = app