var fs = require("fs")
  , path = require("path");

var getXdgDirs = require("./utils/getXdgDirs")
/**
 * http://standards.freedesktop.org/desktop-entry-spec/latest/
 */
var readdir = require("./utils/readXdgDir")
  , dedupe = require("./utils/xdgDedupe");

var types = require("./types.json");


function EntryList(type){
  var dataDirs;
  if(typeof type === "string"){
    if(!types[type]){
      console.log("invalid type : %s. See %s/types.json for a list of supported types",type,__dirname);
    }
    type = types[type];
  }else{
    type = types["desktop"];
  }
  this.type = type;
  dataDirs = getXdgDirs("dataDirs",this.type["folder"]);
  this.entries = Promise.all(dataDirs.map(function(dir){
      return readdir(dir,"."+type["ext"]+"$");
    }))
    .then(function(entries){
      return entries.reduce(dedupe,{});
    }).then(function (entries) {
      Object.keys(entries).forEach(function(key){
        if(!entries[key][type["name"]]){
          delete entries[key];
        }
      });
      return entries;
    });
}
EntryList.prototype.getExecKey = function(desktop_id){
  var block = this.type["name"];
  return this.entries.then(function(entries){
    if(entries[desktop_id]){ //"Desktop Entry" key presence have already been checked in constructor
      return entries[desktop_id][block]["Exec"];
    }else{
      return null;
    }
  });
}

EntryList.prototype.getEntry = function(desktop_id){
  return this.entries.then(function(entries){
    return entries[desktop_id];
  });
}

EntryList.prototype.find = function(mime){
  var apps = {},block = this.type["name"];
  return this.entries.then((entries) => {
    Object.keys(entries).forEach(function(key){
      if(entries[key][block]["MimeType"] && entries[key][block]["MimeType"].indexOf(mime) != -1){
        apps[key] = entries[key][block];
      }
    });
    keys = Object.keys(apps);
    if(keys.length ==0){
      return null;
    }else{
      entries[keys[0]][block]["ID"] = keys[0];
      return entries[keys[0]];
    }
  });

}




module.exports = EntryList;
