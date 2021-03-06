var fetch = require('node-fetch');
var vkRequest = require('../api/vk-request');

var VK;
var key = null;
var ts = null;
var vkServer = null;

var rulesMap = new Map();
var vkBot = function (param) {
    this.access_token = param.access_token;
    VK = new vkRequest({
        access_token: param.access_token,
        app_id: param.app_id
    })
};
;


vkBot.prototype.addRules = function () {
    if (arguments.length == 1)
        console.log('array');
    if (arguments.length == 2) {
        var textMatch = arguments[0];
        var func = arguments[1];
        rulesMap.set(textMatch, func);
    }
    return this;
};

vkBot.prototype.getVKCredentials=function () {
    return {
        access_token:this.access_token,
        app_id:this.app_id
    }
};
vkBot.prototype.run = function _run(_ts) {
    if (!key || !ts) {
        fetch(`https://api.vk.com/method/messages.getLongPollServer?access_token=${this.access_token}`)
            .then(data => data.json())
            .then((body)=> {
                key = body.response.key;
                ts = body.response.ts;
                vkServer = body.response.server;
                _run(ts);
            });
        return;
    }
    fetch(`https://${vkServer}?act=a_check&key=${key}&wait=25&mode=2&ts=${_ts}`).then(function (data) {
        return data.json()
    })
        .then(function (body) {
            if (body.updates.length == 0) {
                _run(body.ts);
                return;
            }
            let mas = body.updates[0];
            let textMsg, fromId;
            if (mas[0] == 4) {
                textMsg = mas[6];
                fromId = mas[3];
                /////Обработка команд
                ////////////////////////
                for (var [key, func] of rulesMap) {
                    if (textMsg.match(new RegExp('^' + key))) {
                        func({textMsg: textMsg, fromId: fromId}, VK);
                    }
                }
                ///////////////////////
            }
            _run(body.ts);
        })
    ;
};

module.exports = vkBot;
