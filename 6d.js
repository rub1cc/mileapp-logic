const dot = require('./dot-object')

array_code = [
  "1.",
  "1.1.",
  "1.2.",
  "1.3.",
  "1.4.",
  "1.1.1.",
  "1.1.2.",
  "1.1.3.",
  "1.2.1.",
  "1.2.2.",
  "1.3.1.",
  "1.3.2.",
  "1.3.3.",
  "1.3.4.",
  "1.4.1.",
  "1.4.3.",
];

let rows = {}

array_code.map(item => {
  rows = {...rows, [item.slice(0,-1)]: item}
})

console.log(dot.object(rows))