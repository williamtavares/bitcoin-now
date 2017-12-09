// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
/**
 * Add your Analytics tracking ID here.
 */
// var _AnalyticsCode = 'UA-39802197-13';
// /**
//  * Below is a modified version of the Google Analytics asynchronous tracking
//  * code snippet.  It has been modified to pull the HTTPS version of ga.js
//  * instead of the default HTTP version.  It is recommended that you use this
//  * snippet instead of the standard tracking snippet provided when setting up
//  * a Google Analytics account.
//  */
// var _gaq = _gaq || [];
// _gaq.push(['_setAccount', _AnalyticsCode]);
// _gaq.push(['_trackPageview']);
// (function() {
//   var ga = document.createElement('script');
//   ga.type = 'text/javascript';
//   ga.async = true;
//   ga.src = 'https://ssl.google-analytics.com/ga.js';
//   var s = document.getElementsByTagName('script')[0];
//   s.parentNode.insertBefore(ga, s);
// })();
// /**
//  * Track a click on a button using the asynchronous tracking API.
//  *
//  * See http://code.google.com/apis/analytics/docs/tracking/asyncTracking.html
//  * for information on how to use the asynchronous tracking API.
//  */
// function trackButtonClick(e) {
//   _gaq.push(['_trackEvent', e.target.id, 'clicked']);
// }

$(document).ready(function() {

  getNewData();
  
  //Poll for changes every 10 seconds
  setInterval(function(){ 
    getNewData();
  }, 10000);

});

function getNewData() {
  let markets = ["bitfinex","bittrex", "coinbase", "gemini", "kraken", "poloniex"];

  for(let i = 0; i < markets.length; i++) {
    getMarketDataAndUpdate(markets[i]);
  }
}

function getMarketDataAndUpdate(market) {

  $.ajax({
    url: "https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD&e="+market+"&extraParams=BitcoinNow",
    dataType: "json"
  }).done(function(data) {

    let currentMarket = $("#bn-main-container #markets #" + market).find("p.rate");
    //If there is a change in the rate, change the container color
    if(currentMarket.attr("id") != data.BTC.USD) {
      currentMarket.css({"background-color":"lightgreen"});
    }
    //Update the rate
    currentMarket.attr("id", data.BTC.USD);

    currentMarket.html('$' + data.BTC.USD);
    //When the update was made
    let date = new Date();
    let retrievedDate = (date.getMonth()+1)+'/'+date.getDate() + '/' + date.getFullYear();
    let time = addZero(convert24hourTo12Hour(date.getHours())) + ':' + addZero(date.getMinutes()) + ':' + addZero(date.getSeconds());
    
    $("#bn-main-container #markets #updatedTime").html('Last Updated: ' + retrievedDate + ' - ' + time);
    //After a time, remove the updated color
    setTimeout(function() {
      currentMarket.css({"background-color":"#ececec"});
    }, 1000);

  });

}

function convert24hourTo12Hour(hours) {
  if (hours > 12) {
    return hours -= 12;
  } else if (hours === 0) {
    return hours = 12;
  }
  return hours;
}

function addZero(time) {
  if (time < 10) {
    time = "0" + time;
}
return time;
}