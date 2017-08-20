// promo.js
// =============================================================================

// call the packages we need
var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var cheerioTableparser = require('cheerio-tableparser');
var iconv = require('iconv-lite');

// set base URL to grab html
var url = 'https://www.slivki.by/skidki-i-rasprodazhi/vse-azs-minsk-skidka';

// array for saving promotions
var promotions = [];
var tempArray = [];

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
        res.json(promotions);
        promotions = [];
    });
});

function mainContentParser(html) {
    var $ = cheerio.load(html, { ignoreWhitespace: true });
    var tempTable = "<table id = 'data'>";
    var rows = "";
    // Extract data
    $('div .saleBody')
        .children('table')
        .first()
        .children('tbody')
        .children('tr')
        .next()
        .each(function (i, el) {
            rows = rows + "<tr>";
            $(this).children('td')
                .each(function (j, el) {
                    var td = $(this).text();
                    rows = rows + "<td>" + td + "</td>"
                });
            rows = rows + "</tr>";

            tempArray.push(rows);
        });

    tempArray.forEach(glue)

    function glue(item, index) {
        tempTable = tempTable + item;
    }
    tempTable = tempTable + "</table>";

    var table = cheerio.load(tempTable);
    cheerioTableparser(table);
    var data = table("#data").parsetable(false, false, true);

    console.log(data);

    promotions.push(data);

    return promotions;
}


module.exports = router;