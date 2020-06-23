'use strict';
const EntryList = require("./EntryList")
const {find} = require("./MimeApps")
const {lookup} = require("./MimeType");

const {URL} = require("url");

class Finder{
  constructor(type="desktop"){
    this.type = type;
    this.entries = new EntryList(type);

  }
  /**
   * Open a file or an array of file. Don't forget to catch errors using promise syntax :
   * 		launcher.start("pat/to/file").catch(function(e){//catch errors});
   *
   * @param  {string|Array} file file to open or array of file to open
   * @return {child_process}         reference to the created child process
   */
  find (file) {
    var self = this;
    return self.findEntry(file).then((entry)=>{
      if(entry) return entry['Exec'];
      return null;
    });
  };

  async findEntry (file) {
    //Ensure entries are fresh
    this.entries.refresh();
    const uri = new URL(file, "file:///");
    const mime_type = await ((uri.protocol && uri.protocol != "file:")? Promise.resolve(`x-scheme-handler/${uri.protocol.slice(0,-1)}`): lookup(file));
    const possible_entries = [];
    if(this.type == "desktop"){
      const default_apps = await find(mime_type);
      const default_entries = await Promise.all(default_apps.map(app=>this.entries.getEntry(app)));
      possible_entries.push(...default_entries);
    }
    const default_entry = await this.entries.find(mime_type);
    if(default_entry){
      possible_entries.push(default_entry);
    }
    if(possible_entries.length == 0){
      //console.log("No possible entries for", file, mime_type, await this.entries.find(mime_type))
      return null;
    }
    //const parsed_entries = await Promise.all(possible_entries.map((entry)=> { return this.entries.getEntry(entry) }));
    const valid_entries = possible_entries.filter(e => e && e[this.entries.type["name"]]);
    if(valid_entries.length == 0){
      //console.log("No valid entries", possible_entries)
      return null;
    }
    //console.log("Valid entry : ", valid_entries[0][this.entries.type["name"]])
    return valid_entries[0][this.entries.type["name"]];
  }
}



module.exports = Finder;
