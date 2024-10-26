const fv = require("fastest-validator");

const v = new fv();

const schema = {
  name: {
    type: "string",
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  model: {
    type: "string",
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  brand: {
    type: "string",
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  isProductNew: {
    type: "number",
    required: true,
    min: 0,
    max: 1,
  },
  count: {
    type: "number",
    required: true,
    min: 0,
  },
  off: {
    type: "number",
    required: true,
    min: 0,
    max: 100,
  },
  price: {
    type: "number",
    required: true,
    min: 0,
  },
  description: {
    type: "string",
    required: true,
  },
};

const check = v.compile(schema);

module.exports = check;
