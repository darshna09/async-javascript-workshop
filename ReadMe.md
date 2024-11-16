# Asynchronous JavaScript

- Udemy course: Asynchronous JavaScript by Asim Hussain
- Code repository: https://github.com/jawache/async-javascript-workshop

## Visual Studio Code

1. Node Exec: Select the code snippet and press F8
2. Live Server

## V8

[V8](https://github.com/v8/v8) is Google’s open source high-performance JavaScript and WebAssembly engine, written in C++. It is used in Chrome and in Node.js.

[V8](https://v8.dev/docs) implements ECMAScript and WebAssembly, and runs on Windows 7 or later, macOS 10.12+, and Linux systems that use x64, IA-32, ARM, or MIPS processors. V8 can run standalone, or can be embedded into any C++ application.

V8 compiles and executes JavaScript source code, handles memory allocation for objects, and garbage collects objects it no longer needs. V8’s stop-the-world, generational, accurate garbage collector is one of the keys to V8’s performance.

JavaScript is commonly used for client-side scripting in a browser, being used to manipulate Document Object Model (DOM) objects for example. The DOM is not, however, typically provided by the JavaScript engine but instead by a browser. The same is true of V8 — Google Chrome provides the DOM. V8 does however provide all the data types, operators, objects and functions specified in the ECMA standard.

## Node

[Node.js](https://github.com/nodejs/node) is an open-source, cross-platform, JavaScript runtime environment. It executes JavaScript code outside of a browser.

Node [extends](https://github.com/nodejs/node/blob/master/src/node.cc) V8.

## Summary: V8 & Node & Chrome

V8 is synchronous. Node, Chrome, Electron embeds and extends V8. They are containers and hence different containers may provide different ways of interpreting the JavaScript.

Node allows you to read/write files and handle HTTP requests, handles server-side JavaScript rendering while Chrome is used as a client-side renderer for JavaScript.

The asynchronous implementations are specific to the container and not the ECMAScript spec.

So if you look at the spec itself for the javascript language you won't find any reference to setTimeout or fetch or other async functions: http://www.ecma-international.org/ecma-262/7.0/

Those are things that the containers themselves implement (there are web standard they follow from the W3C group etc. but they are not part of the javascript spec and therefore not part of the core JS engine).

## Understanding Synchronous vs Asynchronous

Consider the following code snippet (some made up language). Try to understand what this code is doing.

```
contents = readFile('./theFile.txt');
connection = openConnection('host', 8080);
write(contents, connection);
close(connection);
```

Here is what it is doing - 
1. Open file 'theFile.txt'
2. Open connection - localhost with port 8080.
3. Show the file's content in the open address.
4. Close the connection.

Here each line executes once the previous execution has completed. It is a synchronous code (one after the another). It is easy to follow and understand.

Now check out the most famous asynchronous node code snippet:

```javaScript
http.get({path: '...'}, response => {
    let body = '';
    response.on('data', part => {
        body += part;
    });
    response.on('end', () => {
        let parsed = JSON.parse(body);
    });
});
console.log('this gets printed first');
```

Scary, isn't it! Hence one difference between synchronous and asynchronous is ease of understanding. Then why is it used? It is used to increase performance.We want to understand when to use synchronous and asynchronous. Hence, to summarise we can say that
- Synchronous code is easier to predict.
- Asynchronous code is harder to predict but provides better.

### Blocking and Non-Blocking

- Blocking is synchronous.
- Non-blocking is asynchronous.

But the opposite is not true for asynchronous, because not all asynchronous executions are non-blocking.

Consider the first code snippet - the second line for opening a connection works only if read is complete. Hence line 2 is blocked in execution because of line 2.

Blocking is a idea developed by us to make writing software easy.

Let us see how our computer works - we have a CPU, a hard drive, and a memory.
1. CPU gets the instruction to read a file.
2. CPU asks the hard drive to seach the file.
3. While the hard drive is searching the file, the CPU will not sit ideal, it will continue with other tasks.
4. Hard drive on finding the file, will send the file to memory and a TCP request to CPU saying the file is in memory.
5. CPU will stop whatever it is doing and will resume with the function which asked for reading the file.

Hence the hardware is non-blocking, it is asynchronous. 

Consider the following table. It shows certain relative operation with respect to computers in actual time taken versus a relative time which we can understand (it is just scaled to highlight the point). So let us take 1 CPU cycle takes 1 second then what time it would take for other operations.

Relative operation | Actual time | Relative time
------------ | ------------- | -------------
1 CPU Cycle | 0.3 ns | 1 s
Main memory access | 120 ns | 6 minutes
Solid-state disk I/O | 50-150 microseconds | 2-6 days
Internet SF to UK | 81 ms | 8 years

Now if it takes 6 minutes for main memory access then CPU cannot wait for 6 minutes to wait for it. Hence, the hardware is asynchronous. It is non-blocking and thus non-blocking increases performance.

### Multi-threaded Programming

Multi-threaded programming is required for writing performant code.

#### Multi-process programming

Imagine a computer has many distinct processes running. Each process will have some space in memory allocated for it. Each process could read and write in its own allocated memory space. They cannot access other processes' memory and it could be of many different reasons let say one is security.

#### What is Multi-threaded programming?

The concept is same as multi-process programming but instead of having distinct process with distinct memory space, there are threads which share the memory. This arises the concept of race-conditions. Meaning that threads are competing against each other for who gets executed first since they are sharing memory. And depending on which thread gets executed first the result could vary. To avoid this race condition semantic locks are used. When one thread is accessing the memory it locks the memory and releases it once done. But then this can cause deadlock or livelock.

Multi-threading is hard to get right!

When one thread is blocked due to some process waiting for response another thread takes over. The CPU moves to another thread. There is no context switching but when all the threads are blocked the CPU will switch to different set of thread - context switching. Here the context-switching is less hence the code is more performant.

But writing performant multi-threaded code is hard.

### Event Driven Programming


## Asynchronous Patterns

- Callbacks
- Promises
- Async/Await
- Generators

### Asynchronous Patterns - Callbacks

- Quiz 1 (callbacks.quizz.md)
- Handling errors (callbacks.md)
- Quiz 2 (callbacks.quizz.md)
- Callback hell (callbacks.md)
- Quiz 3 (callbacks.quizz.md)

### Asynchronous Patterns - Promises

- Promises (promises.md)
- Quiz 1 (promises.quizz.md)
- Promises Chaining (promises.md)
- Quiz 2 (promises.quizz.md)
- Promises Error handling and `catch` (promises.md)
- Quiz 3 and 4 (promises.quizz.md)

### Asynchronous Patterns - Async/Await

- Basic (async-await.md)
- Quiz 1 (async-await.quizz.md)
- No Await (async-await.md)
- Async iterators (async-await.md)
- Quiz 2 (async-await.quizz.md)
- Warning: Don't use unless required.

### Asynchronous Patterns - Generators

- Understanding generators
- Generators - yield to communicate
- Async generators
- Quiz 1

## Event Loops

Understanding the underlying concept about how JS works!

- Node Event Loops.
- Node Event Loops Example.
- Quiz 1
- Quiz 2 (process.nextTick is micro task.)
- Chrome Event Loop (browser/raf-vs-set-timeout.html)

Chrome runs the render function only if there is anything to render, or if the user is active on the tab.