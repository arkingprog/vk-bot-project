var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var vkBot = require('./api/vk-bot');
var rulesBash = require('./api/rules/bash');
var rulesHello = require('./api/rules/hello');
var vkRequest = require('./api/vk-request');
VK = new vkRequest({
    access_token: 'ee063506bcc4ff0215fd98ab69a7e9928638d0b48419484f5bbf8683affd8d60fc8b9e914403807cc4297',
    app_id: '5546514'
})
var bot = new vkBot({
    access_token: 'ee063506bcc4ff0215fd98ab69a7e9928638d0b48419484f5bbf8683affd8d60fc8b9e914403807cc4297',
    app_id: '5546514'
});
bot.addRules('bash',rulesBash);
bot.addRules('привет',rulesHello);
bot.run();


var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
