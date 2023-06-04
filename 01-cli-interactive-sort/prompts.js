'use strict';

const greeting = `
Hello! Please, enter your words or numbers, divided by spaces: `;

const choise = `
Please, choose sort method:
1. Sort words alphabetically (from A to Z).
2. Show numbers from lesser to greater.
3. Show numbers from bigger to smaller.
4. Display words in ascending order by number of letters in the word.
5. Show only unique words.
6. Display only unique values from the set of entered words and numbers.

Type (1 - 6) and press ENTER (or 'exit' to close the program): `

const tryAgain = `
Please, type (1 - 6) and press ENTER (or 'exit' to close the program): `

module.exports = { greeting, choise, tryAgain };