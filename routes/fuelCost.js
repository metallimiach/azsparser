// fuelCost.js
// =============================================================================

// call the packages we need
var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var iconv = require('iconv-lite');

// set base URL to grab html
var url = 'http://www.tarify.by/%D1%81%D1%82%D0%BE%D0%B8%D0%BC%D0%BE%D1%81%D1%82%D1%8C-%D1%82%D0%BE%D0%BF%D0%BB%D0%B8%D0%B2%D0%B0/';

// array for saving promotions
var prices = [];

router.get('/', function (req, res, next) {
    request({
        uri: url,
        method: 'GET',
        encoding: null                                      // encoding in binery
    }, function (error, response, body) {
        html = iconv.decode(new Buffer(body), 'utf8');   // encoding in utf8
        
        // Checking of response result
        if (!error && response.statusCode == 200) {
            promotions = mainContentParser(html);
        };
        res.json(prices);
        prices = [];
    });
});

function mainContentParser(html) {
    var $ = cheerio.load(html, { ignoreWhitespace: true });

    // Extract data
    $('table')
        .children('tbody')
        .children('tr').next()
        .each(function (i, el) {

        // fuel type name
        var fuel = $(this).children('td').first().text();

        // fuel cost
        var cost = $(this).children('td').first().next().find('b').html();
        
        // Parsed meta data object
        var metadata = {
            fuel: fuel,
            cost: cost
        };
        prices.push(metadata);
    });
    return this.prices;
}

module.exports = router;