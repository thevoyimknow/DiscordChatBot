require('dotenv').config()

const Discord = require('discord.js-selfbot-v11');
const client = new Discord.Client();

const BotContext = require('./botcontext').BotContext;
let botContext;

const replyManager = new (require('./replymanager').MinHeapReplyManager)();
const MessageBuilder = require('./messagebuilder').MessageBuilder;

const sleep = require('sleep-promise');

if (process.env.OPENAI_API_KEY === undefined) {
  throw "OPENAI_API_KEY not specified";
}

let aiClient;

const MESSAGES_TO_READ = process.env.MESSAGES_TO_READ || 20;
const MAX_CHARACTERS = process.env.MAX_CHARACTERS || 500;

if (process.env.DISCORD_TOKEN === undefined) {
  throw "DISCORD_TOKEN not specified";
}

if (process.env.REPLY_INTERVAL_SECONDS === undefined || isNaN(process.env.REPLY_INTERVAL_SECONDS)) {
  throw "REPLY_INTERVAL_SECONDS not specified";
}

if (process.env.BOT_CHARS_PER_SECOND === undefined || isNaN(process.env.BOT_CHARS_PER_SECOND)) {
  throw "BOT_CHARS_PER_SECOND not specified";
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  botContext = new BotContext(
    process.env.BOT_CONTEXT_NAME,
    process.env.BOT_CONTEXT_DESC,
    client.user.id
  );

  aiClient = new (require('./aiclient').OpenAIClient)(botContext, process.env.OPENAI_API_KEY);

  setInterval(() => {
    const channel = replyManager.getChannel();

    if (channel) {
      (async () => {
        const builder = new MessageBuilder(botContext, channel);    
        const message = await builder.buildMessage(MESSAGES_TO_READ, MAX_CHARACTERS);        
        const response = await aiClient.getResponse(message);
        
        await channel.startTyping();
        await sleep(Math.round(response.length / process.env.BOT_CHARS_PER_SECOND * 1000))
        await channel.stopTyping(true);
        await channel.send(response);
      })();
    }

  }, process.env.REPLY_INTERVAL_SECONDS * 1000);
});

client.on('message', (message) => {
  if (message.author.id === botContext.id) {
    return;
  }

  if (message.channel instanceof Discord.DMChannel) {
    replyManager.onMessage(message.channel);
  }
});

client.login(process.env.DISCORD_TOKEN);