'use strict';
const readdir = require("./utils/readXdgDir")
//based on http://standards.freedesktop.org/mime-apps-spec/latest/index.html


const path = require("path");
const xdg = require("xdg-basedir")
const default_confdirs = xdg["configDirs"].concat(
  [path.join(xdg["data"], "applications")],  
  xdg["dataDirs"].map(p => path.join(p,"applications"))
);

/**
 * return default apps coresponding to mime type. If no app is available, return the mime type to allow chainable actions.
 * @param  {string} mime mime type
 * @return {Promise}    a Promise that resoles on an app name.
 */
function find(mime, confdirs = default_confdirs) {
  return list(confdirs).then(function(apps){
    if(apps[mime]){
      return apps[mime];
    }else{
      return []; //It's not an error to not find an app
    }
  });
};
//Return a Promise for a list of applications
function list(confDirs = default_confdirs) {
  return Promise.all(confDirs.map(function(dir){
    return readdir(dir,"^mimeapps.list$");
  })).then(function (contents) {
    var obj = {};
    contents.forEach(function(file){
      if(!file||!(file = file["mimeapps.list"])||!(file = file["Default Applications"])){
        return;
      }
      Object.keys(file).forEach(function(key){
        if(!obj[key]){
          obj[key] = [];
        }
        obj[key].push( file[key]);
      });
    });
    return obj;
  });
};
module.exports = {find, list, default_confdirs};
