'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// MY SOLUTION
// const createUsernames = accounts.map(function (value) {
//   const userFirstLetter = [];
//   const splitedName = value.owner.split(' ').forEach(value => {
//     const firstLetter = value.slice(0, 1);
//     userFirstLetter.push(firstLetter.toLocaleLowerCase());
//   });
//   const userFinal = userFirstLetter.join('');
//   return userFinal;
// });

// console.log(createUsernames);

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

//////////////////////////////////////////////////////////
// Useful methods to calculate and display the account //
//////////////////////////////////////////////////////////

const displayMoviments = movements => {
  containerMovements.innerHTML = '';
  // Almost the same thing but innerHTML returns all the tags not only the text
  // containerMovements.textContent = '';

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>

      <div class="movements__value">${mov}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
    // containerMovements.insertAdjacentHTML('beforeend', html);
    // it would invert the elemets because each element would be put on the top
  });
};

const calcDisplayBalance = movements => {
  const balance = movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${balance}€`;
};

const calcDisplaySumary = currentAccount => {
  const incomes = currentAccount.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes}€`;

  const out = currentAccount.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = currentAccount.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * currentAccount.interestRate) / 100)
    .filter(depositInt => depositInt >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
};

const updateUi = currentAccount => {
  // Showing the data
  displayMoviments(currentAccount.movements);
  calcDisplayBalance(currentAccount.movements);
  calcDisplaySumary(currentAccount);
};

//////////////////////////////////////////////////////////
// Buttons functionalites //
//////////////////////////////////////////////////////////

// variable which will store the current account
let currentAccount;

// Login implement

btnLogin.addEventListener('click', function (e) {
  // Prevent from reload when you submit
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Showing a welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // Showing the container
    containerApp.style.opacity = 100;

    updateUi(currentAccount);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';

    // Take the focus out
    inputLoginPin.blur();
    inputLoginUsername.blur();
  }
});

// Transfering Implement

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  // taking the total account balance, just the numbers
  const totalAccountBalance = labelBalance.textContent.slice(0, -1);
  const amount = Number(inputTransferAmount.value);
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
    updateUi(currentAccount);

    const actualBalance = Number(totalAccountBalance) - amount;
    labelBalance.textContent = `${actualBalance}€`;
  }

  inputTransferAmount.value = inputTransferTo.value = '';
});

// Closing Implement

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    Number(inputClosePin.value) === currentAccount.pin &&
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

  const loanAmount = Number(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(loan => loan >= loanAmount / 10)
  ) {
    currentAccount.movements.push(loanAmount);

    updateUi(currentAccount);
    inputLoanAmount.value = '';
  }
});

// Sort implement

let clicked = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  if (clicked === false) {
    const sortedMov = currentAccount.movements.slice().sort((a, b) => a - b);
    displayMoviments(sortedMov);
    clicked = true;
  } else {
    displayMoviments(currentAccount.movements);
    clicked = false;
  }
  // slice to create a shallow copy
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

/*
================================
==== Array Methods =========
===============================
*/

// let arr = ['a', 'b', 'c', 'd', 'e'];

/// Slice ///
// arr.slice(starterIndex, how many elements should be changed(optional), element that will ne replaced(optional)), )
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-1)); //last element of the array
// console.log(arr.slice(1, -1));
// console.log(arr.slice()); //Create a shallow copy

// /// Splice ///
// // splite the array from the original array
// // arr.splice(2);
// arr.splice(-1); // Take the last element out of the array
// arr.splice(1, 2);
// console.log(arr);

// /// Reverse ///
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// arr2.reverse();
// console.log(arr2);

// /// Concat ///
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// /// Join ///
// console.log(letters.join(' - '));

// const arr = [23, 11, 64];
// // Same thing, first element
// console.log(arr[0]);
// console.log(arr.at(0));

// // Same thing, last element
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));

/*
================================
==== Foreach =========
===============================
*/
// Foreach always return undefined

/// Array
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log('=== For of ===');
// // for (const mov of movements) {
// for (const [i, mov] of movements.entries()) {
//   if (mov > 0) {
//     console.log(`Moviment ${i + 1}: You deposited: ${mov}`);
//   } else {
//     console.log(`Moviment ${i + 1}: You Withdrew: ${Math.abs(mov)}`);
//   }
// }

