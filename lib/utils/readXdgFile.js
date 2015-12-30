var fs = require('fs');
var parser = require("xdg-parse");
module.exports = function(file){
  return new Promise(function(resolve, reject) {
    fs.readFile(file,{encoding:'utf8'},function(err,content){
      if(err){
        console.log("REJECT")
        return reject(err)
      }
      resolve(parser(content));
    })
  });
}
