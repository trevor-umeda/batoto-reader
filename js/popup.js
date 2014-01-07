// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * This class wraps the popup's form, and performs the proper clearing of data
 * based on the user's selections. It depends on the form containing a single
 * select element with an id of 'timeframe', and a single button with an id of
 * 'button'. When you write actual code you should probably be a little more
 * accepting of variance, but this is just a sample app. :)
 *
 * Most of this is boilerplate binding the controller to the UI. The bits that
 * specifically will be useful when using the BrowsingData API are contained in
 * `parseMilliseconds_`, `handleCallback_`, and `handleClick_`.
 *
 * @constructor
 */

var urlMap = {};


$(function(){     
chrome.webNavigation.onBeforeNavigate.addListener(function(detail){    
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      if(tabs[0].url.indexOf("batoto") > 0){
        var fullTitle = tabs[0].title
        var mangaTitle = fullTitle.split("-")[0]
        if(!urlMap[mangaTitle]){
            $("#links").append("<a href='#' class='url' id='"+tabs[0].url+"'>"+ mangaTitle + "</a><br>")
        }
        urlMap[mangaTitle] = tabs[0].url 

        chrome.storage.sync.set({'mangaBookmark': urlMap}, function() {
          // Notify that we saved.      
        });  
      }
      
    });
});


  chrome.storage.sync.get("mangaBookmark",function(storage){
    urlMap = storage.mangaBookmark
    console.log(urlMap)
    if(!urlMap){
      urlMap = {};
    }
    for (var key in urlMap) {
    if (urlMap.hasOwnProperty(key)) {  
      $("#links").append("<a href='#' class='url' id='"+urlMap[key]+"'>"+ key + "</a><br>")
    }
  }
  })
  

  
$("#links").on('click',".url",function() {
      //$(".url").bind("mousedown", function(e) {
        console.log($(this).attr('id'))
        var url = $(this).attr('id')
        chrome.tabs.create({url: url});
        
  })

  $("#add").bind("mousedown", function(e) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      
      var fullTitle = tabs[0].title
      var mangaTitle = fullTitle.split("-")[0]
      if(!urlMap[mangaTitle]){
          $("#links").append("<a href='#' class='url' id='"+tabs[0].url+"'>"+ mangaTitle + "</a><br>")
      }
      urlMap[mangaTitle] = tabs[0].url 

      chrome.storage.sync.set({'mangaBookmark': urlMap}, function() {
        // Notify that we saved.      
      });
    });  
  });
});