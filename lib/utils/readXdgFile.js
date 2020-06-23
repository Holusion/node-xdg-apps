var fs = require('fs');
var parser = require("xdg-parse");
module.exports = function readXdgFile(file){
  return fs.promises.readFile(file,{encoding:'utf8'}).then((c)=>parser(c));
}
