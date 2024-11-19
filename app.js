require('dotenv').config();

const express = require("express");
const createError = require("http-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const session = require("./config/session");

const flash = require("connect-flash");
const configureSocket = require("./config/socket");

// webapp
const authRouter = require("./routes/auth");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const productoRouter = require("./routes/producto");
const contactoRouter = require("./routes/contacto");
const usuarioRouter = require("./routes/usuario");
const categoriaRouter = require("./routes/categoria");
const carroRouter = require("./routes/carro");
const pedidoRouter = require("./routes/pedido");
const chatRouter = require("./routes/chat");
const operatorRouter = require("./routes/operator");

// API
const apiAuthRputer = require("./routes/apiAuth");
const apiProductoRouter = require("./routes/apiProducto");
const apiCategoriaRouter = require("./routes/apiCategoria");




const app = express();
// Conexión a la base de datos
connectDB();
require("./config/passport")(passport);

//websocket
const server = require("http").createServer(app);
const io = require("./config/socket")(server);


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// app.set("view engine", "pug");


// app.use(session({
//   secret:process.env.SESSION_SECRET || 'tu_secreto_lala',
//   resave: false,
//   saveUninitialized: true,
//   store: MongoStore.create({
//     mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/comercio',
//     ttl: 14 * 24 * 60 * 60  // Tiempo de vida de 14 días
//   }),
//   cookie: { secure: false }  // Cambia a true si usas HTTPS
// }));

//middlewares
app.use(session());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
//rutas
app.use("/auth", authRouter);
app.use("/", indexRouter);
app.use("/producto", productoRouter);
app.use("/contacto", contactoRouter);
app.use("/usuarios", usuarioRouter);
app.use("/categorias", categoriaRouter);
app.use('/carro', carroRouter);
app.use('/pedido', pedidoRouter);
app.use("/chat", chatRouter);
app.use("/operator", operatorRouter);

// API
app.use("/api", apiAuthRputer);
app.use("/api", apiProductoRouter);
app.use("/api", apiCategoriaRouter);


const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
