'use strict';
const {lookup, getTypes} = require("../lib/MimeType");

const path = require("path");
const dataFiles =  [path.join(__dirname,"fixtures/mime/globs2")];

describe("utils - MimeType",function () {
  before(function(){
  })

  describe("getTypes()",function(){
    it("get a list of extensions", function(){
      return getTypes(dataFiles)
      .then(({globs, extensions})=>{
        expect(extensions).to.deep.equal({ 
          mp4: 'video/mp4',
          f4v: 'video/mp4',
          txt: 'text/plain',
          foo: 'image/x-foo' 
        });
        expect(globs).to.deep.equal([ 
          [ /^.*\.C$/, 'text/x-c++src' ], 
          [ /^.*\.c$/, 'text/x-csrc' ] 
        ]);
      })
    })
  })

  it("promise a mime type for file",function(){
    return lookup("test.mp4", dataFiles).then(function(mimetype){
      expect(mimetype).to.equal("video/mp4");
    })
  });
  it("match case sensitive extensions(1)",function(){
    return lookup("test.c", dataFiles).then(function(mimetype){
      expect(mimetype).to.equal("text/x-csrc");
    })
  });
  it("match case sensitive extensions(2)",function(){
    return lookup("test.C", dataFiles).then(function(mimetype){
      expect(mimetype).to.equal("text/x-c++src");
    })
  });
  
});
