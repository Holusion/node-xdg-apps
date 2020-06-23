'use strict';
const xdg = require("xdg-basedir")
const path = require("path");
/**
 * http://standards.freedesktop.org/desktop-entry-spec/latest/
 */
var readdir = require("./utils/readXdgDir")
  , dedupe = require("./utils/xdgDedupe");

var types = require("./types.json");


class EntryList{
  constructor(type="desktop", dirs){
    if(!types[type]){
      console.log("invalid type : %s. See %s/types.json for a list of supported types",type,__dirname);
    }
    type = types[type];
    this.type = type;
    this.dirs = Array.isArray(dirs)? dirs : (xdg["dataDirs"]).map((dir)=>path.join(dir, this.type["folder"]));
    this.refresh();
  }
  async refresh(){
    this._entries_p = Promise.all(this.dirs.map((dir)=>{
      return readdir(dir,"."+this.type["ext"]+"$");
    }))
    .then((entries) => {
      return entries.reduce(dedupe,{});
    }).then((entries) => {
      Object.keys(entries).forEach((key)=>{
        if(!entries[key][this.type["name"]]){
          delete entries[key];
        }
      });
      return entries;
    });

    return await this._entries_p.then((entries)=>{
      this._refreshed = Date.now();
      return entries
    })
  }

  async getEntries(){
    return await this._entries_p;
  }

  getExecKey(desktop_id){
    var block = this.type["name"];
    return this.getEntries().then(function(entries){
      if(entries[desktop_id]){ //"Desktop Entry" key presence have already been checked in constructor
        return entries[desktop_id][block]["Exec"];
      }else{
        return null;
      }
    });
  }

  getEntry(desktop_id){
    return this.getEntries().then((entries)=>{
      if(!entries[desktop_id]) return null;
      const res = {};
      res[this.type["name"]] = Object.assign({"ID": desktop_id}, entries[desktop_id][this.type["name"]]);
      return res;
    });
  }

  find(mime){
    var apps = {},block = this.type["name"];
    return this.getEntries().then((entries) => {
      Object.keys(entries).forEach((key)=>{
        if(entries[key][block]["MimeType"] && entries[key][block]["MimeType"].indexOf(mime) != -1){
          apps[key] = entries[key][block];
        }
      });
      const keys = Object.keys(apps);
      if(keys.length ==0){
        return null;
      }else{
        const id = keys[0];
        const res = {};
        res[block] = Object.assign({"ID": id}, entries[id][block]);// We keep the id of this entries to keep the name of the service (important for dbus)
        return res;
      }
    });
  }
}



module.exports = EntryList;
