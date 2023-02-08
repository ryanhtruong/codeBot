"use strict";
// pizzabot - the brain behind Discord bot chi the code cat    
// Built by Ryan Truong
exports.__esModule = true;
console.log("Coming to life...");
var discord_js_1 = require("discord.js");
var handler_1 = require("./handler");
var config_json_1 = require("./config.json");
// create client
var client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds] });
var handler = new handler_1["default"]();
// client.on('ready') is executed when client.login() is called (when pizzabot connects to Discord).
client.on('ready', function () {
    // console.log(`Logging in: ${client.user!.tag}`);
    console.log("starting...");
});
client.login(config_json_1["default"].token);
client.on('message', function (msg) {
    if (msg.author.bot)
        return;
    else {
        if (msg.content[0] == '/') {
            msg.reply(":3");
        }
    }
});
