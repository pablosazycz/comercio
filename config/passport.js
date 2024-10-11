require('dotenv').config();
const localStrategy = require("passport-local").Strategy;
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");

module.exports = function (passport) {
  passport.use(
    new localStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const usuario = await Usuario.findOne({ email });
          if (!usuario) {
            return done(null, false, { message: "Usuario no encontrado" });
          }
          const passwordCorrecto = await bcrypt.compare(
            password,
            usuario.password
          );
          if (passwordCorrecto) {
            return done(null, usuario);
          } else {
            return done(null, false, {
              message: "Usuario y/o contraseña incorrecta",
            });
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((usuario, done) => {
    done(null, usuario.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const usuario = await Usuario.findById(id);
      done(null, usuario);
    } catch (error) {
      done(error, null);
    }
  });
};
