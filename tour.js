var noun_type_tour_command = new CmdUtils.NounType( "command", ['next','prev','first'] );

CmdUtils.CreateCommand({
  names: ["tour"],
  icon: "",
  description: "bookmark keyword tour.",
  help: "The tour command goes it round the bookmark. The bookmark is chosen and it is input to the keyword item of the property, 't_1'.The bookmark of 't_1' is opened by 'tour first' command. The bookmark set to the keyword, 't_2' is opened by 'tour next' command with 't_1' bookmark opened.",
  author: { name: "moochi", email: "moochi@voogie01.sakura.ne.jp"},
  license: "",
  homepage: "http://d.hatena.ne.jp/voogie01/",
  arguments: [{role: 'object', nountype: noun_type_tour_command}],
  preview: function preview(pblock, args) {
  },
  execute: function execute(args) {
 		var bmsvc = Components.classes["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Components.interfaces.nsINavBookmarksService);
		var windowManager = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
		var browserWindow = windowManager.getMostRecentWindow("navigator:browser");
		var browser = browserWindow.getBrowser();
		if(args.object.text == 'first') {
			var uri = bmsvc.getURIForKeyword('t_1');
			if(uri) {
				Utils.openUrlInBrowser(uri.spec);
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
				if(args.object.text == 'next') {
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
});

