const authController = require('../app/http/controllers/authController')
const homeController = require('../app/http/controllers/homeController')
const cartController = require('../app/http/controllers/customers/cartController')

function initRoutes(app) {
    //after calling the function homeController we will be provided with an object and using this object we will call a method index
    app.get('/', homeController().index) // the function in the second parameter has req and res

    // (req, res) =>{
    //     res.render('home')
    // }
    app.get('/login', authController().login)
    
    app.get('/register', authController().register)

    app.get('/cart', cartController().cart)
    app.post('/update-cart', cartController().update)
}
//Some comments are being added in this file and will be removed later.
module.exports = initRoutes