/**
 * Promises Basics
 * What will be the output of the below code snippets?
 * You can execute your code in console and verify.
 * Provide answers with proper reasoning. 
*/

const { resolve } = require("path");

/** QUESTION 1 */
function getAll(){
    // All the promises will run.
    Promise.all([
        new Promise((resolve,reject)=>{ console.log('1'); resolve() }),
        new Promise((resolve,reject)=>{ console.log('2'); setTimeout(()=>{ reject(); }, 2000) }),
        new Promise((resolve,reject)=>{ console.log('3'); resolve() })
    ]).then(()=> {
        console.log("then");
    }).catch(()=> {
        console.log("catch");   // Logs "catch" (after 2 seconds.)
    }).finally(()=> {
        console.log("finally"); // Logs "finally"
    });
}
getAll();


/** QUESTION 2 */
var oProm = new Promise(function(resolve, reject) {
    reject('');
});

oProm.then(() => {
    console.log("then");
}).catch(() => {
    console.log("catch");   // Logs: "catch"
}).finally(() =>{ 
    console.log("finally");   // Logs: "finally"
});

// When a promise is rejected it goes to catch block with the rejection error.
// Finally is executed once promise is complete either resolve or reject.

/** QUESTION 3 */
var oProm = new Promise(function(resolve,reject) { reject(); });    // Promise is rejected.
oProm.then(() => {
    console.log("then");
}, () => {
    console.log("ThenErr"); // Logs: ThenErr
}).catch(() => {
    console.log("catch");   // Not logged because error is caught in `then` block.
}).finally(() => {
    console.log("finally"); // Logs: Finally
});

// Because `then` can take two arguments, the second argument is a error handler that gets called if the promise is `rejected`.

/** QUESTION 4 */
var oProm = new Promise(function(resolve, reject) { resolve(); });

oProm.then(()=> {
    console.log("Then1");   // Logs "Then1"
}).then(() => { 
    console.log("Then2");   // Logs "Then2"
}).catch(() => {
    console.log("catch1");
}).then(() => {
    resolve();  // Resolve is not defined, it will go to catch.
    console.log("Then3");
}).catch(() => {
    console.log("Catch2");   // Logs "Catch2"
}).then(() => {
    console.log("Then4");   // Logs "Then4"
}).finally(() => {
    console.log("finally");   // Logs "finally"
});

/** QUESTION 4 - VARIATION */
var oProm = new Promise(function(resolve, reject) { reject(); });

oProm.then(()=> {
    console.log("Then1");
}).then(() => { 
    console.log("Then2");
}).catch(() => {
    console.log("catch1");  // Logs "Catch1"
}).then(() => {
    resolve();
    console.log("Then3");
}).catch(() => {
    console.log("Catch2");   // Logs "Catch2"
}).then(() => {
    console.log("Then4");   // Logs "Then4"
}).finally(() => {
    console.log("finally");   // Logs "finally"
});

// -----------------------------------------------------------------------------

/** Promises - Async behavior using Promises
 * Check the below code and modify the functions using promises to get the desired output.
 * 
 * Current Output - 
 * one
 * two
 * three
 * 
 * Desired Output-
 * one 
 * ** delay of two seconds**
 * two
 * ** delay of two seconds**
 * three
 */

function one () {
    setTimeout(() => {
        console.log("one"), 2000
    })
}
function two () {
    setTimeout(() => {
        console.log("two"), 2000
    })
}
function three () {
    setTimeout(() => {
        console.log("three"), 2000
    })
}
one();
two();
three();

// Solution: using promises

function one () {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("one");
            resolve();
        }, 2000);
    })
}
function two () {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("two");
            resolve();
        }, 2000);
    })
}
function three () {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("three");
            resolve();
        }, 2000);
    })
}

one().then(() => two().then(() => three()));

// -----------------------------------------------------------------------------

/**
 * Promises  - Error Handling
 * Provide outputs of the the below codes. Execute in console and compare the outputs. Provide reason.
 * Then Modify the Code 2 only within the **Modifiable block** such that the output is same as Code 1.
 */

// Code 1:
new Promise(function(resolve, reject) {
 resolve();
}).then(() => {
    throw new Error("Whoops!"); // When this run it throws error hence the catch block runs.
}).catch((error) => {
    console.log(error);     // "Whoops"  
});

// Code 2:
new Promise(function(resolve, reject) {
  setTimeout(() => {
    //Modifiable Block
    throw new Error("Whoops!");     // setTimeout throws error
    //End of Modifiable Block
  }, 1000);
}).catch((error) => {
    console.log(error);     // "Whoops"  
});

// Extra - Find the output of the below code -

// Code 3:
new Promise(function(resolve, reject) {
     throw new Error("Whoops!");
}).catch((error) => {
    console.log(error);     // "Whoops"  
});

