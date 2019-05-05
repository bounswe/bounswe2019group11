const express = require('express')
const date = require('date-and-time');
const app = express()
const port = 3000
//const router = express.Router();
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://dbAdmin:dbAdminPass@traderzcluster-ro4z4.mongodb.net/test?retryWrites=true", {useNewUrlParser: true});
mongoose.set('useCreateIndex', true);
const Stocks = require('./stockSchema');
const request = require('request');
const stock_api_url = "https://www.alphavantage.co/query";
const StocksData = mongoose.model('StocksData', Stocks);

app.set('view engine', 'pug')
app.set('views', './views')
app.use(express.static('static'))
app.use(express.urlencoded({extended: true})) // req.body nin çalışması için gerekli

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.get('/stock', function(req, res) {
  res.render("stock")
})

app.post('/stock',(req,res) => {
  console.log(req.body);

  // Extract the parameters.
  // For detail of parameters: https://www.alphavantage.co/documentation/
  var parameters = {
    function : req.body.function,
    symbol : req.body.symbol,
    interval : req.body.interval,
    apikey: 'FZD9JFSVI7D6HY5E'
  };

  var final_url = stock_api_url + "?function=" + req.body.function + "&symbol=" + req.body.symbol + "&interval=" + req.body.interval + "&apikey=" + req.body.apikey;

  // Get data from the Alpha Vontage API and return the results.
  request({url:stock_api_url, qs:parameters}, function(error,response, body) {
    if(!error && response.statusCode == 200) {
      res.status(200).send(body)
    }
    var obj = JSON.parse(body);
    var firstInterval = date.parse(obj['Meta Data']['3. Last Refreshed'], 'YYYY-MM-DD HH:mm:ss');
    var dataInterval = req.body.interval.replace(/(^\d+)(.+$)/i,'$1');
    
    for( var i = firstInterval ; obj["Time Series (" +req.body.interval +")" ][date.format(i, 'YYYY-MM-DD HH:mm:ss')] ; i = date.addMinutes(i, -dataInterval ) ) {
      StocksData.create(
        {
          information : obj['Meta Data']['1. Information'],
          symbol : obj['Meta Data']['2. Symbol'],
          lastRefreshed :  obj['Meta Data']['3. Last Refreshed'],
          interval: obj['Meta Data']['4. Interval'],
          outputSize: obj['Meta Data']['5. Output Size'],
          timeZone: obj['Meta Data']['6. Time Zone'],
          dateData: date.format(i, 'YYYY-MM-DD HH:mm:ss'),
          open: obj["Time Series (" +req.body.interval +")" ][date.format(i, 'YYYY-MM-DD HH:mm:ss')]['1. open'],
          high: obj["Time Series (" +req.body.interval +")" ][date.format(i, 'YYYY-MM-DD HH:mm:ss')]['2. high'],
          low: obj["Time Series (" +req.body.interval +")" ][date.format(i, 'YYYY-MM-DD HH:mm:ss')]['3. low'],
          close: obj["Time Series (" +req.body.interval +")" ][date.format(i, 'YYYY-MM-DD HH:mm:ss')]['4. close'],
          volume: obj["Time Series (" +req.body.interval +")" ][date.format(i, 'YYYY-MM-DD HH:mm:ss')]['5. volume']
        }
      );
    }
    
  }); 
  

});




