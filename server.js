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

app.use(express.static('public'))
app.get('/', (req, res) => {
    res.render('home');
})

app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

app.listen(3000, () => {
    console.log('Listening PORT 3000')
    console.log(`Listening on port once more ${PORT}`) // to use the variable we'll have to use the back ticks
})













































