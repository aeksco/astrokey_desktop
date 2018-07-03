
// Type 'Hello World' then press enter.
const robot = require('robotjs');

setTimeout(() => {
  // Type 'Hello World'.
  robot.typeString('Hello World');
}, 5000);

// Press enter.
setTimeout(() => {
  robot.keyTap('enter');
}, 6000);