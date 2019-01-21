var inquirer = require("inquirer")

var plugin = require("../plugin")
var logger = require("../util/logger")

module.exports = plugin({
  session: function(title, initObject) {
    return function(resolve/*, reject*/) {
      if (title) {
        logger.log(logger.format.title(title))
      }
      resolve(initObject || {})
    }
  },
  prompt: function(questions) {
    return function(resolve/*, reject*/) {
      inquirer.prompt(questions).then(function(answers) {
        resolve(answers)
      })
    }
  },
  ask: function(message, defaultValue) {
    var questions = {}
    questions.type = "input"
    questions.name = "value"
    questions.message = message
    questions.default = defaultValue
    return function(resolve/*, reject*/) {
      inquirer.prompt(questions).then(function(answers) {
        resolve(answers.value)
      })
    }
  },
  confirm: function(message, defaultValue) {
    var questions = {}
    questions.type = "confirm"
    questions.name = "value"
    questions.message = message
    questions.default = defaultValue
    return function(resolve/*, reject*/) {
      inquirer.prompt(questions).then(function(answers) {
        resolve(answers.value)
      })
    }
  },
  select: function(message, choices, defaultValue) {
    var questions = {}
    questions.type = "list"
    questions.name = "value"
    questions.message = message
    questions.choices = choices
    questions.default = defaultValue
    return function(resolve/*, reject*/) {
      inquirer.prompt(questions).then(function(answers) {
        resolve(answers.value)
      })
    }
  },
  checkbox: function(message, choices, defaultValue) {
    var questions = {}
    questions.type = "checkbox"
    questions.name = "value"
    questions.message = message
    questions.choices = choices
    questions.default = defaultValue
    return function(resolve/*, reject*/) {
      inquirer.prompt(questions).then(function(answers) {
        resolve(answers.value)
      })
    }
  },
  password: function(message) {
    var questions = {}
    questions.type = "password"
    questions.name = "value"
    questions.message = message
    return function(resolve/*, reject*/) {
      inquirer.prompt(questions).then(function(answers) {
        resolve(answers.value)
      })
    }
  }
})
