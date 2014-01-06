console.log( "script load" );

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {

chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
	console.log(tabs[0].url)
      if(tabs[0].url.indexOf("batoto") > 0 ){
        var urlMap
        chrome.storage.local.get("mangaBookmark",function(storage){
          console.log(storage)
             urlMap = storage.mangaBookmark          
              if(!urlMap){
                urlMap = {};
              }    
            
              var fullTitle = tabs[0].title
        
              var mangaTitle = fullTitle.split("-")[0]
              if(mangaTitle.indexOf("www.batoto") < 0){
                urlMap[mangaTitle] = tabs[0].url 
              
                chrome.storage.local.set({'mangaBookmark': urlMap}, function() {
                 // Notify that we saved.      
                });    
              }
              
          });          
        }      
    });

})