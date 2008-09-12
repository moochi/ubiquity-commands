CmdUtils.CreateCommand({
  name: "exit",
  homepage: "http://d.hatena.ne.jp/voogie01/",
  author: { name: "moochi", email: "moochi@voogie01.sakura.ne.jp"},
  license: "",
  description: "window close",
  help: "window close",
  preview: function( pblock, command ) {
  	pblock.innerHTML = "window close";
  },
  execute: function( command ) {
  	window.close();
  }
})
