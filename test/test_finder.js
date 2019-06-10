var Finder = require("../lib");
describe("Finder",function(){
  describe(".find() thumbnailer",function(){
    beforeEach(function(){
      this.finder = new Finder("thumbnailer");

    });
    it("simple",function(){
      return this.finder.find("/path/to/file.txt").then(function(thumbnailer){
        expect(thumbnailer).to.equal("/usr/bin/foo %i %o");
      });
    });
  });
  describe(".find() desktop",function(){
    beforeEach(function(){
      this.finder = new Finder("desktop");

    });
    it("simple",function(done){
      this.finder.find("/path/to/file.txt").then(function(thumbnailer){
        expect(thumbnailer).to.equal("foo %f");
        done();
      }).catch(function(e){
        done(e);
      });
    });
  });
  describe(".findEntry() desktop", () => {
    let finder;
    beforeEach(() => {
      finder = new Finder("desktop");
    });
    it("simple", () => {
      return finder.findEntry("/path/to/file.txt").then(desktop => {
        expect(typeof desktop).to.equal("object");
        expect(desktop['Exec']).to.equal("foo %f");
      })
    });
    it("extended simple with special format", () => {
      return finder.findEntry("/path/to/file.foo").then(desktop => {
        expect(typeof desktop).to.equal("object");
        expect(desktop['Exec']).to.equal("bar %U");
      })
    });
    it("from URI scheme",function(){
      return finder.findEntry("bar://hostname/path").then(desktop => {
        expect(typeof desktop).to.equal("object");
        expect(desktop['Exec']).to.equals("bar %U");
      })

    })
    it("from URI scheme (no hostname)",function(){
      return finder.findEntry("bar:///path/to/file").then(desktop => {
        expect(typeof desktop).to.equal("object");
        expect(desktop['Exec']).to.equal("bar %U");
      })
    })
    it("no entry found", () => {
      return finder.findEntry("path/to/file").then(e => {
        expect(e).to.equals(null);
      })
    });
  });
})
