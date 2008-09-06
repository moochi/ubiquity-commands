var noun_type_tour_command = new CmdUtils.NounType( "command", ['next','prev','first'] );

CmdUtils.CreateCommand({
  name: "tour",
  homepage: "http://d.hatena.ne.jp/voogie01/",
  author: { name: "moochi", email: "moochi@voogie01.sakura.ne.jp"},
  license: "",
  description: "bookmark keyword tour.",
  help: "bookmark keywork tour.",
  takes: {command: noun_type_tour_command},
  preview: function( pblock, command ) {
  },
  execute: function( command ) {
 		var bmsvc = Components.classes["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Components.interfaces.nsINavBookmarksService);
		var windowManager = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
		var browserWindow = windowManager.getMostRecentWindow("navigator:browser");
		var browser = browserWindow.getBrowser();
		if(command.text == 'first') {
			var uri = bmsvc.getURIForKeyword('t_1');
			if(uri) {
				browserWindow.loadURI(uri.spec,null,null,false);
			}
			else {
				displayMessage('no t_1');
			}
			return;
		}
		var keyword = bmsvc.getKeywordForURI(browser.mCurrentBrowser.currentURI);
		if(keyword) {
			var match = keyword.match(/t_(\d+)/);
			if(match) {
				var num = match[1];
				if(command.text == 'next') {
					num++;
				}
				else {
					num--;
				}
				var uri = bmsvc.getURIForKeyword('t_'+num);
				if(uri) {
					browserWindow.loadURI(uri.spec,null,null,false);
				}
				else {
					displayMessage('no tour num ' + keyword);
				}
			}
			else {
				displayMessage('not to tour keyword');
			}
		}
		else {
				displayMessage('not keyword');
		}
  }
})


