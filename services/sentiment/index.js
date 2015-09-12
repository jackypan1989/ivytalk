'use strict';

var exports = module.exports = {};
var lineReader = require('line-reader');
var nodejieba = require('nodejieba');
var _ = require('lodash')
var stopwords = require('./stopwords')

var ivyDict = {};

function skip(word) {
  return word.match(/[0-9a-zA-Z]+/);
}

var getSentiment = function(sentence) {
  var words = nodejieba.cut(sentence);
  var score = 0;
  for (var i=0; i<words.length; i++) {
    console.log(ivyDict[words[i]]);
    if (ivyDict[words[i]]) {
      score += ivyDict[words[i]];
    }
  }
  return score/words.length;
};

var loadCorpus = function() {
  lineReader
    .eachLine('./corpus/ivy.txt', function(line){
      var arr = line.split(' ');
      ivyDict[arr[0]] = arr[1];
    })
    .then(function(err) {
      if (err) throw err;
      var score = getSentiment('我喜歡');
      console.log(score);
    });
};

var training = function() {
  var dict = {};
  lineReader
    .eachLine('./corpus/roger/roger.txt', function(line){
      var result = nodejieba.cut(line);
      for (var i=0; i< result.length; i++) {
        var word = result[i];

        if (_.contains(stopwords.list, word) || skip(word)) continue;

        if(!dict[word]) dict[word] = 1;
        else dict[word]++;
      }
    })
    .then(function(err) {
      if (err) throw err;
      console.log("I'm done!!");

      var sortable = [];
      for (var word in dict) {
        if (dict[word] >= 3) {
          sortable.push([word, dict[word]])
        }
      }
      sortable.sort(function(a, b) {return b[1] - a[1]})
    });
};

loadCorpus();

