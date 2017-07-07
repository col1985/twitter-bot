var twit = require("twit");
var config = require("./../config");
var Promise = require('bluebird');

var Twitter = new twit(config);

function hasHashTag(tag) {
  return (tag !== undefined || tag !== null);
}

// // function to generate a random tweet tweet
function ranDom(arr) {
  var index = Math.floor(Math.random() * arr.length);
  return arr[index];
}


// RETWEET BOT ==========================

// find latest tweet according the query 'q' in params
var retweet = function(tag) {
  return new Promise(function(resolve, reject) {
    var params = {
      q: '',  // REQUIRED
      result_type: 'recent',
      lang: 'en'
    };

    if (hasHashTag(tag)) {
      params.q = '#' + tag;
    } else {
      return reject('NO_TAG');
    }

    // for more parametes, see: https://dev.twitter.com/rest/reference/get/search/tweets
    Twitter.get('search/tweets', params, function(err, data) {
    // if there no errors
      if (!err) {
        // grab ID of tweet to retweet
        var retweetId = data.statuses[0].id_str;
        // Tell TWITTER to retweet
        Twitter.post('statuses/retweet/:id', {
          id: retweetId
        }, function(err, res) {
          if (res) {
            return resolve(true);
          }
          // if there was an error while tweeting
          if (err) {
            return reject(false);
          }
        });
      } else {
        return reject(false);
      }
    });
  });
};

// grab & retweet as soon as program is running...
// retweet();
// retweet in every 50 minutes
// setInterval(retweet, 3000);

// find a random tweet and 'favorite' it
var favoriteTweet = function(tag) {
  return new Promise(function(resolve, reject) {
    var params = {
      q: '',  // REQUIRED
      result_type: 'recent',
      lang: 'en'
    };

    if (hasHashTag(tag)) {
      params.q = tag;
    } else {
      return reject('NO_TAG');
    }

    // find the tweet
    Twitter.get('search/tweets', params, function(err, data) {
      // find tweets
      var tweet = data.statuses;
      var randomTweet = ranDom(tweet);   // pick a random tweet

      // if random tweet exists
      if (typeof randomTweet !== 'undefined'){
        // Tell TWITTER to 'favorite'
        Twitter.post('favorites/create', {id: randomTweet.id_str}, function(err, res) {
          // if there was an error while 'favorite'
          if (err) {
            return reject(false);
          }

          if (res) {
            return resolve(true);
          }
        });
      }
    });
  });
};

// // grab & 'favorite' as soon as program is running...
// favoriteTweet();
// // 'favorite' a tweet in every 60 minutes
// setInterval(favoriteTweet, 3600000)

module.exports = {
  retweet: retweet,
  favoriteTweet: favoriteTweet
};
