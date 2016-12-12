const vk = new (require('./VKApi'))();
const cm = new (require('./CommandManager'))();
const eHttp = new (require('./EasyHttp'))();
    
var BotUtils = function(bot){

    var self = this;

    self.getUser = function(params){
        return bot.request('users.get', params);
    };

    self.getAvatar = function(user_id){
        return new Promise((resolve, reject) => {
            self.getUser({'user_id': user_id, 'fields':'photo_id'}).then((resp) => {
                resolve({'owner_id': user_id,'item_id': resp.response[0].photo_id.split('_')[1]});
            });
        });
    };
};

var bot = function(){

    var self = this;

    var selfUser = null;

    var utils = new BotUtils(self);

    self.auth = function(login, pass){ 
        return new Promise(function(resolve, reject) {
            eHttp.promiseGet('https://oauth.vk.com/token?' + eHttp.stringifyParams({
                'grant_type': 'password', 
                'client_id': 3697615, 
                'client_secret': 'AlVXZFMUqyrnABp8ncuU', 
                'username': login, 
                'password': pass, 
                'scope': 'friends,offline,photos,audio,video,docs,notes,pages,status,offers.questions,wall,groups,messages,email,notifications,stats,ads' 
            })).then((resp) => {
                resp = JSON.parse(resp);
                self.setToken(resp.access_token);
                resolve(resp);
            });
        });
    };

    this.setToken = function(token){
        this.getVK().setToken(token);
    };

    this.request = function(_method, _params, _callback){
        return self.getVK().request(_method, _params);
    }

    this.getVK = function(){
        return vk;
    };

    this.setSelf = function(_self){
        if(_self.response) selfUser = _self.response[0];
    }

    this.getSelf = function(){
        return selfUser;
    };

    this._sendMessage = function(message, data){
        return self.sendMessage({
            'peer_id': data.peer_id,
            'message': message,
            'forward_messages': data.message_id
        });
    };

    this.sendMessage = function(params, callback){
        return this.request('messages.send', params);
    };

    self.getUtils = function(){
        return utils;
    };

};

if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ?
                args[number] :
                match;
        });
    };
};

module.exports = bot;

