var express = require('express');
var app = express();
var bot = require('./bot');
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

app.set('port', (process.env.PORT || 5000));
app.set('title', (process.env.APP_TITLE || 'trump_tweets_bot'));

app.get('/', function(req, res) {
  _handleResponse(res);
});

app.get('/retweet/:tag', function(req, res) {
	console.log(req.params)
  var hashTag = req.params.tag;
  bot.retweet(hashTag).then(function(success) {
    if (success) {
      _handleResponse(res);
    }
  }, function(fail) {
    _handleError(res, fail);
  });
});

app.post('/favourite/:tag', function(req, res) {
  var hashTag = req.params.tag;
  bot.favoriteTweet(hashTag).then(function(success) {
    if (success) {
      _handleResponse(res);
    }
  }, function(fail) {
    _handleError(res, fail);
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});