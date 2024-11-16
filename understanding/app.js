/** **************************************************************
 * *********************       CALLBACKS     *********************
****************************************************************** */
// Loading the script helloFunction.js once the DOM loads.

function loadScript(src, callback) {
    let script = document.createElement("script");
    script.src = src;
    script.onload = () => callback(script);
    document.head.append(script);
}

// loadScript('helloFunction.js');
// This doesn't work.
// sayHello('Lol');

loadScript('helloFunction.js', function() {
    sayHello('Lol');
});

// Animated circle using callback

function showCircle(cx, cy, radius, callback) {
    const parentDiv = document.getElementById('animated-circle');
    let div = document.createElement('div');
    div.style.width = 0;
    div.style.height = 0;
    div.style.left = cx + 'px';
    div.style.top = cy + 'px';
    div.className = 'circle';
    parentDiv.appendChild(div);

    setTimeout(() => {
        div.style.width = radius * 2 + 'px';
        div.style.height = radius * 2 + 'px';
        
        div.addEventListener('transitionend', function handler() {
            div.removeEventListener('transitionend', handler);
            callback(div);
        });
    }, 0);
}

function buttonAnimatedClick () {
    showCircle(150, 150, 100, div => {
        div.classList.add('message-ball');
        div.append('Hello there');
    })
}

/** **************************************************************
 * *********************       PROMISES     *********************
****************************************************************** */

/**
 * Re-resolve a promise? 
 * What is the output?
 */

let promise = new Promise(function(resolve, reject) {
    resolve(1);
    setTimeout(() => resolve(2), 1000);
});
  
promise.then(result => console.log(result));    // 1

// The second call to resolve is ignored, because only the first call of reject/resolve is taken into account.
// Further calls are ignored.

/**
 * Delay with a promise.
 * The built-in function setTimeout uses callbacks. Create a promise-based alternative.
 * The function delay(ms) should return a promise. 
 * That promise should resolve after ms milliseconds, so that we can add .then to it.
 */

function delay(ms) {
    // your code
    return new Promise(resolve => setTimeout(() => resolve(), ms));
}
  
delay(3000).then(() => console.log('runs after 3 seconds'));

// Animated circle using promises

function showCirclePromise(cx, cy, radius, callback) {
    const parentDiv = document.getElementById('animated-circle');
    let div = document.createElement('div');
    div.style.width = 0;
    div.style.height = 0;
    div.style.left = cx + 'px';
    div.style.top = cy + 'px';
    div.className = 'circle';
    parentDiv.appendChild(div);

    return new Promise(resolve => setTimeout(() => {
        div.style.width = radius * 2 + 'px';
        div.style.height = radius * 2 + 'px';
        
        div.addEventListener('transitionend', function handler() {
            div.removeEventListener('transitionend', handler);
            resolve(div);
        });
    }, 0));
}

function buttonAnimatedClickPromises () {
    showCirclePromise(150, 150, 100).then(div => {
        div.classList.add('message-ball');
        div.append("Hello, world!");
    });
}

// Error handling - What do you think? Will the .catch trigger? Explain your answer.

new Promise(function(resolve, reject) {
    setTimeout(() => {
      throw new Error("Whoops!");
    }, 1000);
}).catch(err => console.log('This Error', err));

// Fails as catch doesn't work on Promises.

const promiseHandler = new Promise(function(resolve, reject) {
    setTimeout(() => {
      reject("Whoops!");
    }, 1000);
});

promiseHandler.then().catch(err => console.log('This Error', err));

/** **************************************************************
 * *********************   ASYNC?AWAIT   *************************
**************************************************************** */

// Rewrite using async/await
const util = require("util");
const fs = require("fs");
const readFile = util.promisify(fs.readFile);

async function loadJson(url) {
    const response = await readFile(url);
    if (response.status == 200) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
  }
  
loadJson('nosuchFile.txt').catch(err => console.log(err)); // Error: 404

/**
 * Call async from non-async
 * We have a “regular” function. How to call async from it and use its result?
 */

async function wait() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return 10;
}
  
(function f() {
    wait().then(data => console.log(data));
})();