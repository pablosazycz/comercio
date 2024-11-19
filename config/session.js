const session = require('express-session');
const MongoStore = require('connect-mongo');

module.exports = () =>{
    return session({
        secret:process.env.SESSION_SECRET || 'tu_secreto_lala',
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
          mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/comercio',
          ttl: 14 * 24 * 60 * 60  // Tiempo de vida de 14 días
        }),
        cookie: { secure: false }  
    });
};