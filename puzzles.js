const fs = require('fs');
const readline = require('readline');

var puzzles = {
  set: [],
  random: function() {
    if(this.set.length == 0) {
      this.init();
    }
    var ri = Math.floor(Math.random() * this.set.length);
    return this.set[ri];
  },
  init: function() {
    var lines = fs.readFileSync('./problem-set.txt').toString().split("\n");

    for(var i = 0; i < lines.length; i++) {
      var numbers = [];
      for(var j = 0; j < 4; j++) {
        var number = parseInt(lines[i].substring(j * 2, j * 2 + 1));
        numbers.push(number);
      }
      this.set.push({numbers: numbers});
    }
  }
}

module.exports = puzzles;