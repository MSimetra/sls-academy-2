'use strict';
const axios = require('axios');
const TelegramBot = require("node-telegram-bot-api");

const chatID = process.env.CHAT_ID;
const apiKey = process.env.API_KEY;
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(botToken, { polling: true });
const fullWeather = {};
const baseText = 'Please, choose an option:';
const updateText = 'Please, choose an option (update data):';


bot.onText(/\/start/, () => {
  sendMainMenu(chatID, baseText);
});

bot.on('callback_query', (query) => {
  if (query.data === 'kyiv_weather') {
    sendChoiceMenu(chatID, apiKey, fullWeather);
  } else if (query.data === 'every_3_hours') {
    sendFullWeather(chatID, fullWeather, updateText);
  } else if (query.data === 'every_6_hours') {
    sendHalfWeather(chatID, fullWeather, updateText);
  }
  bot.answerCallbackQuery(query.id);
});


const sendMainMenu = (chatID, text) => {
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Forecast for Kyiv', callback_data: 'kyiv_weather' },
        ],
      ],
    },
  };
  bot.sendMessage(chatID, text, options);
}

const sendChoiceMenu = (chatID, apiKey, fullWeather) => {
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'Every 3 hours', callback_data: 'every_3_hours' },
          { text: 'Every 6 hours', callback_data: 'every_6_hours' },
        ],
      ],
    },
  };

  getKyivWeather(apiKey, fullWeather);

  bot.sendMessage(chatID, 'Please, choose interval:', options);
}

const getKyivWeather = (apiKey, fullWeather) => {
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/forecast?q=Kyiv&units=metric&appid=${apiKey}`
    )
    .then((response) => {
      for (const x in fullWeather) delete fullWeather[x];

      for (const i of response.data.list) {
        const fullDate = new Date(i.dt * 1000);
        const date = new Intl.DateTimeFormat("en-GB").format(fullDate);
        const time = fullDate.toLocaleTimeString();
        const temp = Math.round(i.main.temp);
        const feelsLike = Math.round(i.main.feels_like);
        const weather = `${i.weather[0].description}`;

        if (!fullWeather[date]) fullWeather[date] = [];
        fullWeather[date].push(`${time}, ${temp}°C, feels like: ${feelsLike}°C, ${weather} `)
      }
    })
    .catch((error) => {
      console.error('Error getting forecast:', error);
      bot.sendMessage(chatID, 'Something went wrong. Please try again later.');
    });
}

const sendFullWeather = async (chatID, fullWeather, updateText) => {
  let result = '';

  for (const i in fullWeather) {
    result += '\n' + i + ':\n';
    for (const j of fullWeather[i]) {
      result += ' \t ' + j + '\n';
    }
  }

  await bot.sendMessage(chatID, result);
  sendMainMenu(chatID, updateText);
}

const sendHalfWeather = async (chatID, fullWeather, updateText) => {
  let result = '';

  for (const i in fullWeather) {
    result += '\n' + i + ':\n';
    for (let j = 2; j < fullWeather[i].length; j += 2) {
      result += ' \t ' + fullWeather[i][j] + '\n';
    }
    result += ' \t ' + fullWeather[i][fullWeather[i].length - 1] + '\n';
  }

  await bot.sendMessage(chatID, result);
  sendMainMenu(chatID, updateText);
}

// env $(cat .env | xargs) node app.js  