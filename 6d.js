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

obj = [];

array_code.map((code) => {
  let cs = code.split(".");
  cs.pop();
  obj.push(cs.reduceRight((all, item) => ({ [item]: all }), code))
});

console.log("obj ->",obj)
