//name of my bot is: sofia_telegram_console_sender

const TelegramBot = require('node-telegram-bot-api');
const { program } = require('commander');
const token = '6052645653:AAHqD5WTpoKhr4ZjDzX9cGWu5cbzcftLEy4';
const chatId = 502927651;
const bot = new TelegramBot(token, { polling: true });

program
  .command('send-message <message>')
  .description('Send a message to the bot')
  .action((message) => {
    bot.sendMessage(chatId, message);
  });

program
  .command('send-photo <path>')
  .description('Send a photo to the bot')
  .action((path) => {
    bot.sendPhoto(chatId, path);
  });

program.parse(process.argv);