var Finder = require("../lib");
describe("Finder",function(){
  describe(".find() thumbnailer",function(){
    beforeEach(function(){
      this.finder = new Finder("thumbnailer");

    });
    it("simple",function(done){
      this.finder.find("/path/to/file.txt").then(function(thumbnailer){
        expect(thumbnailer).to.equal("/usr/bin/foo %i %o");
        done();
      }).catch(function(e){
        done(e);
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
})
