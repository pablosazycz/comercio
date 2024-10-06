const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const expressLayouts = require('express-ejs-layouts');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productoRouter = require('./routes/producto');
const contactoRouter = require('./routes/contacto');

const app = express();
// Conexión a la base de datos
connectDB();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middlewares 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);


//rutas 
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/producto', productoRouter);
app.use('/contacto',contactoRouter);

// app.get(' ', (req, res) => {
//   res.render('index', { titulo: 'LA CONCHA DE TU MADRE'});
// });

// app.get('/contacto', (req, res) => {
//   res.render('contacto', { titulo: 'Contacto'});
// });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
