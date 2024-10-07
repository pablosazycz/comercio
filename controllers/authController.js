const passport =   require('passport');
const Usuario = require('../models/Usuario');

exports.login = async (req,res,next) => {
    passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/login',
    })(req,res,next);
};

exports.register = async (req,res) => {
    const {email, password} = req.body;
    const usuario = new Usuario({email});
    await Usuario.register(usuario, password);
    res.redirect('/login');
};
