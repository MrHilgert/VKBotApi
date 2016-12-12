
var CommandManager = function(botapi){

    var self = this;

    var commands = {};

    this.registerCommand = function(name, callback){
        if(!(name instanceof Array)) name = [name];
        for(cmd in name) commands[name[cmd]] = callback;
    };

    this.onMessage = function(data){
        var name = data.body.split(' ')[0].toLowerCase();
        if(commands[name])  commands[name](data);
    };

};

module.exports = CommandManager;