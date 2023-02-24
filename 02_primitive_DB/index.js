import inquirer from 'inquirer';
import fs from 'fs';

const filename = 'users.txt';

function main() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'name',
        message: "What's the user's name?",
      },
      {
        type: 'list',
        name: 'gender',
        message: 'What is the user gender?',
        choices: ['Male', 'Female', 'Other'],
      },
      {
        type: 'number',
        name: 'age',
        message: "What's the user's age?",
      },
    ])
    .then((answers) => {
      const { name, gender, age } = answers;
      const user = { name, gender, age };
      const data = fs.readFileSync(filename, 'utf-8');
      const users = data ? JSON.parse(data) : [];
      users.push(user);
      fs.writeFileSync(filename, JSON.stringify(users));
      inquirer
        .prompt([
          {
            type: 'confirm',
            name: 'addAnother',
            message: 'Do you want to add another user?',
          },
        ])
        .then((answers) => {
          if (answers.addAnother) {
            main();
          } else {
            findUser();
          }
        });
    });
}

function findUser() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'searchTerm',
        message: 'Enter the name of the user you want to find:',
      },
    ])
    .then((answers) => {
      const searchTerm = answers.searchTerm.toLowerCase();
      const data = fs.readFileSync(filename, 'utf-8');
      const users = data ? JSON.parse(data) : [];
      const foundUsers = users.filter(
        (user) => user.name.toLowerCase() === searchTerm
      );
      if (foundUsers.length === 0) {
        console.log('User not found.');
      } else {
        console.log('User found:', foundUsers[0]);
      }
      inquirer
        .prompt([
          {
            type: 'confirm',
            name: 'showAll',
            message: 'Do you want to see all the users?',
          },
        ])
        .then((answers) => {
          if (answers.showAll) {
            console.log(users);
            // if you want to clear users.txt everytime you run the program
            // fs.writeFile('users.txt', '', (err) => {
            //   if (err) throw err;
            // }); 
          }
        })
    });
}

main();