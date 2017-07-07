var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var twitterBot = require('./../bot');
var status = require('http-status-codes');

function _handleResponse(res) {
  res.status(status.OK).send(status.getStatusText(status.OK));
}

function _handleError(res, fail) {
  if (fail === 'NO_TAG') {
    res.status(status.INTERNAL_SERVER_ERROR).send(status.getStatusText(status.INTERNAL_SERVER_ERROR));
  }
  // console.error(err.toString());
  res.status(status.BAD_REQUEST).send(status.getStatusText(status.BAD_REQUEST));
}

function botRoute() {
  var bot = new express.Router();
  bot.use(cors());
  bot.use(bodyParser());

  // GET REST endpoint - query params may or may not be populated
  bot.get('/', function(req, res) {
    _handleResponse(res);
  });

  bot.get('/retweet/:tag', function(req, res) {
    var hashTag = req.params.tag;
    twitterBot.retweet(hashTag).then(function(success) {
      if (success) {
        _handleResponse(res);
      }
    }, function(fail) {
      _handleError(res, fail);
    });
  });

  bot.post('/favourite/:tag', function(req, res) {
    var hashTag = req.params.tag;
    twitterBot.favoriteTweet(hashTag).then(function(success) {
      if (success) {
        _handleResponse(res);
      }
    }, function(fail) {
      _handleError(res, fail);
    });
  });
  return bot;
}

module.exports = botRoute;
