'use strict';
const wordsSort = (rl, greeting, answer, methodChoise) => {
  const noNumbers = answer.filter(word => !/\d/.test(word));
  const onlyWords = noNumbers.filter(word => !/\W/.test(word));
  console.log(onlyWords.sort((a, b) => a.localeCompare(b, { ignorePunctuation: true })));
  rl.question(greeting, methodChoise);
};
const numsToMax = (rl, greeting, answer, methodChoise) => {
  const numbers = answer.filter(word => !/\D/.test(word));
  console.log(numbers.sort((a, b) => a - b));
  rl.question(greeting, methodChoise);
};
const numsToMin = (rl, greeting, answer, methodChoise) => {
  const numbers = answer.filter(word => !/\D/.test(word));
  console.log(numbers.sort((a, b) => b - a));
  rl.question(greeting, methodChoise);
};
const wordsByLetters = (rl, greeting, answer, methodChoise) => {
  const noNumbers = answer.filter(word => !/\d/.test(word));
  const onlyWords = noNumbers.filter(word => !/\W/.test(word));
  console.log(onlyWords.sort((a, b) => a.length - b.length));
  rl.question(greeting, methodChoise);
};
const uniqueWords = (rl, greeting, answer, methodChoise) => {
  const noNumbers = answer.filter(word => !/\d/.test(word));
  const onlyWords = noNumbers.filter(word => !/\W/.test(word));
  const uniqueWords = new Set(onlyWords);
  console.log([...uniqueWords]), rl.question(greeting, methodChoise);
};
const uniqueValues = (rl, greeting, answer, methodChoise) => {
  const noSymbols = answer.filter(word => !/\W/.test(word));
  const uniqueWords = new Set(noSymbols);
  console.log([...uniqueWords]), rl.question(greeting, methodChoise);
};
const invalidChoise = (rl, greeting, answer, methodChoise, tryAgain) => {
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

const sortMethods = [wordsSort, numsToMax, numsToMin,
wordsByLetters, uniqueWords, uniqueValues, invalidChoise];

module.exports = { sortMethods };