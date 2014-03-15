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
  //Whenever a new page is navigated to with extension open
  //
  chrome.webNavigation.onBeforeNavigate.addListener(function(detail){    
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        if(tabs[0].url.indexOf("batoto") > 0){
          var fullTitle = tabs[0].title
          var mangaTitle = fullTitle.split("-")[0]
          if(mangaTitle.indexOf("www.batoto") < 0){
            if(!urlMap[mangaTitle]){
                $("#links").append("<a href='#' class='url' id='"+tabs[0].url+"'>"+ mangaTitle + "</a><br>")
            }
            urlMap[mangaTitle] = tabs[0].url 

            chrome.storage.sync.set({'mangaBookmark': urlMap}, function() {
              // Notify that we saved.      
            });  
          }
        }      
      });
  });

  // //SYNC STUFF dont' work atm
  // chrome.storage.sync.get("mangaSync",function(storage){
  //   urlMap = storage.mangaSync
  //   console.log("Got the sync storage")
  //   console.log(urlMap)
  //   if(!urlMap){
  //     urlMap = {};
  //   }
  //   for (var key in urlMap) {
  //     if (urlMap.hasOwnProperty(key)) {              
  //       $("#sync_table tbody").append("<tr><td><a href='#' class='url' id='"+urlMap[key]+"'>"+ key + "</a></td><td>X</td></tr>")
  //     }
  //   }
  // })

  //When the page is loaded, get all the bookmarks
  //
  chrome.storage.sync.get("mangaBookmark",function(storage){
    //Retrieve the bookmark object from storage.
    //
    urlMap = storage.mangaBookmark
    console.log(urlMap)
   
    //If it doesn't exist, then create it
    //
    if(!urlMap){
      urlMap = {};
    }

    //For each manga, create a link to it
    //
    for (var key in urlMap) {
      if (urlMap.hasOwnProperty(key)) {         
        $("#sync_table tbody").append("<tr><td><a href='#' class='url' id='"+urlMap[key]+"'>"+ key + "</a></td><td><div class='delete' id='"+key+"''>X</div></td></tr>")          
      }
    }

  //   //If the extension is opened on a page, then save it with sync ( doesn't work )

    // chrome.storage.sync.set({"mangaSync":urlMap},function(storage){
    //   console.log("saving")
    //   console.log(urlMap)
    //   chrome.storage.sync.get("mangaSync",function(storage){        
    //   })
    // })
  })
  
  $("#sync_table").on('click','.delete',function(){
    var key = $(this).attr('id');
    console.log(urlMap)
    console.log(key)
    delete urlMap[key]
    console.log(urlMap)
    chrome.storage.sync.set({'mangaBookmark': urlMap}, function() {
      // Notify that we saved.      
    });
  })

  //When a link is clicked, open it up in a new tab
  //  
  $("#links").on('click',".url",function() {        
    var url = $(this).attr('id')
    chrome.tabs.create({url: url});      
  })
  $("#links2").on('click',".url",function() {        
    var url = $(this).attr('id')
    chrome.tabs.create({url: url});      
  })
  //When add is clicked, bookmark the link
  //
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