// console.log('=== Foreach ===');
// // Foreach does not have break or continue
// // movements.forEach(function (currentElement, index, entireArray)
// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Moviment ${i + 1}: You deposited: ${mov}`);
//   } else {
//     console.log(`Moviment ${i + 1}: You Withdrew: ${Math.abs(mov)}`);
//   }
// });
// // 0: function(200)
// // 1: function(450)
// // 2: function(400)
// // ...

/// Map

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);
// // currencies.forEach(function (value, index, entireMap) {
// currencies.forEach(function (value, key, map) {
//   console.log(key, ': ', value);
// });

// const currenciesUnique = new Set(['USD', 'GBP', 'BIT', 'ETH', 'USD', 'BIT']);

// // the key is the same value of the value, there is no index in sets
// // Therefore use the '_' to unecessary variables
// currenciesUnique.forEach(function (value, _, set) {
//   console.log(key, ': ', value);
// });

/*
================================
==== Coding challenge =========
===============================
*/

// const dogsAgeJulia = [3, 7, 2, 6, 10];
// const dogsAgeKate = [3, 2, 2, 12, 15];

// const checkDogsAge = function (dogsAgeJulia, dogsAgeKate) {
//   const trueJulia = dogsAgeJulia.slice(1, -2);

//   const finalArray = dogsAgeKate.concat(trueJulia);
//   // const finalArray = [...dogsAgeKate, ...trueJulia];
//   finalArray.forEach(function (age, index) {
//     age >= 3
//       ? console.log(
//           `dog number ${index + 1} is an adult, and is ${age} years old`
//         )
//       : console.log(`Dog number ${index + 1} is still a puppy 🐶`);
//   });
// };

// checkDogsAge(dogsAgeJulia, dogsAgeKate);

/*
===============================================================
==== Data Transformations: map, filter, reduce =========
==============================================================
*/

// Maps
// Maps create a new array containing the results what was done with the orginal array
//// when it loops on itself, 'maping' the elemets

// Filter
// It creates an array with only the elemets which pass in an determinated task

// Reduce
// reduce all elements of an array in just one
// It's like a snowbal

//////////
// Maps //
//////////

// const eurToUsd = 1.1;
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const movmentsUsd = movements.map((value, index, arr) => value * eurToUsd);

// console.log(movements);
// console.log(movmentsUsd);

// const movimentsDescriptions = movements.map(
//   (mov, i) =>
//     `Moviment ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );

// console.log(movimentsDescriptions);

//////////
// Filter //
//////////

// const deposits = movements.filter(value => value > 0);
// const withdrawals = movements.filter(value => value < 0);

// console.log(deposits);
// console.log(withdrawals);

////////////////////
// Reduce //
////////////////////

// accumlator == snowbal
// const balance = movements.reduce(function (accumlator, value, i, arr) {
//   console.log(`Iteration ${i}: ${accumlator} `);
//   return accumlator + value;
// }, 0);

// const balance = movements.reduce((accumlator, value, i, arr) => {
//   console.log(`Iteration ${i}: ${accumlator} `);
//   return accumlator + value;
// }, 0);

// console.log(balance);

// let sumBal = 0;
// for (const mov of movements) {
//   sumBal += mov;
// }

// console.log(sumBal);

// const maximunValue = movements.reduce(
//   (acc, value) => (acc < value ? (acc = value) : (acc = acc)),
//   movements[0]
// );

// console.log(maximunValue);

/*
===============================================================
==== Data Transformations: Coding challenge #2 =========
==============================================================
*/

// const calcAvarageHumanAge = function (dogsAgeArray) {
//   const humanAge = Math.trunc(
//     dogsAgeArray
//       .map(age => {
//         if (age < 2) {
//           return 2 * age;
//         } else {
//           return 16 + age * 4;
//         }
//       })
//       .filter(function (value) {
//         return value > 18;
//       })
//       .reduce(function (acc, value) {
//         return (acc += value);
//       }, 0) / dogsAgeArray.length
//   );

//   return humanAge;
// };

