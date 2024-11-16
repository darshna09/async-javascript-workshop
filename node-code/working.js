/**  START ::: ASYNCRONOUS PATTERNS: CALLBACKS */

/**
 * Question 1
 * The below code errors when you run it.
 * Make it run without errors but you cannot change the location of the `let` statement, that has to stay at the end.
 */
function doAsyncTask(cb) {
  setTimeout(() => cb(), 0);
  // Works but it is considered a bad practice in node - setTimeout with 0.
  // Better to use process.netTick or setImmediate provided by node.
  // For running in browser setTimeout is okay for now. We can use promises for better solution.
}

doAsyncTask(() => console.log(message));

let message = "Callback Called";


// PROBLEM: This is not an asynchronous code. And by the time cb is called the message variable is not defined.

// SOLUTION: We need to call it asynchronously.

// LEARNINGS

// What the hello is _ in doAsyncTask(_ => console.log(message));?
// function(_) {} : the underscore repesents any parameter, it doesn't matter.
// Explanation available at https://stackoverflow.com/questions/23903183/javascript-what-does-function-mean
// doAsyncTask(() => console.log(message)); - BETTER

// -------------------------------------------------------------------------------------------------------------------

/**
 * Question 2
 * The below code swallows the error and doesn't pass it up the chain, make it pass the error up the stack using the next callback.
 */

const fs = require("fs");

function readFileThenDo(next) {
  fs.readFile("./blah.nofile", (err, data) => {
    // Pass the error up the chain
    next(err, data);
  });
}

readFileThenDo((err, data) => {
  err ? console.log(err) : console.log(data);
});

// OR: checking the error before calling the callback.

const fs = require("fs");

function readFileThenDo(next) {
  fs.readFile("./blah.nofile", (err, data) => {
    err ? next(err) : next(data);
  });
}

readFileThenDo(logData => {
  console.log(logData);
});

// -------------------------------------------------------------------------------------------------------------------

/**
 * Question 3
 * Instead of passing it up the stack throw it instead and try to catch it later on.
 */

const fs = require("fs");

function readFileThenDo(next) {
  fs.readFile("./blah.nofile", (err, data) => {
    if (err) throw err;   // Node will catch this exception and throw it.
    next(data);
  });
}
// Hint use try..catch
try {
  readFileThenDo(data => {
    console.log(data);
  });
} catch (err) {
  console.log('Error in callback: ', err);
  // This never gets called. Because try..catch works with synchronous code.
  // Catch is executed immediately after try, it doesn't wait for readFile to complete the execution.
  // Callback can be used as synchronous and asynchronous code.
  // If the callback was used as synchronous code - try...catch will work.
  // If the callback was used as qsynchronous code - try...catch will not work.

  // Once the file is read, the node catches the exception and shows it.
}

/**  END ::: ASYNCRONOUS PATTERNS: CALLBACKS */

/**  START ::: ASYNCRONOUS PATTERNS: PROMISES */

/**
 * Question 1 - (10min)
 * Create a promise version of the async readFile function
 */

const fs = require("fs");

function readFile(filename, encoding) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, encoding, (err, data) => {
      err ? reject(err) : resolve(data);
      // if (err) return reject(err); resolve(data)
      // This is because once the Promise is rejected, it will not be resolved.
    });
  });
}

readFile("./files/demoFile.txt", "utf-8").then(
  data => console.log('file data: ', data),
  error => console.log('Error: ', error)
);

// NODE provides a built in method for standard funtions (readFile)

const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);
readFile("./files/demoFile.txt", "utf-8").then(
  data => console.log('file data: ', data),
  error => console.log('Error: ', error)
);

// Using the catch block instead of error handling in then block.

const fs = require("fs");
const util = require("util");

const readFile = util.promisify(fs.readFile);
readFile("./files/demoFile8.txt", "utf-8").then(
  data => console.log('file data: ', data)
).catch(
  error => console.log('Error: ', error)
)

// util.promisify(fs.readFile) is doing the samething we have done above.

