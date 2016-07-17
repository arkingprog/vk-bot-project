var fetch = require('node-fetch');
var cheerio = require('cheerio');

var Rules=function(param,VK) {
    this.textMsg=param.textMsg;
    this.fromId=param.fromId;
    var self=this;
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
        VK.request('messages.send', {'user_id': self.fromId, 'message': quoteText})
    });
};
module.exports=Rules;
