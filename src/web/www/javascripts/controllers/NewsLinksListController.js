Ext.regController('NewsLinksList', {

	Index: function(options)
    {
		debugger
		 var $this = this;
     	this.newsLinksListView = this.render({
            xtype: 'NewsLinksListView'
        }); 
     	var newsLinksListController = this;
    	$this.newsLinksListView.addListener('itemtap',
            	function(that, index, item, e) {
   
            var record = that.store.getAt(index);
            newsLinksListController._gotoLink(record);
				});
    	var sMembers = "";
    	for (i=0;i<1;i++) {
    		var party = slimData[i];
    		for (j=0;j<5;j++)
    			sMembers += party.members[j].name += "%20OR%20"
    	}
    	sMembers = sMembers.substr(0,sMembers.length-5);	
    	//sMembers ='אלי ישי OR אהוד ברק'
     	Ext.util.JSONP.request({
                url: 'http://api.bing.net/json.aspx?AppId=D92F32F34F57F9A3DF2CD73F80DF63292EEE2B1A&Sources=Web&Query=(' + sMembers + ')%20AND%20(site:haaretz.co.il OR site:ynet.co.il OR site:nrg.co.il OR site:http://www.israelhayom.co.il/)&JsonType=callback&JsonCallback=Ext.util.JSONP.callback',
 //               url: 'http://api.bing.net/json.aspx?AppId=D92F32F34F57F9A3DF2CD73F80DF63292EEE2B1A&Sources=Web&Query=%22%D7%90%D7%9C%D7%99%20%D7%90%D7%A4%D7%9C%D7%9C%D7%95%22%20%28site:ynet.co.il%20OR%20site:haaretz.co.il%29&Version=2.0&Options=EnableHighlighting&News.Offset=0&News.SortBy=Relevance',
//        		url: "http://ws.geonames.org/searchJSON",
	
 //                   callbackKey: 'callback',
                    callback: function(result) {
                         // Output result to console (Firebug/Chrome/Safari)
                         console.log(result);
                         // Handle error logic
                         if (result.error) {
                            alert(result.error)
                            return;
                         }
                         // Continue your code
                         
                    	
                    
 

                    	var data =  new Array();
                    	var results = result.SearchResponse.Web.Results;
                    	for (i=0;i<results.length;i++) {
                    		data.push({"title":results[i].Title,"url":results[i].Url});
                    	}

                    	OKnesset.NewsLinksStore.loadData(data,false);
                    	$this.application.viewport.setActiveItem($this.newslinksView, options.animation);

                    	$this.newsLinksListView.refresh();
                    }
                });           
        	


        

        this.application.viewport.query('#toolbar')[0].setTitle(OKnesset.strings.newsTitle);
        this.application.viewport.setActiveItem(this.newsLinksListView, options.animation);
    },

    getReviewButtonText : function(){
    	return OKnesset.strings.emailPartyList;
    },

	refresh : function() {
		this.newsLinksListView.refresh();
	},
    /**
     * Open news link in browser. open the browser to display the full news article
     */
    _gotoLink: function(record){
        var newsLink = record.data;
        var url = newsLink.url;
        if (isPhoneGap()) {
            if (isiOS()) {
                // Since in iOS opening the browser exists the application,
                // the user should be prompted if she wishes to do so.
				var that = this;
                navigator.notification.confirm(null, function(idx){
                    if (idx == 2) {
                        that._gotoLinkCallback(url, newsLink.url)
                    } else {
                        // track bill cancel
                        GATrackLinkCanceled(newsLink.url)
                    }
                }, OKnesset.strings.openNewsLinkText, OKnesset.strings.dialogOKCancel);
            } else {// android
                this._gotoLinkCallback(url, newsLink.url);
            }
        }
        // TODO for web version - open a new browser tab

    },

    _gotoLinkCallback: function(url, newsLinkUrl){
        // in iOS, this function is called form native code, and it is necessary
        // that the next call to native code via phonegap command would not be
        // executed in the same "thread".
        window.setTimeout(function(){
            GATrackLink(newsLinkUrl, function(){
                if (isAndroid()) {
                    window.plugins.webintent.startActivity({
                        action: WebIntent.ACTION_VIEW,
                        url: url
                    }, function(){
                        // success callback
                    }, function(){
                        alert(OKnesset.strings.errorNewsLink)
                    });
                } else if (isiOS()) {
                    document.location = url;
                }
            });
        }, 10);
    }
    
});