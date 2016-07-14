//https://oauth.vk.com/authorize?client_id=5546514&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=friends,messages,offline,photos,audio,video,docs,wall&response_type=token
var request=require('request');

var fetch = require('node-fetch');

var vkRequest = function (param) {
    this.access_token = param.access_token;
    this.app_id = param.app_id;
    this.v = param.v || '5.52';

};

vkRequest.prototype.request = function (method, param) {
    var headers = {
        'User-Agent':       'Super Agent/0.0.1',
        'Content-Type':     'application/x-www-form-urlencoded'
    }
    var q=Object.assign(param,{access_token:this.access_token});
    var options = {
        url: `https://api.vk.com/method/${method}`,
        method: 'GET',
        headers: headers,
        qs: param
    };
    return new Promise(function (resolve, reject) {
        request(options, function (error, response, body) {
            if (body.status === 'error') reject(error);
            if (!error && response.statusCode == 200) {
                // Print out the response body
                resolve(body);
            }
            else {
                reject(error);
            }
        });
    })
};


module.exports = vkRequest;
