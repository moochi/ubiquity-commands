CmdUtils.CreateCommand({
  name: "open-bookmark",
  homepage: "",
  author: { name: "moochi", email: ""},
  license: "",
  description: "Open local bookmark new tab.",
  help: "Open local bookmark new tab.",
  takes: {search_text: noun_arb_text},
  modifiers: {row: noun_arb_text},
  _search_url: function(url,rows) {
 		var bmsvc = Components.classes["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Components.interfaces.nsINavBookmarksService);
		var bookmarksMenuFolder = bmsvc.bookmarksMenuFolder;

		var historyService = Components.classes["@mozilla.org/browser/nav-history-service;1"].getService(Components.interfaces.nsINavHistoryService);
		var options = historyService.getNewQueryOptions();
		var query = historyService.getNewQuery();
		query.setFolders([bookmarksMenuFolder], 1);
		query.searchTerms = url;
		options.maxResults = rows;
		options.sortingMode = options.SORT_BY_VISITCOUNT_DESCENDING;
		options.resultType = options.RESULTS_AS_URI;
		options.queryType = options.QUERY_TYPE_BOOKMARKS;
		return historyService.executeQuery(query, options);
  },
  preview: function( pblock, search_text, modifiers ) {
	var result = '';
	var searchText = jQuery.trim(search_text.text);
    if(searchText.length > 0) {
		var row_no = 0;
		if(modifiers.row && modifiers.row.text) {
			row_no = modifiers.row.text;
		}
		var list = this._search_url(searchText,0);
		var rootNode = list.root;
		rootNode.containerOpen = true;
		for (var i = 0; i < rootNode.childCount; i ++) {
			var node = rootNode.getChild(i);
			var previewdata = {
				cnt: i,
				title: node.title,
				url: node.uri,
			};
			var previewtemplate = "${cnt}:${title}(${url})";
			if(row_no == i) {
				previewtemplate = '<b>' + previewtemplate + '</b>';
			}
			previewtemplate = previewtemplate + '<br />';
			result = result + CmdUtils.renderTemplate(previewtemplate,previewdata);
		}
		rootNode.containerOpen = false;

		pblock.innerHTML = result;
	}
	else {
		pblock.innerHTML = result;
	}
  },
  execute: function( search_text, modifiers ) {
	var searchText = jQuery.trim(search_text.text);
    if(searchText.length > 0) {
		var row_no = 1;
		if(modifiers.row && modifiers.row.text) {
			row_no = modifiers.row.text;
			row_no++;
		}
		var url = '';
		var list = this._search_url(searchText,row_no);
		var rootNode = list.root;
		rootNode.containerOpen = true;
		for (var i = 0; i < rootNode.childCount; i ++) {
			var node = rootNode.getChild(i);
			url = node.uri;
		}
		rootNode.containerOpen = false;
		Utils.openUrlInBrowser(url);
	}
  }
})

