const fs = require("fs");
const {promisify} = require("util");
const path = require("path");
const getXdgDirs = require("./utils/getXdgDirs");

const readFile = promisify(fs.readFile);



var ESCAPE_REG_EXP =  /([.+?^=!:${}()|\/\\])/g;
var EXTENSION_GLOB_REGEXP = /^\*\.[^\*\?\[]+$/; //Check it's not bracketed

function glob2regexp(glob, case_sensitive){
	return new RegExp('^' + glob.replace(ESCAPE_REG_EXP, '\\$1').replace(/\*/g, '.*') + '$', case_sensitive ? '' : 'i')
}


function getTypes(files = getXdgDirs("dataDirs","mime/globs2")){
  return Promise.all(files.map(file=> {
    return readFile(file, {encoding:'utf8'})
    .catch((e)=>{
      if(e.code !== "ENOENT"){
        console.log(`failed to read ${file} : ${e}`);
      }
      return "";
    })
    .then((content)=>parseMimeFile(content));
  })).then((results)=> results.reduce((acc, r)=>{
    acc.globs = acc.globs.concat(r.globs);
    acc.extensions = Object.assign(r.extensions, acc.extensions);
    return acc;
  }, {globs:[], extensions:{}}));
}

function parseMimeFile(content){
  const globs = [];
  const extensions = {};
  const lines = content.split('\n');
  for(let j = 0, line; line = lines[j]; j++){
    if(line.charAt(0) === '#')
      continue;
    var glob = line.split(':')
    var cs = glob[3] === 'cs' //marked as case sensitive
    if(!cs && EXTENSION_GLOB_REGEXP.test(glob[2])){
      var ext = glob[2].substring(2).toLowerCase()
      if(!extensions[ext])
        extensions[ext] = glob[1];
    } else{
      globs.push([glob2regexp(glob[2], cs), glob[1]])
    }
  }
  return {globs, extensions};
}

async function lookup(file, files) {
  const {globs, extensions} = await getTypes(files);
  const basename = path.basename(file);
  const ext = path.extname(basename.toLowerCase()).replace(".","");
  if(ext && extensions[ext]){
      return extensions[ext];
  }
  for(let glob of globs){
    if(glob[0].test(basename)){
      return glob[1];
    }
  }
  return "application/octet-stream";
};

module.exports = {lookup, getTypes, parseMimeFile};
