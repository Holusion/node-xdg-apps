var path = require("path");
describe("utils - getXdgDirs()",function () {
  var getXdgDirs;
  before(function(){
    getXdgDirs = require("../lib/utils/getXdgDirs");
  })
  describe("dataDirs",function(){
    it("returns content of $HOME/.local/share and $XDG_DATA_DIRS in proper order",function(){
      var dirs = getXdgDirs("dataDirs");
      const data_dirs = [
        path.join(process.env["HOME"],".local/share"),
        path.join(__dirname,"fixtures"),
      ];
      expect(dirs).to.deep.equal(data_dirs);
    });
    it("join path with first parameter",function(){
      var dirs = getXdgDirs("dataDirs","toto");
      expect(dirs.length).to.equal(2);
      expect(dirs[1]).to.equal(path.join(__dirname,"fixtures/toto"));
    });
  });
});
