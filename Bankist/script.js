'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-02-17T14:43:26.374Z',
    '2023-02-21T18:49:59.371Z',
    '2023-02-23T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2023-11-10T14:43:26.374Z',
    '2023-02-25T18:49:59.371Z',
    '2023-03-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
// Creating usernames

const createUsernames = function (accounts) {
  accounts.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const formatCur = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

//////////////////////////////////////////////////////////
// Useful methods to calculate and display the account //
//////////////////////////////////////////////////////////

const formatMovementDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed < 1) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return new Intl.DateTimeFormat(locale).format(date);
    // const now = date;
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // return `${day}/${month}/${year}`;
  }
};

let displayDate;

const displayMoviments = account => {
  containerMovements.innerHTML = '';
  // Almost the same thing but innerHTML returns all the tags not only the text
  // containerMovements.textContent = '';

  // movementDates.forEach(mov => console.log(mov));

  account.movements.forEach(function (mov, i) {
    const formattedMov = formatCur(mov, account.locale, account.currency);

    const date = new Date(account.movementsDates[i]);
    const displayDate = formatMovementDate(date, account.locale);

    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
    // containerMovements.insertAdjacentHTML('beforeend', html);
    // it would invert the elemets because each element would be put on the top
  });
};

const calcDisplayBalance = account => {
  const balance = account.movements.reduce((acc, mov) => acc + mov, 0);

  const formattedMov = formatCur(balance, account.locale, account.currency);

  labelBalance.textContent = `${formattedMov}`;
};

const calcDisplaySumary = currentAccount => {
  const incomes = currentAccount.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  const formattedIncomes = formatCur(
    incomes,
    currentAccount.locale,
    currentAccount.currency
  );

  labelSumIn.textContent = `${formattedIncomes}`;

  const out = currentAccount.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  const formattedOut = formatCur(
    out,
    currentAccount.locale,
    currentAccount.currency
  );

  labelSumOut.textContent = `${formattedOut}`;

  const interest = currentAccount.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * currentAccount.interestRate) / 100)
    .filter(depositInt => depositInt >= 1)
    .reduce((acc, int) => acc + int, 0);

  const formattedInterest = formatCur(
    interest,
    currentAccount.locale,
    currentAccount.currency
  );

  labelSumInterest.textContent = `${formattedInterest}`;
};

