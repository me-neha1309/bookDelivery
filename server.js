require('dotenv').config()
const express = require('express')
//exporting the express module
// afunction gets imported here

const app = express()
//as we call the function it returns us an object of express
//this object contains all the functionalities that express provides us.


const ejs = require('ejs')
const path = require('path') //in-built module of node i.e. path
const expressLayout = require('express-ejs-layouts')

const PORT = process.env.PORT || 3000
//process.env resides outside our app. It is stored inside the process of the node. If it contains PORT variable then we will use PORT otherwise we will run it on 3000
//3000 port is avilable on our live machine but it can be possible that this port will not be available on our live server
const mongoose = require('mongoose')

const session = require('express-session')
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session)
const passport = require('passport')
const Emitter = require('events')

//Database Connection
//This snippet is used in whenever we connect to Mongodb
//-------------------------------START OF THE SNIPPET--------------------------------------

mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database Connected...');
}).catch(err => {
    console.log('Connnection failed...');
});


//------------------------------END OF THE SNIPPET-----------------------------------------

//------------------------------SESSION-STORE----------------------------------------------

let mongoStore = new MongoDbStore({
    mongooseConnection: connection,
    collection: 'sessions'
})

//------------------------------SESSION CONFIG-------------------------------------------

//all the secret keys, passwords, api key etc should be stored in code.  A file called environment(env) file is created in which all variables are stored
//we can get these variables into our files. To implement this we install yarn add dotenv

//Event Emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)

app.use(session({
    //by default sessions arestored in database.
    secret: process.env.COOKIES_SECRET,
    resave: false,
    //sessions are to be stored under here given below
    store: mongoStore,
    saveUninitialized: false,
    //store: mongoStore,
    cookie: { maxAge: 1000 * 60 * 24}
}))

//passport configuration should be after session
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

//-----------------ASSETS-----------------------------------------------------
app.use(express.static('public'))
//sometimes we can receive data of type url encoded so for this we'll HAVE TO DO
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//Global middleware
app.use((req, res, next) => {
    res.locals.user = req.user
    res.locals.session = req.session 
    next()
})
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)

//for page not found
app.use((req, res) => {
    res.status(404).render('errors/404')
})

const server = app.listen(3000, () => {
    console.log('Listening PORT 3000')
    console.log(`Listening on port once more ${PORT}`) // to use the variable we'll have to use the back ticks
})

//socket
const io = require('socket.io')(server)
io.on('connection', (socket) => {
    // join
    //console.log(socket.id)
    socket.on('join', (orderId) => {
        //console.log(orderId)
        socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data) => {
    io.to('adminRoom').emit('orderPlaced', data)
})















































