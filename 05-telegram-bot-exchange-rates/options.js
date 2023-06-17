'use strict'

const mainMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'Exchange rates', callback_data: 'exchange_rates' },
      ],
    ],
  },
};

const choiceMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        { text: 'USD', callback_data: 'USD_rates' },
        { text: 'EUR', callback_data: 'EUR_rates' },
      ],
    ],
  },
};

const updateMenu = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'Update exchange rates (use only ones per minute)',
          callback_data: 'exchange_rates'
        },
      ],
      [
        { text: 'USD', callback_data: 'USD_rates' },
        { text: 'EUR', callback_data: 'EUR_rates' },
      ],
    ],
  },
};

module.exports = {mainMenu, choiceMenu, updateMenu};