const authController = require('../app/http/controllers/authController')
const homeController = require('../app/http/controllers/homeController')
const cartController = require('../app/http/controllers/customers/cartController')
const guest = require('../app/http/middlewares/guest')

function initRoutes(app) {
    //after calling the function homeController we will be provided with an object and using this object we will call a method index
    app.get('/', homeController().index) // the function in the second parameter has req and res

    // (req, res) =>{
    //     res.render('home')
    // }
    app.get('/login', guest, authController().login)
    app.post('/login',  authController().postLogin)
    app.get('/register', guest,  authController().register)
    app.post('/register', authController().postRegister)
    app.post('/logout', authController().logout)
    app.get('/cart', cartController().cart)
    app.post('/update-cart', cartController().update)
}
//Some comments are being added in this file and will be removed later.
module.exports = initRoutes