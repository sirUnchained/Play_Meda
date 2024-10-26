const fv = require("fastest-validator");

const v = new fv();

const schema = {
  score: {
    type: "number",
    required: false,
    max: 5,
    min: 1,
  },
  body: {
    type: "string",
    required: true,
    minLength: 5,
    maxLength: 255,
  },
};

const check = v.compile(schema);

module.exports = check;
