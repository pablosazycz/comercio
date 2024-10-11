const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.mostrarRegistro = (req, res) => {
	res.render("usuarios/registro" , { layout: 'layout-login' });
};

exports.registerUsuario = async (req, res) => {
	const { nombre, apellido, email, password, confirmPassword } = req.body;

	if (password !== confirmPassword) {
		return res.render("usuarios/registro", {
			error: "Las contraseñas no coinciden",
			layout: 'layout-login'
		});
	}

	const existeUser = await Usuario.findOne({ email });
	if (existeUser) {
		return res.render("usuarios/registro", {
			error: "El email ya está registrado",
			layout: 'layout-login'
		});
	}

	const nuevoUsuario = new Usuario({
		nombre,
		apellido,
		email,
		password: await bcrypt.hash(password, 10),
	});

	try {
		await nuevoUsuario.save();
		res.redirect("/usuarios/login");
	} catch (error) {
		res.render("usuarios/registro", {
			error: "Hubo un error al registrar el usuario",
			layout:'layout-login'
		});
	}
};

exports.mostrarLogin = (req, res) => {
	res.render("usuarios/login", { layout: 'layout-login' });
};

exports.iniciarSesion = (req, res, next) => {
	passport.authenticate("local", (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.render("usuarios/login", {
				error: "Usuario o contraseña incorrectos",
				layout: 'layout-login'
			});
		}
		req.logIn(user, (err) => {
			if (err) {
				return next(err);
			}
			return res.redirect("/usuarios/perfil");
		});
	})(req, res, next);
};

exports.cerrarSesion = (req, res) => {
	req.logout((err) => {
		if (err) {
			return res.status(500).send("Hubo un error al cerrar sesión");
		}
		res.redirect("/usuarios/login");
	});
};

exports.mostrarPerfil = (req, res) => {
	if (!req.isAuthenticated()) {
		return res.redirect("/usuarios/login");
	}
	res.render("usuarios/perfil", { usuario: req.user });
};
