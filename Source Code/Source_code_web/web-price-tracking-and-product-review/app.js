const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const cors = require("cors");

var createError = require("http-errors");
var path = require("path");
//var cookieParser = require("cookie-parser");
var logger = require("morgan");
var exphbs  = require('express-handlebars');

var indexRouter = require("./routers/index");
var productRouter = require("./routers/product");


//require('dotenv/config');

const app = express();
app.use(cors());

// view engine setup
app.engine('.handlebars', exphbs({
  extname: '.handlebars',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', 'handlebars');

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
//app.use(express.static(path.join(__dirname, "public")));
// app.use(passport.initialize());

app.use("/", indexRouter);
app.use("/product", productRouter);

mongoose.Promise = Promise;
const run = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://baotran:Bao123456@cluster0.djrnk.mongodb.net/shopee",
      //"mongodb+srv://bao_tran:Bao0123456@cluster0.fsv6l.mongodb.net/TMDT",
      // "mongodb+srv://baotran:Bao123456@cluster0.djrnk.mongodb.net/ProductComment",
      //"mongodb+srv://baotran:Bao123456@cluster0.djrnk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
  } catch (err) {
    console.log(err);
  }
};
run()

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//app.use(bodyParser.json());

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// app.get('/', function (req, res) {
//   res.render('home');
// });

module.exports = app;