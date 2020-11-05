const Menu = require('../../models/menu')


function homeController() {
    //factory functions produce object
    return {
        //we will grouping methods in an object.
        async index(req, res){
            // const books = await Menu.find()
            // console.log(books)
            // return res.render('home', {books: books})
            Menu.find().then(function(books) {
                //console.log(books)
                return res.render('home', { books: books})
            })
            
        }
    }
}

module.exports = homeController