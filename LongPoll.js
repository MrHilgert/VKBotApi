
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var EasyHttp = require('./EasyHttp')

var LongPoll = function(vk, selfUser){

    var self = this;

    var eHTTP = new EasyHttp();

    var serverInfo = null;

    this.start = function(_serverInfo){
        serverInfo = _serverInfo;
        this.loop();
    };

    this.loop = function(){
         eHTTP.get("https://" + serverInfo.server, self.getServerInfo(), self.onUpdate);
    };

    this.onUpdate = function(res){

        res = JSON.parse(res);

        if(res.failed){
            if(res.failed == 1) serverInfo.ts = res.ts;
            
            if(res.failed >= 2){
                vk.request('messages.getLongPollServer').then((resp) => {
                    self.start(resp.response);
                });
            }
            
            return;
        }

        if(res.ts) serverInfo.ts = res.ts;
        
        if(res.updates){

            for(update in res.updates){

                var upd = res.updates[update];

                if(upd[0] == 4){

                    var data = {
                        'message_id': upd[1],
                        'flags': self.getFlags(upd[2]),
                        'peer_id': upd[3],
                        'time': upd[4],
                        'title': upd[5],
                        'body': upd[6]
                    };

                    data.isChat = data.peer_id > 2e9;
                    data.from = data.peer_id;
                    data.attachments = [];

                    if(upd.length >= 8){
                        data.from = upd[7].from;

                        for(var i = 1; i <= 10; i++){
                            if(upd[7]["attach" + i]){
                                data.attachments[i - 1]  = upd[7]["attach" + i + "_type"] + upd[7]["attach" + i];
                            }
                        }
                    }

                    if(data.flags.outbox) data.from = selfUser.id;

                    self.emit('pre_message', data);
                    self.emit('new_message', data);
                }
            }
        }
        self.loop();
    };

    this.getFlags = function(flag){

        var unread = (flag & 1) == 1;
        var outbox = (flag & 2) == 2;
        var replied = (flag & 4) == 4;
        var important = (flag & 8) == 8;
        var chat = (flag & 16) == 16;
        var friends = (flag & 32) == 32;
        var spam = (flag & 64) == 64;
        var deleted = (flag & 128) == 128;
        var fixed = (flag & 256) == 256;
        var media = (flag & 512) == 512;

        return {'unread':unread, 'outbox':outbox, 'replied':replied, 'important':important, 'chat':chat, 'friends':friends, 'spam':spam, 'deleted':deleted, 'fixed':fixed, 'media':media};
    }

    this.getServerInfo = function(){
        return {'act':'a_check', 'key':serverInfo.key, 'ts':serverInfo.ts, 'wait':30, 'mode':2};
    }

};

util.inherits(LongPoll, EventEmitter);
module.exports = LongPoll;
