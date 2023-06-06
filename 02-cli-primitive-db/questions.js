'use strict'

const nameInput = [
  {
    type: 'input',
    name: 'name',
    message: "Enter the user`s name. To cancel press ENTER:",
  },
];

const otherInput = [
  {
    type: 'list',
    name: 'gender',
    message: 'Chose your Gender:',
    choices: ['male', 'female']
  },
  {
    type: 'input',
    name: 'age',
    message: "Enter your age:",
  },

];

const dbConfirm = [
  {
    type: 'confirm',
    name: 'DB',
    message: 'Would you like to find user in DB?',
  },
]

const userRequest = [
  {
    type: 'input',
    name: 'name',
    message: 'Enter user`s name:',
  },
]

module.exports = {nameInput, otherInput, dbConfirm, userRequest};