const Order = require('../../../models/order')
const moment = require('moment')

function orderController () {
    return {
        store(req, res){
            //validate request
            const {phone, address} = req.body
            if(!phone || !address){
                req.flash('error', 'All fields are required')
                return res.redirect('/cart')
            }

            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                phone,
                address
            })

            order.save().then(result => {
                req.flash('success', 'Order placed successfully')
                delete req.session.cart
                return res.redirect('/customers/orders')
            }).catch(err => {
                req.flash('error', 'Something went wrong')
                return res.redirect('/register')
            })
        },

        //orders to be fetch from the database.
        //To do thiswe can use callback to run the query of the database
        //thrn and catch can be used
        //async await can be used
        async index(req, res){
            const orders = await Order.find({customerId: req.user._id }, null, { sort: {'createdAt' : -1}})
            res.render('customers/orders', {orders: orders, moment: moment})
        }
    }
}

module.exports = orderController