const express = require('express');
const path = require('path')
const bodyParser = require('body-parser');



var Twit = require('twit');
var T = new Twit({
  consumer_key:         '...',
  consumer_secret:      '...',
  access_token:         '...',
  access_token_secret:  '...',
})

var tweets = [];
var tweetsTime = [];
var username = '';
var sdate;
var edate;
var tdate;
var j;

// init app
const app = express();
app.set('port' ,(process.env.PORT|| 3000))

//load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));

// Home route
app.get('/',function(req,res){
  res.render('index');
});



app.post('/',function(req,res){
  username = req.body.username
  sdate = req.body.sdate
  edate = req.body.edate
  sdate = Date.parse(sdate)
  edate = Date.parse(edate) + 86400000
  tweets = [];
  j = 0;


  T.get('statuses/user_timeline', { screen_name : username , count : 200 }, dataview );

  function dataview(err, data, response) {
    for (var i = 0; i < data.length; i++ ){
      tdate = Date.parse(data[i].created_at)
      if (edate >= tdate && sdate <= tdate){
        tweets[j] = data[i].text
        tweetsTime[j] = data[i].created_at
        j = j+1;
        console.log(tweets[i]);
        console.log(data[i].created_at);
      }
    }
  console.log(data.length);

  res.render('index', {
    n : tweets.length,
    tweets : tweets,
    tweetsTime : tweetsTime
    });
  }
});



// start server
app.listen(app.get('port'),function(){
  console.log("Example started");
});
