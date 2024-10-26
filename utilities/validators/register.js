const fv = require("fastest-validator");

const v = new fv();

const schema = {
  fullname: {
    type: "string",
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  username: {
    type: "string",
    required: true,
    minLength: 5,
    maxLength: 50,
    pattern: /^\S*$/g
  },
  email: {
    type: "email",
    required: true,
  },
  phone: {
    type: "string",
    pattern: /((0?9)|(\+?989))\d{2}\W?\d{3}\W?\d{4}/g,
  },
  password: {
    type: "string",
    required: true,
  },
  // confirmPassword: {
  //   type: "string",
  //   fixed: "password",
  // },
  $$strict: true,
};

const check = v.compile(schema);

module.exports = check;