// -------------------------------------------------------------------------------------------------------------------

/**
 * Question 2
 * Load a file from disk using readFile and then compress it using the async zlib node library, use a promise chain to process this work.
 * Question 3
 * Convert the previous code so that it now chains the promise as well.
 * Question 4
 * Convert the previous code so that it now handles errors using the catch handler
 */

const fs = require("fs");
const zlib = require("zlib");

function zlibPromise(data) {
  return new Promise((resolve, reject) => {
    zlib.gzip(data, (error, result) => {
      if (error) {
        reject(error);
      }
      resolve (result);
    });
  });
}

// This is same as what we did in Question 1.
function readFile(filename, encoding) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, encoding, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

readFile("./files/demofile.txt", "utf-8")
    .then(data => zlibPromise(data))
    .then(result => console.log('Here is the data: ', result))
    .catch(err => console.log('Something got messed up: ', err)) // --> Load it then zip it and then print it to screen

// -------------------------------------------------------------------------------------------------------------------

/**
 * Question 5
 * Create some code that tries to read from disk a file and times out if it takes longer than 1 seconds, use Promise.race
 */

function readFileFake(sleep) {
  return new Promise(resolve => setTimeout(resolve, sleep, 'Read'));
}

function timeout(sleep) {
  return new Promise((resolve, reject) => setTimeout(reject, sleep, 'Timeout.'));
}

Promise.race([readFileFake(5000), timeout(1000)]).then(
  values => console.log(values)
).catch(error => console.log(error));
  
// readFileFake(5000); // This resolves a promise after 5 seconds, pretend it's a large file being read from disk

// The promise race doesn't stop when the response is there but waits for other executions/responses.

// -------------------------------------------------------------------------------------------------------------------

/**
 * Question 6
 * Create a process flow which publishes a file from a server, then realises the user needs to login, then makes a login request, 
 * the whole chain should error out if it takes longer than 1 seconds. Use `catch` to handle errors and timeouts.
 */

function authenticate() {
  console.log("Authenticating");
  return new Promise(resolve => setTimeout(resolve, 2000, { status: 200 }));
}

function publish() {
  console.log("Publishing");
  return new Promise(resolve => setTimeout(resolve, 2000, { status: 403 }));
}

function timeout(sleep) {
  return new Promise((resolve, reject) => setTimeout(reject, sleep, "timeout"));
}

Promise.race( [publish(), timeout(3000)])
  .then(() => authenticate())
  .then(() => console.log('Published'))
  .catch(err => console.log('Failed to publish: ', err));

// For checking the catch reduce the timeout from publishing.

/**  END ::: ASYNCRONOUS PATTERNS: PROMISES */

/**  START ::: ASYNCRONOUS PATTERNS: ASYNC/AWAIT */

/**
 * Question 1
 * Convert the promise version of the multi-file loader over to using async/await
 */

const util = require("util");
const fs = require("fs");
const readFile = util.promisify(fs.readFile);

const files = ["./files/demofile.txt", "./files/demofileOther.txt"];

// Using async/await -> Reading the files one by one - synchronous blocking.

async function readFilesData() {
  for (let file of files) {
    const data = await readFile(file, 'utf8');  //synchronous blocking. 
    console.log(data);
  }
}
readFilesData();

// Using promises -> reading the files simultaneouly. (MORE EFFICIENT)

let promises = files.map(name => readFile(name, { encoding: "utf8" }));
Promise.all(promises).then(values => {
  // <-- Uses .all
  console.log(values);
});

// Another efficient way of doing it using aync/await is as follows.

async function readFilesData() {
  let promises = files.map(name => readFile(name, { encoding: "utf8" }));
  let values = await Promise.all(promises);   // But still using Promise.all
  console.log(values);
}
readFilesData();

// -------------------------------------------------------------------------------------------------------------------

/** 
 * Question 2
 * Again convert the promise version of the multi-file loader over to using async/await 
 * but using a custom async iterator with the following syntax
 * node --harmony-async-iteration <file.js>
*/
const util = require("util");
const fs = require("fs");
const readFile = util.promisify(fs.readFile);

