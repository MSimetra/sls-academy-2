'use strict';
const {program} = require('commander');
const TelegramBot = require("node-telegram-bot-api");

const chatID = process.env.CHAT_ID;
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const sendNote = async (note) => {
  await bot.sendMessage(chatID, note);
  process.exit();
}
const sendPhoto = async (path) => {
  process.env["NTBA_FIX_350"] = 1;
  await bot.sendPhoto(chatID, path);
  process.exit();
}

program
  .version('0.0.1')
  .command('send-message').alias('m')
  .description('send message to Telegram bot')
  .argument('<message>')
  .action(note => sendNote(note));
program
  .command('send-photo').alias('p')
  .description('send photo to Telegram bot > drag and drop photo in console after "p" command')
  .argument('<path>')
  .action(path => sendPhoto(path));
program.parse(process.argv);

// env $(cat .env | xargs) node cli.js