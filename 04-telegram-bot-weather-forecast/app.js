'use strict';
const axios = require('axios');
const options = require('./options');
const TelegramBot = require("node-telegram-bot-api");

const chatID = process.env.CHAT_ID;
const apiKey = process.env.API_KEY;
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(botToken, { polling: true });
const fullWeather = {};


bot.onText(/\/start/, () => {
  sendMainMenu(options.baseText, options.mainMenu);
});

const sendMainMenu = (text, options) => {
  bot.sendMessage(chatID, text, options);
}

bot.on('callback_query', (query) => {
  if (query.data === 'kyiv_weather') {
    sendChoiceMenu(options.choiceMenu);
  } else if (query.data === 'every_3_hours') {
    sendFullWeather(options.updateText, options.mainMenu);
  } else if (query.data === 'every_6_hours') {
    sendHalfWeather(options.updateText, options.mainMenu);
  }
  bot.answerCallbackQuery(query.id);
});

const sendChoiceMenu = (options) => {
  getKyivWeather();
  bot.sendMessage(chatID, 'Please, choose interval:', options);
}

const getKyivWeather = () => {
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/forecast?q=Kyiv&units=metric&appid=${apiKey}`
    )
    .then((response) => {
      for (const day in fullWeather) delete fullWeather[day];

      for (const day of response.data.list) {
        const fullDate = new Date(day.dt * 1000);
        const date = new Intl.DateTimeFormat("en-GB").format(fullDate);
        const time = fullDate.toLocaleTimeString();
        const temp = Math.round(day.main.temp);
        const feelsLike = Math.round(day.main.feels_like);
        const weather = `${day.weather[0].description}`;

        if (!fullWeather[date]) fullWeather[date] = [];
        fullWeather[date].push(`${time}, ${temp}°C, feels like: ${feelsLike}°C, ${weather} `)
      }
    })
    .catch((error) => {
      console.error('Error getting forecast:', error);
      bot.sendMessage(chatID, 'Something went wrong. Please try again later.');
    });
}

const sendFullWeather = async (updateText, options) => {
  let result = '';

  for (const day in fullWeather) {
    result += '\n' + day + ':\n';
    for (const hour of fullWeather[day]) {
      result += ' \t ' + hour + '\n';
    }
  }

  await bot.sendMessage(chatID, result);
  sendMainMenu(updateText, options);
}

const sendHalfWeather = async (updateText, options) => {
  let result = '';

  for (const day in fullWeather) {
    result += '\n' + day + ':\n';
    const lastIndex = fullWeather[day].length - 1;
    for (let hour = 2; hour < fullWeather[day].length; hour += 2) {
      result += ' \t ' + fullWeather[day][hour] + '\n';
    }
    if (fullWeather[day][lastIndex].includes('21:00:00')) {
      result += ' \t ' + fullWeather[day][lastIndex] + '\n';
    }
  }

  await bot.sendMessage(chatID, result);
  sendMainMenu(updateText, options);
}

// env $(cat .env | xargs) node app.js  