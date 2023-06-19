'use strict';

console.time('elapsed time')
const fs = require('node:fs');

const allUniqueNames = new Set();
const allNames = [];
const namesCount = {};
const filePaths = Array.from(new Array(20), (x, i) => `./users/out${i++}.txt`);

for (const filePath of filePaths) {
  const oneFileStr = fs.readFileSync(filePath, 'utf-8');
  const oneFileArr = oneFileStr.split('\n');

  allNames.push(oneFileArr);
  for (const name of oneFileArr) {
    allUniqueNames.add(name);
    namesCount[name] ? namesCount[name]++ : namesCount[name] = 1;
  }
}

const uniqueValues = () => {
  return allUniqueNames.size;
}

const existInAllFiles = () => {
  const firstFile = new Set(allNames[0]);

  for (let i = 1; i < allNames.length; i++) {
    const currentFile = new Set(allNames[i])
    for (const username of firstFile) {
      if (!currentFile.has(username)) {
        firstFile.delete(username)
      }
    }
  }

  return firstFile.size;
}

const existInAtleastTen = () => {
  const namesInAtleastTen = Object.entries(namesCount)
  .filter(([username, count]) => count >= 10)
  .map(([username, count]) => username);

  return namesInAtleastTen.length;
}

console.log(uniqueValues());
console.log(existInAllFiles());
console.log(existInAtleastTen());
console.timeEnd('elapsed time');