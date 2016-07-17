var moment = require('moment');

var Rules=function(param,VK) {
    this.textMsg = param.textMsg;
    this.fromId = param.fromId;
    var self = this;
    VK.request('messages.send', {'user_id': self.fromId, 'message': moment().toString()})

};
module.exports=Rules;