// -----------------------------------------------------------------------------

/** Promises - Microtasks
 * Microtasks - Async tasks are moved to the microtask queue which are executed in a FIFO manner.
 * This is how the JS engine handles the concept of Event loops. With this understanding in mind,
 * provide the outputs for the below code with explanations.
 */

// Code 1 -
var prm1 = new Promise((resolve,reject) => { resolve("Prom 1 "); });
var prm2 = new Promise((resolve,reject) => { resolve("Prom 2 "); });

prm1.then((res) => console.log(res + "Then1")); // Prom 1 Then1
prm2.then((res) => console.log(res + "Then1")); // Prom 2 Then1
prm1.then((res) => console.log(res + "Then2")); // Prom 1 Then2
prm2.then((res) => console.log(res + "Then2")); // Prom 2 Then2

/** OUTPUT
 * Prom 1 Then1
 * Prom 2 Then1
 * Prom 1 Then2
 * Prom 2 Then2
 * ------------------------------------------------------------------------------------------
 * Both the promises are resolved hence the following `then` will run one after the another.
 * All the thenables will create micro task - FIFO.
 */

// Code 2 -
var prm1 = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve("Prom 1 ");
    },0);
});

var prm2 = new Promise((resolve,reject) => {
    setTimeout(() => {
        resolve("Prom 2 ");
    },0);
});

prm1.then((res) => console.log(res + "Then1"));
prm2.then((res) => console.log(res + "Then1"));
prm1.then((res) => console.log(res + "Then2"));
prm2.then((res) => console.log(res + "Then2"));

/** OUTPUT
 * 
 * Prom 1 Then1
 * Prom 1 Then2
 * Prom 2 Then1
 * Prom 2 Then2
 * 
 * ------------------------------------------------------------------------------------------
 * prm1 - setTimeout (1) goes to event loop
 * prm2 - setTimeout (2) goes to event loop 
 * 
 * NO MORE TASKS IN CURRENT STACK.
 * 
 * EVENT LOOP IS CHECKED
 * 
 * setTimeout (1) - COMES OUT OF EVENT LOOP - GOES TO CURRENT STACK
 * > runs - resolves prm1
 * 
 * Micro tasks for prm1 - should run now
 * Prom 1 Then1
 * Prom 1 Then2
 * 
 * NO MORE TASKS IN CURRENT STACK.
 * 
 * EVENT LOOP IS CHECKED
 * 
 * setTimeout (2) - COMES OUT OF EVENT LOOP - GOES TO CURRENT STACK
 * > runs - resolves prm2
 * 
 * Micro tasks for prm1 - should run now
 * Prom 2 Then1
 * Prom 2 Then2
 * 
 */

// -----------------------------------------------------------------------------

/** Promise - Async -Await
 * Provide output for the below code with proper reasoning
 */

// Code 0-
var getData = async() => {
    var y = await "Hello World";
    console.log(y);
}

console.log(1);
getData();
console.log(2);

// Output: 1 > 2 > Hello World
// async-await returns a promise hence normal tasks will run first.

// Code 1 -
var myFunc = async () => {
    return "Prom 1";
}
myFunc().then((res) => { console.log(res) }).catch((err) => { console.log(err) });

// Output: Prom 1
// Javascript automatically wraps it in a promise which is resolved with its value

// Code 2-
var myFunc = async ()=>{
    throw new Error("Error here");
}
myFunc().then((res) => { console.log(res) }).catch((err) => { console.log(err) });

// Output: Error (Coming from Catch block)
// The promise is rejected.

// Code 3-
var myFunc = async () => {
    setTimeout(() => { return "Prom 1"; }, 1000);
}
myFunc().then((res) => { console.log(res) }).catch((err) => { console.log(err) });

// Output: Undefined
// The promise is not returning any value in the resolve().

// Code 4-
var myFunc = async () => {
    var a="123";
    var oProm = new Promise((resolve,reject) => {
        setTimeout(() => {
            a = "test";
            resolve("prom resolved");
        }, 3000);
    });
    await oProm;    // waits till promise is resolved. Since the promise is resolved the result will be here and it is not returned.
    console.log(a);
}
myFunc().then((res) => { console.log(res) }).catch((err) => { console.log(err) });

// Output: "test", undefined.
// Resolve is not returned. We can get the return value if we do the following.

var myFunc = async () => {
    var a="123";
    var oProm = new Promise((resolve,reject) => {
        setTimeout(() => {
            a = "test";
            resolve("prom resolved");
        }, 3000);
    });
    const value = await oProm;
    console.log(a);
    return value;
}
myFunc().then((res) => { console.log(res) }).catch((err) => { console.log(err) });

// OUTPUT: test, prom resolved