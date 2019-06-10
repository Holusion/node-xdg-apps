var path = require("path");
describe("EntryList : applications",function () {
  var EntryList;

  before(function(){
    EntryList = require("../lib/EntryList");
  })

  it("parses desktop entries (localized or not)",function(done){
    var list = new EntryList();
    list.entries.then(function(entries){
      expect(typeof entries).to.equal("object");
      expect(typeof entries['foo.desktop']).to.equal("object");
      expect(typeof entries['foo.desktop']['Desktop Entry']).to.equal("object");
      expect(       entries['foo.desktop']['Desktop Entry']["Exec"]).to.equal("foo %f");
      expect(typeof entries['vlc.desktop']).to.equal("object");
      expect(       entries['vlc.desktop']['Desktop Entry']["Exec"]).to.equal("/usr/bin/vlc --started-from-file %U");
      expect(typeof entries['bar.desktop']).to.equal("object");
      expect(       entries['bar.desktop']["Desktop Entry"]["DBusActivatable"]).to.equal("true");
      done();
    }).catch(function(e){
      console.log("error :",e);
      done(e);
    });
  });
  it("getExecKey",function(done){
    var list = new EntryList();
    list.getExecKey("foo.desktop").then(function(found){
      expect(found).to.equal("foo %f");
      done();
    }).catch(function(e){
      done(e);
    });
  });
  describe("find",function(){
    it("mime type",function(done){
      var list = new EntryList();
      list.find("image/x-foo").then(function(found){
        expect(typeof found).to.equal("object");
        expect(typeof found['Desktop Entry']).to.equal("object");
        expect(found['Desktop Entry']['Exec']).to.equal("bar %U");
        expect(found['Desktop Entry']['ID']).to.equal("bar.desktop");
        done();
      }).catch(function(e){
        done(e);
      });
    });
    it("resolve when not found",function(done){
      var list = new EntryList();
      list.find("application/binary").then(function(found){
        done();
      }).catch(function(e){
        done(e);
      })
    });
  });

});
