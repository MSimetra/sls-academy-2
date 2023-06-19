'use strict';

const fs = require('node:fs');

const data = JSON.parse(fs.readFileSync('./vacations.txt'));
const users = {}
const vacations = {};
const resultData = [];

for (const element of data) {
  const user = {
    'userId': element.user._id,
    'userName': element.user.name,
    'vacations': [],
  }

  const vacation = {
    startDate: element.startDate,
    endDate: element.endDate,
  };

  if (!users[user.userName]) users[user.userName] = {};
  users[user.userName] = user;

  if (!vacations[user.userName]) vacations[user.userName] = [];
  vacations[user.userName].push(vacation);
}

for (const user in users) {
  users[user].vacations = vacations[user];
  resultData.push(users[user])
}

console.dir(resultData, { depth: 3 });