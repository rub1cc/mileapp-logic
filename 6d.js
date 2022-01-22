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

obj = {};

function merge(source, target) {
    for (const [key, val] of Object.entries(source)) {
      if (val !== null && typeof val === `object`) {
        if (target[key] === undefined) {
          target[key] = new val.__proto__.constructor();
        }
        merge(val, target[key]);
      } else {
        target[key] = val;
      }
    }
    return target; // we're replacing in-situ, so this is more for chaining than anything else
  }

const pustToObj = (item) => {
    Object.entries(item).forEach(([key, val]) => {
        console.log("val",val)
        if(val !== null && typeof val === `object`) {
            if(obj[key] === undefined) {
                obj[key] = new val.__proto__.constructor();
            }
            pustToObj(val)
        } else {
            obj[key] = val;
        }
    })
};

array_code.map((code) => {
  let cs = code.split(".");
  cs.pop();
  pustToObj(cs.reduceRight((all, item) => ({ [item]: all }), code))
});

console.log("obj ->",obj)
