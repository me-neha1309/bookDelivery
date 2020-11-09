const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { request } = require('express')

function init(passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async(email, password, done) => {
        //login
        //check if email address
        const user = await User.findOne({ email: email })
        if(!user){
            return done(null, false, {message: 'No user with this email' })
        }

        bcrypt.compare(password, user.password).then(match => {
            if(match){
                return done(null, user, {meassage: 'Logged in Successfully'})
            }

            return done(null, false, {message: 'Wrong username or password'})
        }).catch(err => {
            return done(null, false, {message: 'Something went wrong'})
        })
    }))
    //After successful log in we store the id of the user in the session to know whether theuser has been logged in or not
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser((id, done) =>{
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}


module.exports = init