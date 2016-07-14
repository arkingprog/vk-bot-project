var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var moment = require('moment');
var cheerio = require('cheerio');
var fetch = require('node-fetch');
var vkRequest = require('./api/vk-request');
var vkBot = require('./api/vk-bot');
//
// var bot=new vkBot();
// bot.run();

var VK = new vkRequest({
    access_token: 'ee063506bcc4ff0215fd98ab69a7e9928638d0b48419484f5bbf8683affd8d60fc8b9e914403807cc4297',
    app_id: '5546514'
});

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


var access_token = 'ee063506bcc4ff0215fd98ab69a7e9928638d0b48419484f5bbf8683affd8d60fc8b9e914403807cc4297';
var app_id = '5546514';
var key = null;
var ts = null;
var vkServer = null;
let helloMas = ['Здравствуйте!', 'Привет!', 'Доброе утро!', 'Добрый день!', 'Добрый вечер!', 'Салют!', 'Здорово!'];
function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}

function getNewData(_ts) {
    if (!key || !ts) {
        fetch(`https://api.vk.com/method/messages.getLongPollServer?access_token=${access_token}`)
            .then(data => data.json())
            .then((body)=> {
                key = body.response.key;
                ts = body.response.ts;
                vkServer = body.response.server;
                getNewData(ts);
            });
        return;
    }
    fetch(`https://${vkServer}?act=a_check&key=${key}&wait=25&mode=2&ts=${_ts}`).then(function (data) {
        return data.json()
    })
        .then(function (body) {
            if (body.updates.length == 0) {
                console.log(body);
                getNewData(body.ts);
                return;
            }
            let mas = body.updates[0];
            let textMsg, fromId;
            if (mas[0] == 4) {
                textMsg = mas[6];
                fromId = mas[3];
                /////Обработка команд
                ////////////////////////
                if (textMsg.match(/^привет/)) {
                    VK.request('messages.send', {
                        'user_id': fromId,
                        'message': helloMas[randomInteger(0, helloMas.length - 1)]
                    }).then(
                        function (body) {
                        }
                    );
                }
                if (textMsg.match(/^время/)) {
                    VK.request('messages.send', {'user_id': fromId, 'message': moment().toString()})
                }
                if (textMsg.match(/^bash/)) {
                    fetch('http://bash.im/random').then(function (res) {
                        return res.text();
                    }).then(function (body) {
                        var $ = cheerio.load(body);
                        var quotes = $('.quote > .text');
                        var quoteText = '';
                        quotes[0].children.forEach(function (item, i, arr) {
                            if (item.data)
                                quoteText += item.data;
                            else
                                quoteText += '\n'
                        });
                        VK.request('messages.send', {'user_id': fromId, 'message': quoteText})
                    });
                }
                ///////////////////////
            }
            getNewData(body.ts);
        })
    ;
}
getNewData(ts);


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