const fileIterator = files => ({
  [Symbol.asyncIterator]: () => ({
    x: 0,
    next() {
      if (this.x >= files.length) {
        return {
          done: true
        }
      } else {
        let file = files[this.x++];
        return readFile(file, 'utf8').then(data => ({
          done: false,
          value: data
        }));
      }
    }
  })
});

(async () => {
  for await (let x of fileIterator([
    "./files/demofile.txt",
    "./files/demofileOther.txt"
  ])) {
    console.log(x);
  }
})();

/**  END ::: ASYNCRONOUS PATTERNS: ASYNC/AWAIT */

/**  START ::: ASYNCRONOUS PATTERNS: GENERATORS */

/**
 * Question 1
 * Create a custom async generator that loops over the files that are passed in.
 */

const util = require("util");
const fs = require("fs");
const { setImmediate } = require("timers");
const readFile = util.promisify(fs.readFile);

function* fileLoader(files) {
  // TODO
  for (let y of files) {
    yield readFile(y, 'utf8');
  }
  // OR

  // const promises = files.map(file => readFile(file, 'utf8'));
  // for (promise of promises) {
  //   yield promise;
  // }
}

(async () => {
  for await (let contents of fileLoader([
    "./files/demofile.txt",
    "./files/demofileOther.txt"
  ])) {
    console.log(contents);
  }
})();

/**  END ::: ASYNCRONOUS PATTERNS: GENERATORS */

/**  START ::: EVENT LOOPS */

/**
 * Quizz 1
 * Using you're knowledge of the event loop, create a program which prints out the below.
 * If the log line mentions a `setInterval` it must be printed inside a `setInterval` etc..
 * start
 * end
 * setInterval 1
 * promise 1
 * promise 2
 */

console.log("start");
const interval = setInterval(() => {
  console.log("setInterval 1");
  clearInterval(interval);
}, 0);
setTimeout(() => {
  Promise.resolve()
  .then(() => console.log('promise 1'))
  .then(() => console.log('promise 2'))
}, 0)
console.log("end");

// ---- OR -----

console.log("start");
const interval = setInterval(() => {
  console.log("setInterval 1");
  Promise.resolve()
    .then(() => {
      console.log('promise 1');
    })
    .then(() => {
      console.log('promise 2');
      clearInterval(interval);
    });
}, 0);
console.log("end");

// -------------------------------------------------------------------------------------------------------------------

/**
 * Quizz 2
 * Extend the previous example to print out the following log lines, use `process.nextTick` and `setImmediate`
 * start
 * end
 * setInterval 1
 * promise 1
 * promise 2
 * processNextTick 1
 * setImmediate 1
 * promise 3
 * promise 4
 */

console.log("start");
const interval = setInterval(() => {
  console.log("setInterval 1");
  Promise.resolve()
    .then(() => {
      console.log('promise 1');
    })
    .then(() => {
      console.log('promise 2');
      clearInterval(interval);
    })
    .then(() => {
      process.nextTick(() => {
        console.log('processNextTick 1');
      });
      setImmediate(() => {
        console.log('setImmediate 1');
      });
    })
}, 0);

setTimeout(() => {
  Promise.resolve()
  .then(() => {
    console.log('promise 3');
  })
  .then(() => {
    console.log('promise 4');
  });
}, 100);
console.log("end");

// ---- OR -----

console.log("start");
const interval = setInterval(() => {
  console.log("setInterval 1");
  Promise.resolve()
    .then(() => {
      console.log('promise 1');
    })
    .then(() => {
      console.log('promise 2');
      setImmediate(() => {
        console.log('setImmediate 1');
        Promise.resolve()
          .then(() => {
            console.log('promise 3');
          })
          .then(() => {
            console.log('promise 4');
          });
      });
      process.nextTick(() => console.log('processNextTick 1'));
      clearInterval(interval);
    });
}, 0);
console.log("end");

/**  END ::: EVENT LOOPS */