// console.log(calcAvarageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAvarageHumanAge([16, 6, 10, 5, 6, 1, 4]));

/*
===============================================================
==== Chaining Methods =========
==============================================================
Don't overuse chaining mathods, and DONT use chaining methods which mutates the original array
*/
// const eurToUsd = 1.1;

// const totalDepositsUsd = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov);

// console.log(totalDepositsUsd);

/*
===============================================================
==== Coding challenge #3 =========
==============================================================
Already done xD
*/

/*
===============================================================
==== The Find method =========
==============================================================
Retrieve an element of the array, first element
*/

// const firstWithdraw = movements.find(mov => mov < 0);
// console.log(firstWithdraw);

// wow that's really great, returning an object by searching it
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');

// let accountOwner;
// for (const account of accounts) {
//   if (account.owner === 'Jessica Davis') {
//     accountOwner = account;
//   }
// }
// console.log(accountOwner);
// console.log(account);

/*
===============================================================
==== The Some and every methods =========
==============================================================
Some, like includes but not exatly it's a condition
Every, only if all the elements return true
*/

// console.log(movements);
// // Equality
// console.log(movements.includes(-130));
// // Condition
// console.log(movements.some(mov => mov > 1000));
// console.log(movements.every(mov => mov > 0));
// // all the moviments in account four is deposits
// console.log(account4.movements.every(mov => mov > 0));

// const deposits = mov => mov > 0;
// console.log(movements.every(deposits));
// console.log(movements.filter(deposits));

/*
===============================================================
==== The Flat and flatMap methods =========
==============================================================
  *Flat*, remove the arrays inside the arrays, "flattering" it
but it only go one level deep, we can use the "depth" argument
  *flatMap*, combines map with flat, but just one level deep
*/

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [[4, 5], 6], 7, 8];
// console.log(arrDeep.flat(2));

// const accountsMov = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((accumulator, value) => (accumulator += value), 0);

// console.log(accountsMov);

// const accountsMov2 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((accumulator, value) => (accumulator += value), 0);

// console.log(accountsMov);

/*
===============================================================
==== Sorting arrays methods =========
==============================================================
*/

// // Strings
// const owners = ['Guilheme', 'Gustavo', 'Andrey', 'Joao'];
// // mutate the original array
// console.log(owners.sort());

// // // Numbers
// console.log(movements);
// // akakak it's alphabetic ordered akakak
// // console.log(movements.sort());

// // if the a positive number is returned it means that a > b, else b > a
// // It keeps looping until it's in the ascending order
// // Ascending
// // console.log(
// //   movements.sort((a, b) => {
// //     if (a > b) {
// //       return 1;
// //     }
// //     if (b > a) {
// //       return -1;
// //     }
// //   })
// // );

// console.log(movements.sort((a, b) => a - b));

// // Descending
// console.log(
//   movements.sort((a, b) => {
//     if (a > b) {
//       return -1;
//     }
//     if (b > a) {
//       return 1;
//     }
//   })
// );

/*
===============================================================
==== More ways of how to fill an array (programaticly) =========
==============================================================
  
*/

// const arr = [1, 2, 3, 4, 5];
// console.log(new Array(1, 2, 3, 4, 5));

// // akward
// const x = new Array(7);
// console.log(x);

// // fill(value, where it starts, where it ends)
// x.fill(3, 2, 5);
// console.log(x);
// arr.fill(24, 3, 5);
// console.log(arr);

// // Array.from (better)
// // _ = thrown away parameter
// const arrFromRandom = Array.from({ length: 100 }, (_, i) =>
//   Math.trunc(Math.random() * 100)
// );
// console.log(arrFromRandom);

// labelBalance.addEventListener('click', function () {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     el => Number(el.textContent.replace('€', ''))
//   );
//   console.log(movementsUI);

//   const movementsUiSpread = [...document.querySelectorAll('.movements__value')];
// });

/*
===============================================================
==== Arrays methods in practice =========
==============================================================
*/

// // 1.
// const bankDepositSum = accounts
//   .flatMap(value => value.movements)
//   .filter(value => value > 0)
//   .reduce((acc, value) => acc + value);
// console.log(bankDepositSum);

// // 2.

