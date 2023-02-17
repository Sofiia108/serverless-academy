'use strict'
const { exit } = require('process');
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const state = {
  initial: [],
  sorted: [],
  exit: false
};

function resetWords() {
  return state.sorted = [];
}

function sortAlfabetically () {
  return state.sorted.sort((a, b) => isFinite(b) - isFinite(a) || a - b || a.localeCompare(b))
}

function sortLessToBigger () {
  return state.sorted.sort();
}

function sortBiggerToLess () {
  return state.sorted.sort((a, b) => isFinite(b) - isFinite(a) || b - a || a.localeCompare(b))
}

function sortByLength () {
  return state.sorted.sort((a, b) =>  a.length - b.length);
}

function uniqueWords () {
  let onlyWords = state.sorted.filter(item => isNaN(parseFloat(item)));
  state.sorted = onlyWords;
  let result = uniqueValues()
  return result
}

function uniqueValues () {
  return state.sorted = [...new Set(state.sorted)];
}

function sortWords(letter) {
   
    switch (letter) {

      case 'a':
        sortAlfabetically()
        break;
      case 'b':
        sortLessToBigger()
        break;
      case 'c': 
        sortBiggerToLess()
        break;
      case 'd':
        sortByLength()
        break;
      case 'e': 
        uniqueWords()
        break;
      case 'f': 
        uniqueValues()
        break;
      default:
        break;
    }
}

const filterAlphaNumeric = (str) => {

    const required = Array.from('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
    const arrStr = Array.from(str)
    let result = ''
    for (let i = 0; i < arrStr.length; i++) {
  
      let char = arrStr[i]
      let index = required.indexOf(char)
      if (index > -1) {
        result += required[index]
      }
    }
    return result
}

const addInput = (input) => {
    return input.split(' ').map(item => filterAlphaNumeric(item))
}

const notEnoughWords = () => {
    return new Promise((resolve, reject) => {
        rl.question(`Amount of words is less than 10. Please write ${10 - state.initial.length} words more`, input => {   
            let seperatedInput = addInput(input)
            state.initial =  state.initial.concat(seperatedInput);
            resolve()
        })
    })
}

const question1 = () => {

  return new Promise( (resolve, reject) => {
    rl.question(`Hello. Enter 10 words or digits deviding them in spaces: `, async input => {
      if(input == 'exit') {
        state.exit = true;
        resolve();
      }
      else {
        let seperatedInput = addInput(input)
        state.initial =  state.initial.concat(seperatedInput);

        while(state.initial.length < 10){
            await notEnoughWords();
        }
        state.initial.slice(9);
        console.log(`the program words: ${state.initial}`)
        state.sorted = state.initial;   
        resolve()
      }
    })
  })
}

const question2 = () => {
  return new Promise((resolve, reject) => {
    rl.question(`How would you like to sort your words? Chose letter from a to f:
    a. Sort words alphabetically
    b. Show numbers from lesser to greater  
    c. Show numbers from bigger to smaller
    d. Display words in ascending order by number of letters in the word
    e. Show only unique words
    f. Display only unique values from the set of words and numbers entered by the user
    
    To exit the program, the user need to enter 'exit', otherwise the program will repeat itself again and again, asking for new data and suggesting sorting
    `, input => {
      if(input == 'exit') {
        state.exit = true;
        resolve();
      }
      else{
        sortWords(input);
        console.log(`End of the program words: ${state.sorted}`);
        resetWords()
        resolve();
      }
    })
  })
}

const main = async () => {
  while(!state.exit) {
    await question1()
    if(state.exit) break
    await question2() 
  }
  rl.close()
}

main();
