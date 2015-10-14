var path = require("path");
describe("EntryList : thumbnailers",function () {
  var EntryList;

  before(function(){
    EntryList = require("../lib/EntryList");
  });

  it("parses thumbnailer entries (localized or not)",function(done){
    var list = new EntryList("thumbnailer");
    list.entries.then(function(entries){
      expect(typeof entries).to.equal("object");
      expect(typeof entries['test.thumbnailer']).to.equal("object");
      expect(typeof entries['test.thumbnailer']['Thumbnailer Entry']).to.equal("object");
      expect(       entries['test.thumbnailer']['Thumbnailer Entry']["Exec"]).to.equal("/usr/bin/test %i %o");
      done();
    }).catch(function(e){
      console.log("error :",e);
      done(e);
    });
  });
  it("getExecKey",function(done){
    var list = new EntryList("thumbnailer");
    list.getExecKey("test.thumbnailer").then(function(found){
      expect(found).to.equal("/usr/bin/test %i %o");
      done();
    }).catch(function(e){
      done(e);
    });
  });
  describe("find",function(){
    it("mime type",function(done){
      var list = new EntryList("thumbnailer");
      list.find("application/x-test").then(function(found){
        expect(typeof found).to.equal("string");
        expect(found).to.equal("/usr/bin/test %i %o");
        done();
      }).catch(function(e){
        done(e);
      });
    });
  });
});
