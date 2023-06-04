'use strict';

const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { greeting, choise, tryAgain } = require('./prompts');
const sortMethods = require('./sortMethods').sortMethods;

const rl = readline.createInterface({ input, output });

const methodChoise = (userInput) => {
  const answer = userInput.trim().split(' ');
  rl.setPrompt(choise);
  rl.prompt();

  rl.once('line', variant => {
    if (variant === 'exit') {
      rl.close()
    } else if (!/\D/.test(variant) && variant >= 1 && variant <= 6) {
      sortMethods[variant - 1](rl, greeting, answer, methodChoise);
    } else {
      rl.setPrompt(tryAgain);
      rl.prompt();
      sortMethods[6](rl, greeting, answer, methodChoise, tryAgain);
    }
  });
}

rl.on('close', () => console.log('\nGood bye! Have a nice day!'))
rl.question(greeting, methodChoise);