const startLogOutTimer = () => {
  let timer = 600;

  const tick = () => {
    const min = String(Math.trunc(timer / 60)).padStart(2, 0);
    const sec = String(timer % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (timer === 0) {
      clearInterval(timerEl);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
      currentAccount = {};
    }

    timer--;
  };

  tick();
  const timerEl = setInterval(tick, 1000);

  return timer;
};

const updateUi = currentAccount => {
  // Showing the data

  displayMoviments(currentAccount);
  calcDisplayBalance(currentAccount);
  calcDisplaySumary(currentAccount);
};

//////////////////////////////////////////////////////////
// Buttons functionalites //
//////////////////////////////////////////////////////////

// variable which will store the current account
let currentAccount, timer;

// currentAccount = account1;
// updateUi(currentAccount);
// containerApp.style.opacity = 100;

// Login implement

btnLogin.addEventListener('click', function (e) {
  // Prevent from reload when you submit
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Showing a welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // Showing the container
    containerApp.style.opacity = 100;

    // Internalization Dates Api

    const now = new Date();
    const options = {
      // We can use numeric in all of them
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: '2-digit',
    };
    const locale = navigator.language;

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const minutes = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${minutes}`;

    updateUi(currentAccount);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';

    // Take the focus out
    inputLoginPin.blur();
    inputLoginUsername.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer();
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  // taking the total account balance, just the numbers
  const totalAccountBalance = labelBalance.textContent.slice(0, -1);
  const amount = +inputTransferAmount.value;
  const recieverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    amount < totalAccountBalance &&
    recieverAccount &&
    recieverAccount.username !== currentAccount.user
  ) {
    // doing the transfer
    currentAccount.movements.push(-amount);
    recieverAccount.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    recieverAccount.movementsDates.push(new Date().toISOString());

    updateUi(currentAccount);

    const actualBalance = +totalAccountBalance - amount;
    labelBalance.textContent = `${actualBalance}€`;
  }

  inputTransferAmount.value = inputTransferTo.value = '';

  clearInterval(timer);
  timer = startLogOutTimer();
});

// Closing Implement

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    +inputClosePin.value === currentAccount.pin &&
    inputCloseUsername.value === currentAccount.username
  ) {
    containerApp.style.opacity = 0;
    const indexAccount = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // indexOf(23) With this method we can only find a value
    // but with findIndex we can search for diferent things
    // like the property as I did up here

    // Remove 1 element of the current index
    accounts.splice(indexAccount, 1);

    inputClosePin.value = inputCloseUsername.value = '';
  }
});

// Loan Implement

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(loan => loan >= loanAmount / 10)
  ) {
    setTimeout(() => {
      currentAccount.movements.push(loanAmount);

      //  Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());

      updateUi(currentAccount);
      inputLoanAmount.value = '';
    }, 5000);
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// Sort implement

let clicked = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  if (clicked === false) {
    const sortedMov = currentAccount.movements.slice().sort((a, b) => a - b);
    displayMoviments(sortedMov, currentAccount.movementsDates);
    clicked = true;
  } else {
    displayMoviments(currentAccount.movements, currentAccount.movementsDates);
    clicked = false;
  }
  // slice to create a shallow copy
});

const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0);
const month = `${now.getMonth() + 1}`.padStart(2, 0);
const year = now.getFullYear();
const hour = now.getMinutes();
const minutes = now.getMinutes();

labelDate.textContent = `${day}/${month}/${year}`;

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

////////////////////
//// Number methods
////////////////////

// // Same thing, conversion
// console.log(Number('23'));
// console.log(+'23');

// // Parsing, identify a number (it has to start with number)
// console.log(Number.parseInt('30px', 10));
// console.log(Number.parseFloat('2.5rem', 10));

// // // The finite is better to check if it is a number kakaakak
// console.log(Number.isNaN('adas'));
// console.log(Number.isFinite(20));
// console.log(Number.isFinite(20 / 0));
// console.log(Number.isFinite('sad'));
// console.log(Number.isInteger(23));

////////////////////
//// Math methods
////////////////////

// console.log(Math.sqrt(25));
// console.log(25 ** (1 / 2));
// // cubic root
// console.log(8 ** (1 / 3));

// console.log(Math.max(23, 12, 22, 40, 11));
// console.log(Math.min(23, 12, 22, 40, 11));

// console.log(Math.PI * Number.parseFloat('10px') ** 2);

// console.log(Math.trunc(Math.random() * 6));

// // ROUDING INTEGRS
// // just cut the next part
// console.log(Math.trunc(23.3));
// // the closest integer
// console.log(Math.round(23.9));
// // round to the next number
// console.log(Math.ceil(23.2));
// // round to the previous number
// console.log(Math.floor(23.9));

// // // ROUDING DECIMALS
// console.log((2.7).toFixed(0));
// console.log((2.7).toFixed(3));
// console.log(+(2.7322432).toFixed(1));

////////////////////
//// Reminder operator
////////////////////

// console.log(5 % 2);

// const isOdd = num => num % 2 === 1;
// console.log(isOdd(22));
// console.log(isOdd(25));

// console.log(document.querySelectorAll('.movements__row'));
// console.log([...document.querySelectorAll('.movements__row')]);

////////////////////
//// Numeric separator
// Just separate numbers
////////////////////

// const diameter = 287_460_000_000;
// console.log(diameter);

// // const priceCents = 395_97;
// // console.log(priceCents);

// // // we cannot convert strings with underscores
// console.log(Number('23_000'));

////////////////////
//// Big Int
////////////////////

// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);
// // the 'n' in the final transform it in a big int
// console.log(typeof 12312423423431412312423132432123123123n);
// console.log(typeof Number.MAX_SAFE_INTEGER);

////////////////////
//// Dates and Time
////////////////////

// const now = new Date();
// console.log(now);
// console.log(new Date('Wed Feb 22 2023 13:56:54'));
// console.log(new Date('December 24, 2014'));
// console.log(new Date(account1.movementsDates[0]));
// console.log(new Date(2022, 11, 24, 23, 24, 30));
// // console.log(new Date(ano, mes -1, dia, hora, minuto, segundo));
// console.log(new Date(0));

// // WORKING WITH DATES
// const someDay = new Date();
// // never use get year
// console.log(someDay.getFullYear());
// console.log(someDay.getMonth());
// console.log(someDay.getDate());
// // DAY OF THE WEEK KAAKAK
// console.log(someDay.getDay());
// console.log(someDay.getHours());
// console.log(someDay.getMinutes());
// console.log(someDay.getSeconds());
// console.log(someDay.toISOString());
// console.log(someDay.getTime());

// someDay.setFullYear(2040);
// console.log(someDay);

////////////////////
//// Operations with dates
////////////////////

// const future = new Date(2037, 10, 19);
// const evenfuture = new Date(2037, 10, 29);

// console.log(+future);

// const calcDaysPassed = (date1, date2) =>
//   `${Math.round(Math.abs(date2 - date1)) / (1000 * 60 * 60 * 24)} days passed`;
// console.log(calcDaysPassed(future, evenfuture));
// console.log(calcDaysPassed(evenfuture, future));

////////////////////
//// Internalization dates
////////////////////

// const nowUs = new Date();
// const options = {
//   // We can use numeric in all of them
//   hour: 'numeric',
//   minute: 'numeric',
//   day: 'numeric',
//   month: 'long',
//   year: '2-digit',
//   weekday: 'long',
// };
// const locale = navigator.language;
// console.log(locale);

// console.log(new Intl.DateTimeFormat('en-US', options).format(nowUs));

////////////////////
//// Internalization Numbers
////////////////////

// const num = 3232324.23;
// const options = {
//   // style: 'unit',
//   style: 'currency',
//   // unit: 'mile-per-hour',
//   unit: 'celsius',
//   currency: 'EUR',
//   // useGrouping: false,
// };

// console.log('Brasil ' + new Intl.NumberFormat('pt-BR', options).format(num));
// console.log('US ' + new Intl.NumberFormat('en-US', options).format(num));
// console.log('Syria ' + new Intl.NumberFormat('ar-SY', options).format(num));
// console.log('Germany ' + new Intl.NumberFormat('de-DE', options).format(num));

////////////////////
//// setTimeOut & setInterval
// setTimeout = something will happen when the timer ends
// setInterval = every specifed timer something will happen
////////////////////

// setTimeOut
// const ingredients = ['olives', 'spinach'];
// const pizzaTimer = ingredients =>
//   setTimeout(
//     (ing1, ing2) => console.log(`here is your pizza with ${ing1} and ${ing2}`),
//     3000,
//     ingredients
//   );
// // it will happen when the timer reach the specifed time (dalay)

// if (ingredients.includes('spinach')) {
//   clearTimeout(pizzaTimer);
// }
// pizzaTimer(ingredients);

// // setInterval
// setInterval(() => {
//   console.log(
//     new Date().getHours(),
//     new Date().getMinutes(),
//     new Date().getSeconds()
//   );
// }, 1000);
