// pizzabot - the brain behind Discord bot chi the code cat    
// Built by Ryan Truong

import { Client, Events, GatewayIntentBits } from "discord.js";
import Handler from "./handler";
const Config = require("./config.json");

// create client
const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent
] });

const handler = new Handler();

// client.once('ready') is executed when client.login() is called (when pizzabot connects to Discord).
client.once("ready", () => {
	console.log(`Logging in: ${client.user!.tag}`);
});

console.log("Coming to life...");
client.login(Config.token);

client.on("messageCreate", (msg: any) => {
	// check if msg is intended for bot
	if (!msg.author.bot && msg.content[0] == '/') {
		handler.selectCmd(msg);
	}
});