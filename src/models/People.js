const mongoose = require('mongoose');
const validator = require('validator');

const model = mongoose.model('People', {
  name: {
    type: String,
    required: true,
    validate: {
    validator(name) {
        return validator.isAlphanumeric(name);
      },
    },
  },
  birth_year: {
    type: String,
    required: true,
  },
  eye_color: {
    type: String,
    required: false,
    validate: {
    validator(eye_color) {
        return validator.isAlphanumeric(eye_color);
      },
    },
  },
  gender: {
    type: String,
    required: false,
    validate: {
    validator(gender) {
        return validator.isAlphanumeric(gender);
      },
    },
  },
  hair_color: {
    type: String,
    required: false,
    validate: {
    validator(hair_color) {
        return validator.isAlphanumeric(hair_color);
      },
    },
  },
  height: {
    type: String,
    required: true,
    validate: {
    validator(height) {
        return validator.isAlphanumeric(height);
      },
    },
  },
  mass: {
    type: String,
    required: true,
    validate: {
    validator(mass) {
        return validator.isAlphanumeric(mass);
      },
    },
  },
  skin_color: {
    type: String,
    required: true,
    validate: {
    validator(skin_color) {
        return validator.isAlphanumeric(skin_color);
      },
    },
  },
  homeworld: {
    type: String,
    required: true,
    validate: {
      validator(homeworld) {
        return validator.isAlphanumeric(homeworld);
      },
    },
  },
  url: {
    type: String,
    required: true,
  },
  created: {
    type: String,
    required: true,
  },
  edited: {
    type: String,
    required: true,
  },
});

module.exports = model;