// // const bankDeposit1000 = accounts
// //   .flatMap(value => value.movements)
// //   .filter(value => value >= 1000).length;

// const bankDeposit1000 = accounts
//   .flatMap(value => value.movements)
//   .reduce((count, current) => (current >= 1000 ? ++count : count), 0);
// console.log(bankDeposit1000);

// // var++ = it will use and then increment
// // ++var = it will increment and then use

// // 3.
// const { deposits, withdrawls } = accounts
//   .flatMap(value => value.movements)
//   .reduce(
//     (sums, cur) => {
//       // if (cur > 0) {
//       //   sums.deposits += cur;
//       // } else {
//       //   sums.withdrawls += cur;
//       // }
//       sums[cur > 0 ? 'deposits' : 'withdrawls'] += cur;
//       return sums;
//     },
//     { deposits: 0, withdrawls: 0 }
//   );

// console.log(deposits, withdrawls);

// 4.

// const convertTitleCase = function (title) {
//   const capitalize = function (word) {
//     return word[0].toUpperCase() + word.slice(1);
//   };
//   const expections = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

//   const titleStr = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => (expections.includes(word) ? word : capitalize(word)))
//     .join(' ');

//   return capitalize(titleStr);
// };

// console.log(convertTitleCase('alo this is a title with case'));

/*
===============================================================
==== Coding challenge #4 =========
==============================================================
*/

const dogs = [
  { weight: 22, curFood: 270, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1. check

dogs.forEach(dog => {
  dog.recomendedFood = Math.round(dog.weight ** 0.75 * 28);
});

// 2. check
// kakakakak deu certo tmc akakak

// my solution
// const sarahDogMy = dogs.find(dogs =>
//   dogs.owners.find(owner => owner === 'Sarah')
// );

// // const sarahDogNotMy = dogs.find(dogs => dogs.owners.includes('Sarah'));

// console.log(sarahDogMy);
// // console.log(sarahDogNotMy);

// if (sarahDogMy.curFood > sarahDogMy.recomendedFood) {
//   console.log(`Sarah's dog eating too much`);
// } else {
//   console.log(`Sarah's dog eating too little`);
// }

// 3. check

// const ownersEatTooMuch = dogs
//   .filter(dog => dog.curFood < dog.recomendedFood)
//   .flatMap(dog => dog.owners);

// const ownersEatTooLittle = dogs
//   .filter(dog => dog.curFood > dog.recomendedFood)
//   .flatMap(dog => dog.owners);

// console.log(ownersEatTooMuch);
// console.log(ownersEatTooLittle);

// 4. (done)

// let strOwners = '';
// const srtMuch = ownersEatTooMuch.forEach(dog => {
//   dog.owners.forEach(owner => {
//     if (owner) {
//       strOwners += owner + ' and ';
//     }
//   });
// });

// console.log(`${ownersEatTooMuch.join(' and ')}'s eat too much`);
// console.log(`${ownersEatTooLittle.join(' and ')}'s eat too little`);

// strOwners = '';

// const srtLittle = ownersEatTooLittle.forEach(dog => {
//   dog.owners.forEach(owner => {
//     if (owner) {
//       strOwners += owner + ' and ';
//     }
//   });
// });
// console.log(strOwners + 'eat too litle');

// srtMuch;

// 5. (done)

// const dogEatingWell = dogs.some(dog => dog.curFood === dog.recomendedFood);
// console.log(dogEatingWell);

// 6. (done)

// const dogEatingGood = dog =>
//   dog.curFood > dog.recomendedFood * 0.9 &&
//   dog.curFood < dog.recomendedFood * 1.1;

// const eatingGood = dogs.some(dog => dogEatingGood(dog));

// console.log(eatingGood);

// 7.

// const arrOkayFood = dogs.filter(dog => dogEatingGood(dog));

// console.log(arrOkayFood);

// 8.

const arrFromDogs = dogs.slice();

arrFromDogs.sort((a, b) => {
  if (a.curFood > b.curFood) {
    return 1;
  }
  if (b.curFood > a.curFood) {
    return -1;
  }
});

console.log(arrFromDogs);

// dogs.forEach(dog => console.log(dog));
