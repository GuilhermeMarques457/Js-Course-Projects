'use strict';

// Selecting elements
let score0El = document.getElementById('score--0');
let score1El = document.querySelector('#score--1');
let current0El = document.getElementById('current--0');
let current1El = document.getElementById('current--1');
let diceEl = document.querySelector('.dice');
let player0 = document.querySelector('.player--0');
let player1 = document.querySelector('.player--1');

let btnRoll = document.querySelector('.btn--roll');
let btnHold = document.querySelector('.btn--hold');
let btnNew = document.querySelector('.btn--new');

// Creating variables to manipulate
let currentScore, scores, activePlayer, playing;

const switchingPlayers = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;

  // toggle is beatifull, if it doesn't have the class it will add,
  // and if it has it will remove
  // BEAUTIFUL
  player0.classList.toggle('player--active');
  player1.classList.toggle('player--active');
};

// Starting conditions
const initializeConditions = function () {
  currentScore = 0;
  scores = [0, 0];
  activePlayer = 0;
  playing = true;

  score0El.textContent = 0;
  score1El.textContent = 0;
  diceEl.classList.add('hidden');
  score0El.textContent = 0;
  score1El.textContent = 0;
  current0El.textContent = 0;
  current1El.textContent = 0;
  player1.classList.remove('player--winner');
  player0.classList.remove('player--winner');
  player1.classList.remove('player--active');
  player0.classList.add('player--active');
};

initializeConditions();

// Row dice functionallity

btnRoll.addEventListener('click', function () {
  if (playing) {
    const dice = Math.trunc(Math.random() * 6) + 1;
    diceEl.classList.remove('hidden');
    diceEl.src = `dice-${dice}.png`;
    if (dice != 1) {
      currentScore += dice;

      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      switchingPlayers();
    }
  }
});

// Hold score functionallity

btnHold.addEventListener('click', function () {
  if (playing) {
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];

    if (scores[activePlayer] >= 100) {
      playing = false;

      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      diceEl.classList.add('hidden');
    } else {
      switchingPlayers();
    }
  }
});

// New game functionallity

btnNew.addEventListener('click', initializeConditions);
