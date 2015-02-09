/**
 * Created by amertis on 9/2/2015.
 */
var ratesClient = require('../')
var should = require('should')

describe('Testing',function(){
    it('should get all rates',function(done){
        ratesClient.getRates(function(err,res){
            should.equal(err,null);
            res.query.count.should.eql(161);
            res.query.results.rate[1].id.should.eql('USDEUR');
            done();
        })
    })
    it('should get rates for EUR default currency in opposite direction', function(done){
        ratesClient.getRates({
            baseCurrency:'EUR',
            direction:'TO',
            currenciesList: ['USD','SAR']
        },function(err,res){
            should.equal(err,null);
            res.query.count.should.eql(2);
            res.query.results.rate[0].id.should.eql('USDEUR');
            res.query.results.rate[1].id.should.eql('SAREUR');
            done();
        })
    })
})