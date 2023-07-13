'use strict';

// DOM is NOT javascript, the DOM is a web API

// document.querySelector('.className') * CLASS *
// document.querySelector('#idName') * ID*
// This is how we select an element from a html

// console.log(document.querySelector('.message').textContent);

// document.querySelector('.message').textContent = 'Teu pai';
// document.querySelector('.number').textContent = 13;
// document.querySelector('.score').textContent = 10000000;
// document.querySelector('.guess').value = 23;
// console.log(document.querySelector('.guess').value);

let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highscore = 0;

const displayMessage = function (message) {
  document.querySelector('.message').textContent = `${message}`;
};

document.querySelector('.again').addEventListener('click', function () {
  score = 20;
  displayMessage('Start guessing...');
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  document.querySelector('body').style.backgroundColor = '#222';
  document.querySelector('.number').style.width = '15rem';
  document.querySelector('.score').textContent = score;
  document.querySelector('.guess').value = '';
  document.querySelector('.number').textContent = '?';
});

document.querySelector('.check').addEventListener('click', function () {
  let guess = Number(document.querySelector('.guess').value);

  // if no number was written
  if (!guess) {
    displayMessage('Something is wrong!!! Try it again');

    // if you guessed
  } else if (guess == secretNumber) {
    displayMessage('You Did it!!!');
    document.querySelector('.number').textContent = secretNumber;
    secretNumber = Math.trunc(Math.random() * 20) + 1;
    if (score > highscore) {
      document.querySelector('.highscore').textContent = score;
      highscore = score;
    }

    // Manipulating the css
    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').style.width = '30rem';
    // document.getElementsByClassName('.number').disabled = true;

    // if it's diferent
  } else if (score == 0) {
    displayMessage('You lose, i do not know how. Try it AGAIN');

    score = 20;
  } else if (guess != secretNumber) {
    guess > secretNumber
      ? displayMessage('Too high!!!')
      : displayMessage('Too Low!!!');
    score--;

    // if you lose
  }

  document.querySelector('.score').textContent = score;

  console.log(score);
});
