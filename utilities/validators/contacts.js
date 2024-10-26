const fv = require("fastest-validator");

const v = new fv();

const schema = {
  fullname: {
    type: "string",
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  issue: {
    type: "string",
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  explain: {
    type: "string",
    required: true,
    minLength: 5,
    maxLength: 255,
  },
  email: {
    type: "email",
    required: true,
  },
  phone: {
    type: "string",
    pattern: /((0?9)|(\+?989))\d{2}\W?\d{3}\W?\d{4}/g,
  },
  $$strict: true,
};

const check = v.compile(schema);

module.exports = check;
