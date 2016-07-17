function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
}
var Rules=function(param,VK) {
    this.textMsg = param.textMsg;
    this.fromId = param.fromId;
    var self=this;
    let helloMas = ['Здравствуйте!', 'Привет!', 'Доброе утро!', 'Добрый день!', 'Добрый вечер!', 'Салют!', 'Здорово!'];
    VK.request('messages.send', {
        'user_id': self.fromId,
        'message': helloMas[randomInteger(0, helloMas.length - 1)]
    });
}
module.exports =Rules;