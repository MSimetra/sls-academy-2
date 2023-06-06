'use strict';

const fs = require('node:fs')
const inquirer = require('inquirer');
const { nameInput, otherInput, dbConfirm, userRequest } = require('./questions');

const output = [];
let flag = false;

const askName = () => {
  inquirer.prompt(nameInput).then((nameAnswer) => {
    if (nameAnswer.name !== '') {
      flag = true;
      askOther(nameAnswer);
    } else {
      if (flag === false) {
        console.log('Bye! See you next time!');
        return;
      };
      askDBConfirm();
    };
  })
};

const askOther = (nameAnswer) => {
  inquirer.prompt(otherInput).then((otherAnswers) => {
    output.push(Object.assign(nameAnswer, otherAnswers));
    askName();
  });
};

const askDBConfirm = () => {
  fs.writeFileSync(`${__dirname}\\DB.txt`, JSON.stringify(output))
  inquirer.prompt(dbConfirm).then((dbAnswer) => {
    dbAnswer.DB ? askUser() : console.log('Bye! See you next time!');
  });
};

const askUser = () => {
  console.log(output);
  inquirer.prompt(userRequest).then((userAnswer) => {
    const result = output.filter(obj =>
      obj.name.toLowerCase() === userAnswer.name.toLowerCase())
    if (result.length === 0 ) {
      console.log('Sorry, such user does not exist.');
    } else {
      console.log(`User '${userAnswer.name}' was found.`);
      console.log(JSON.stringify(result));
    }
  });
};

askName();