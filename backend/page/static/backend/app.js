var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const { Pool } = require('pg');

      const port = process.env.PORT || 5000;

      const pool = new Pool({
        user: 'root',
        host: 'localhost',
        database: 'mydatabase',
        password: , // Ensure to add your password here
        port: 3306,
      });



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/', async (req, res) => {
        try {
          const result = await pool.query('SELECT * FROM my_table');
          res.json(result.rows);
        } catch (err) {
          console.error(err);
          res.status(500).send('Error fetching data');
        }
      });

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

app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });


module.exports = app;
