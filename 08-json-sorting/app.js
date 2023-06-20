'use strict';

const fs = require('node:fs');
const https = require('node:https');

const endpoints = fs.readFileSync('./endpoints.txt', 'utf-8')
.split('\n');

function findKeyInNestedJSON(jsonObj, key) {
  let result = null;

  const searchNestedJSON = (obj) => {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (prop === key) {
          result = obj[prop];
          break;
        } else if (typeof obj[prop] === 'object') {
          searchNestedJSON(obj[prop]);
        }
      }
    }
  };

  searchNestedJSON(jsonObj);
  return result;
}

function getRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        resolve(JSON.parse(data));
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function queryEndpoint(url) {
  try {
    const response = await getRequest(url);
    const isDoneT = findKeyInNestedJSON(response, 'isDone');
    if (response && isDoneT !== undefined) {
      console.log(`[Success] ${url}`);
      console.log(`isDone - ${isDoneT}`);
      return isDoneT;
    } else {
      throw new Error('The endpoint is unavailable');
    }
  } catch (error) {
    console.error(`[Fail] ${url}: ${error.message}`);
    return null;
  }
}

async function executeQueries() {
  let trueCount = 0;
  let falseCount = 0;

  for (const endpoint of endpoints) {
    let isDone = null;
    let retries = 3;
    while (retries > 0 && isDone === null) {
      isDone = await queryEndpoint(endpoint);
      retries--;
    }

    if (isDone === true) {
      trueCount++;
    } else if (isDone === false) {
      falseCount++;
    }
  }

  console.log(`\nFound True values: ${trueCount}`);
  console.log(`Found False values: ${falseCount}`);
}

executeQueries();