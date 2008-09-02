var noun_type_bookmarks = {
	_name: 'bookmark',
	getBookmarks: function(text) {
		var result = [];
 		var bmsvc = Components.classes["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Components.interfaces.nsINavBookmarksService);
		var bookmarksMenuFolder = bmsvc.bookmarksMenuFolder;

		var historyService = Components.classes["@mozilla.org/browser/nav-history-service;1"].getService(Components.interfaces.nsINavHistoryService);
		var options = historyService.getNewQueryOptions();
		var query = historyService.getNewQuery();
		query.setFolders([bookmarksMenuFolder], 1);
		query.searchTerms = text;
		options.maxResults = 10;
		options.sortingMode = options.SORT_BY_VISITCOUNT_DESCENDING;
		options.resultType = options.RESULTS_AS_URI;
		options.queryType = options.QUERY_TYPE_BOOKMARKS;
		var list = historyService.executeQuery(query, options);
		var rootNode = list.root;
		rootNode.containerOpen = true;
		for (var i = 0; i < rootNode.childCount; i ++) {
			var node = rootNode.getChild(i);
			var param = {
				title: node.title,
				url: node.uri
			};
			result.push(param);
		}
		rootNode.containerOpen = false;

		return result;
	},
	suggest: function( text,html) {
		var suggestions  = [];
		if (typeof text != "string") {
		  // Input undefined or not a string
		  return [];
		}
		if(text == '') {
			suggestions.push( CmdUtils.makeSugg('no match') );
		  return suggestions;
		}

		text = jQuery.trim(text);
		var list = noun_type_bookmarks.getBookmarks(text);
		if(list.length) {
			for(i = 0; i < list.length; i++) {
				var item = list[i];
				var template = '${title}(${url})';
				suggestions.push(CmdUtils.makeSugg(CmdUtils.renderTemplate(template,item)));
			}
		}
		else {
			suggestions.push( CmdUtils.makeSugg('no match') );
		}
		return suggestions;
	}
}

CmdUtils.CreateCommand({
  name: "open-bookmark",
  homepage: "http://d.hatena.ne.jp/voogie01/",
  author: { name: "moochi", email: "moochi@voogie01.sakura.ne.jp"},
  license: "",
  description: "Open local bookmark new tab.",
  help: "Open local bookmark new tab.",
  takes: {bookmark: noun_type_bookmarks},
  preview: function( pblock, bookmark ) {
	if(bookmark.text) {
		pblock.innerHTML = bookmark.text;
	}
	else {
		pblock.innerHTML = 'search bookmark';
	}
  },
  execute: function( bookmark ) {
	var url = bookmark.text.match(/\((http:\/\/.*)\)$/);
	if(url) {
		Utils.openUrlInBrowser(url[1]);
	}
  }
})
