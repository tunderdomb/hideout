var inquirer = require("inquirer")

var plugin = require("../plugin")

module.exports = plugin({
  prompt: function(questions) {
    return function(resolve/*, reject*/) {
      inquirer.prompt(questions, function(answers) {
        resolve(answers)
      })
    }
  },
  ask: function(questions) {
    questions.type = "input"
    return function(resolve/*, reject*/) {
      inquirer.prompt(questions, function(answers) {
        resolve(answers)
      })
    }
  },
  confirm: function(questions) {
    questions.type = "confirm"
    return function(resolve/*, reject*/) {
      inquirer.prompt(questions, function(answers) {
        resolve(answers)
      })
    }
  },
  select: function(questions) {
    questions.type = "list"
    return function(resolve/*, reject*/) {
      inquirer.prompt(questions, function(answers) {
        resolve(answers)
      })
    }
  },
  selectMultiple: function(questions) {
    questions.type = "checkbox"
    return function(resolve/*, reject*/) {
      inquirer.prompt(questions, function(answers) {
        resolve(answers)
      })
    }
  }
})
