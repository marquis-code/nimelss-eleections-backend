const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
const dbOptions = {
    useNewUrlParser : true,
    useUnifiedTopology : true
}

const MONGOURI = 'mongodb+srv://NimlssaElections:NimelssaElections2023@nimelssa-elections.oq27ick.mongodb.net/?retryWrites=true&w=majority'

const connectBD = () => {
    mongoose.connect(MONGOURI, dbOptions).then(() => {
        console.log('Connection to MongoDB database')
    }).catch((error) => {
        console.log('Something went wrong while connecting to mongoDB database.')
    })
}

module.exports = connectBD