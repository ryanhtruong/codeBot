# pizzabot

Discord bot that allows users to run code in Discord via message.

Uses Discord.js and Paiza API.

When setting up this bot, be sure to include a file called "Config.json" in the project directory containing your bot's token like such:

{
  token: [insert token here]
}

Any of the following commands can be used to communicate with the bot:

  /create [language] [```code```]
  
  /get_status [request id]
  
  /get_details [request id]
  
where the [] represent parameters.

Code should be wrapped in a multi-line block like such:
```console.log("Hello world!");```

Thanks for reading and feel free to reach out if you have any questions or requests!

Ryan
