'use strict';
const path = require("path");
const {find, list} = require("../lib/MimeApps");

const dataFiles =  [path.join(__dirname,"fixtures/applications")];
describe("MimeApps",function () {

  it("parses mime associations",function(done){
    list(dataFiles).then(function(apps){
      expect(typeof apps).to.equal("object");
      expect(apps).to.not.have.property("application/bar");
      expect(apps).to.have.property("application/baz");
      expect(apps["application/baz"][0]).to.equal("foobar.desktop");
      done();
    }).catch(function(e){
      console.log("error :",e);
      done(e);
    });
  });
  it("find mime associations",function(done){
    find("application/baz", dataFiles).then(function(apps){
      expect(typeof apps).to.equal("object");
      expect(apps[0]).to.equal("foobar.desktop");
      done();
    }).catch(function(e){
      console.log("error :",e);
      done(e);
    });
  });
});
