const fv = require("fastest-validator");

const v = new fv();

const schema = {
  title: {
    type: "string",
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  body: {
    type: "string",
    required: true,
    minLength: 5,
    maxLength: 250,
  },
};

const check = v.compile(schema);

module.exports = check;
