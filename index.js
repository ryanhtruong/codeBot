"use strict";
// pizzabot - the brain behind Discord bot chi the code cat    
// Built by Ryan Truong
exports.__esModule = true;
var discord_js_1 = require("discord.js");
var handler_1 = require("./handler");
var Config = require("./config.json");
// create client
var client = new discord_js_1.Client({ intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ] });
var handler = new handler_1["default"]();
// client.once('ready') is executed when client.login() is called (when pizzabot connects to Discord).
client.once("ready", function () {
    console.log("Logging in: ".concat(client.user.tag));
});
console.log("Coming to life...");
client.login(Config.token);
client.on("messageCreate", function (msg) {
    if (msg.author.bot)
        return;
    else {
        // check if msg is intended for bot
        if (msg.content[0] == '%') {
            // get command selection from msg
            var content = msg.content.substring(1).split(' ');
            switch (content[0].toLowerCase()) {
                case "create":
                    console.log("create heard!");
                    var result = handler.buildRunner(msg);
                    if (result != "")
                        msg.reply(result);
                    break;
                case "get_status":
                    console.log("get_status heard!");
                    handler.getStatus(msg.content.slice(12));
                    break;
                case "get_details":
                    console.log("get_details heard");
                    handler.getDetails(msg.content.slice(13));
                    break;
                default:
                    msg.reply("ERROR: Available actions are 'create', 'get_status', 'get_details'.");
            }
            msg.reply("".concat(content[0], " :3"));
        }
    }
});
