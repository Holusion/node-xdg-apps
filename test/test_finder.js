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
        expect(thumbnailer).to.equal("fooview %f");
        done();
      }).catch(function(e){
        done(e);
      });
    });
  });
  describe(".findEntry() desktop", () => {
    beforeEach(() => {
      this.finder = new Finder("desktop");
    });
    it("simple", () => {
      return this.finder.findEntry("/path/to/file.txt").then(desktop => {
        expect(typeof desktop).to.equals("object");
        expect(desktop['Exec']).to.equals("fooview %f");
      });
    });
    it("no entry found", () => {
      this.finder.findEntry("path/to/file").then(e => {
        throw e;
      }).catch(e => {
        expect(e).to.equals(new Error("ENOTFOUND"))
      });
    });
  });
})
