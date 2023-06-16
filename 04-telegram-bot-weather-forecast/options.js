'use strict';

const baseText = 'Please, choose an option:';
const updateText = 'Please, choose an option (update data):';

const mainMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'Forecast for Kyiv', callback_data: 'kyiv_weather' },
      ],
    ],
  },
};

const choiceMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'Every 3 hours', callback_data: 'every_3_hours' },
        { text: 'Every 6 hours', callback_data: 'every_6_hours' },
      ],
    ],
  },
};

module.exports = {mainMenu, choiceMenu, baseText, updateText};