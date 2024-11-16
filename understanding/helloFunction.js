console.log('You have loaded the hello JS file.');

function sayHello(name) {
    const sayName = name? name : document.getElementById('name').value;
    const hello = `Hi ${sayName}, glad to meet you`;
    console.log(hello);
}