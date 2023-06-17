'use strict';
const axios = require('axios');
const options = require('./options.js');
const TelegramBot = require("node-telegram-bot-api");

const chatID = process.env.CHAT_ID;
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(botToken, { polling: true });
let flag = true;
const allRates = {};
const urlApi = {
  'Privatbank': 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5',
  'Monobank': 'https://api.monobank.ua/bank/currency'
};

bot.onText(/\/start/, () => {
  sendMainMenu('Please, choose an option:', options.mainMenu);
});

bot.on('callback_query', (query) => {
  if (query.data === 'exchange_rates') {
    sendChoiceMenu(options.choiceMenu, options.updateMenu);
  } else if (query.data === 'USD_rates') {
    sendRate('USD');
  } else if (query.data === 'EUR_rates') {
    sendRate('EUR');
  }
  bot.answerCallbackQuery(query.id);
});


const sendMainMenu = (text, mainMenu) => {
  bot.sendMessage(chatID, text, mainMenu);
}

const sendChoiceMenu = (choiceMenu, updateMenu) => {
  if (flag) {
    getExchangeRates();
    bot.sendMessage(chatID, 'Please, choose currency:', choiceMenu);
  } else {
    bot.sendMessage(chatID, 'Sorry, you can update data only once per minute.\n' +
    'Try again later or use previous data:', updateMenu);
  }
}

const getExchangeRates = () => {
  for (const bank in allRates) delete allRates[bank];

  axios.get(urlApi['Privatbank'])
  .then((response) => {
    for (const currency of response.data) {
      const currencyName = currency.ccy;
      const buy = Math.round(currency.buy * 100) / 100;
      const sale = Math.round(currency.sale * 100) / 100;

      if (!allRates['Privatbank']) allRates['Privatbank'] = {};
      if (!allRates['Privatbank'][currencyName]) {
        allRates['Privatbank'][currencyName] = {};
      }
      allRates['Privatbank'][currencyName] = `buying - ${buy}, selling - ${sale}`;
    }
  })
  .catch((error) => {
    console.error('Error getting exchange rate:', error);
    bot.sendMessage(chatID, 'Something went wrong. Please try again later.');
  });

  axios.get(urlApi['Monobank'])
  .then((response) => {
    const mono = {
      Monobank: {
        USD: response.data.find(unit =>
          unit['currencyCodeA'] === 840 && unit['currencyCodeB'] === 980),
        EUR: response.data.find(unit =>
          unit['currencyCodeA'] === 978 && unit['currencyCodeB'] === 980)
      }
    };
    for (const bank in mono) {
      if (!allRates[bank]) allRates[bank] = {};
      for (const currency in mono[bank]) {
        const buy = Math.round(mono[bank][currency].rateBuy * 100) / 100;
        const sale = Math.round(mono[bank][currency].rateSell * 100) / 100;
        if (!allRates[bank][currency]) allRates[bank][currency] = {};
        const result = `buying - ${buy}, selling - ${sale}`;
        allRates[bank][currency] = result;
      }
    }
  })
  .catch((error) => {
    console.error('Error getting exchange rate:', error);
    bot.sendMessage(chatID, 'Something went wrong. Please try again later.');
  })

  flag = false;
  setTimeout(() => flag = true, 60000)
}

const sendRate = async (currency) => {
  let result = '';

  for (const bank in allRates) {
    result += `\n${bank}:\n`;
    result += `${currency}: ${allRates[bank][currency]}\n`;
  }

  await bot.sendMessage(chatID, result);
  sendMainMenu('Please, choose an option:', options.updateMenu);
}

// env $(cat .env | xargs) node app.js  