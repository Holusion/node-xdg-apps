'use strict';
const Finder = require("../lib");
const path = require("path");
describe("Finder",function(){
  describe(".find() thumbnailer",function(){
    beforeEach(function(){
      this.finder = new Finder("thumbnailer");
      this.finder.entries.dirs=[path.join(__dirname,"fixtures/thumbnailers")];

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
      this.finder.entries.dirs=[path.join(__dirname,"fixtures/applications")];
    });
    it("simple",function(){
      return this.finder.find("/path/to/file.txt").then(function(thumbnailer){
        expect(thumbnailer).to.equal("foo %f");
      })
    });
  });
  describe(".findEntry() desktop", () => {
    let finder;
    beforeEach(() => {
      finder = new Finder("desktop");
      finder.entries.dirs=[path.join(__dirname,"fixtures/applications")];
    });
    it("simple", () => {
      return finder.findEntry("/path/to/file.txt").then(desktop => {
        expect(typeof desktop).to.equal("object");
        expect(desktop).to.have.property("Exec", "foo %f");
        expect(desktop).to.have.property("ID", "foo.desktop");
      })
    });
    it("extended simple with special format", () => {
      return finder.findEntry("/path/to/file.foo").then(desktop => {
        expect(typeof desktop).to.equal("object");
        expect(desktop).to.have.property("Exec", "bar %U");
        expect(desktop).to.have.property("ID", "bar.desktop");
      })
    });
    it("from URI scheme",function(){
      return finder.findEntry("bar://hostname/path").then(desktop => {
        expect(typeof desktop).to.equal("object");
        expect(desktop).to.have.property("Exec", "bar %U");
        expect(desktop).to.have.property("ID", "bar.desktop");
      })

    })
    it("from URI scheme (no hostname)",function(){
      return finder.findEntry("bar:///path/to/file").then(desktop => {
        expect(typeof desktop).to.equal("object");
        expect(desktop).to.have.property("Exec", "bar %U");
        expect(desktop).to.have.property("ID", "bar.desktop");
      })
    })
    it("no entry found", () => {
      return finder.findEntry("path/to/file").then(e => {
        expect(e).to.equal(null);
      })
    });
  });
})
