/**
 * Created by amertis on 9/2/2015.
 */
var util = require('util');
var request = require('supertest');
var baseQuery = "SELECT * FROM yahoo.finance.xchange WHERE pair IN (%s) ";

var defaultBaseCurrency = "USD";
var defaultDirection = "FROM";
var format = "json";

function createQuery(baseCurrency,currencies,direction) {
    var conditions = currencies.map(function(currency){
        if(direction == 'FROM') {
            return '"'+baseCurrency+currency+'"';
        }
        return '"'+currency+baseCurrency+'"';
    })
    return util.format(baseQuery,conditions.join(","));

}

exports.getRates = function(opts,callback){
    if(arguments.length == 1)   {
        callback = opts;
        opts = {};
    }
    var baseCurrency = opts.baseCurrency || defaultBaseCurrency;
    var currenciesList = opts.currenciesList || require('./currencies');
    var direction = opts.direction || defaultDirection;
    var query = createQuery(baseCurrency,currenciesList,direction);
    var params = {
        q: query,
        format : format,
        env: "store://datatables.org/alltableswithkeys",
        callback : ""
    };
    var qs = Object.keys(params).map(function(k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]);
    }).join('&');
    request("https://query.yahooapis.com")
        .get("/v1/public/yql?"+qs)
        .end(function(err,res)  {
            if(err) {
                callback(err,null);
            }
            callback(null,res.body);
//            var resp = res.body;
//            resp.query.count.should.eql(currencies.length + revCurrencies.length);
//            resp.query.results.rate.length.should.eql(currencies.length + revCurrencies.length)
//            resp.query.results.rate.forEach(function(rate){
//                console.log(rate.Name + " " + 1/rate.Rate);
//            })
        })
}