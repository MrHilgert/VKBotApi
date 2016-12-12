var BotApi = require('./BotApi');
var LongPoll = require('./LongPoll');
var CommandManager = require('./CommandManager');

var bot = new BotApi();
var cm = new CommandManager(bot);

bot.auth(LOGIN, PASSWORD).then((resp) => {
    bot.getUtils().getUser().then((resp) => {
        bot.setSelf(resp);
        run();
    });
});

function run(){
    var lp = new LongPoll(bot.getVK(), bot.getSelf());                      // LongPoll

    var log = ((message) => {                                               // Message Logger
        console.log("[MSG] [{0}/ {1}] {2}".format(message.title, message.from, message.body));
    });

    lp.on('pre_message', log);                                              // Register Logger

    lp.on('new_message', cm.onMessage);                                     // Register CommandManager

    cm.registerCommand("hw", (message) => {                                 // Add new command 'hw'
        bot._sendMessage('HelloWorld!', message);                           // Send response
    });

    cm.registerCommand(["hi", "helo"], (message) => {                       // Add new command with aliases
        bot.getUtils().getUser({'uesr_id': message.from}).then((sender) => {// Get sender info
            sender = sender.response[0];
            bot._sendMessage('Hello {0} {1}!'.format(sender.first_name, sender.last_name), message);    
        });
    });

    bot.getVK().request('messages.getLongPollServer').then((resp) => {      // Get LongPoll
        lp.start(resp.response);                                            // Start LongPoll
    });
}
