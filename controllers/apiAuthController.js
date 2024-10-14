const passport = require("passport");
const Usuario = require("../models/Usuario");

exports.apiLogin = async (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(500).json({ error: "Error en el servidor" });
    }

    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Error al iniciar sesión" });
      }
      return res.status(200).json({
        message: "Inicio de sesión exitoso",
        user: {
          id: user._id,
          nombre: user.nombre,
          email: user.email,
          rol: user.rol,
        },
      });
    });
  })(req, res, next);
};
