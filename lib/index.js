'use strict';
const EntryList = require("./EntryList")
  , MimeApps = require("./MimeApps")
  , TypeList = require("./MimeType");

const {URL} = require("url");

class Finder{
  constructor(type){
    type = type || "desktop";
    //Early instanciation because we can asynchronously fetch every desktop file we will need later.
    //Promises allow us to start querying immediately though.
    this.entries = new EntryList(type);
    if(type === "desktop"){
      this.apps = new MimeApps(type);
    }
    this.types = new TypeList();
  }
  /**
   * Open a file or an array of file. Don't forget to catch errors using promise syntax :
   * 		launcher.start("pat/to/file").catch(function(e){//catch errors});
   *
   * @param  {string|Array} file file to open or array of file to open
   * @return {child_process}         reference to the created child process
   */
  find (file,callback) {
    var self = this;
    return self.findEntry(file, callback).then((entry)=>{
      if(entry) return entry['Exec'];
      return null;
    });
  };

  async findEntry (file, callback) {
    const uri = new URL(file, "file:///");
    const mime_type = ((uri.protocol && uri.protocol != "file:")?`x-scheme-handler/${uri.protocol.slice(0,-1)}`:  await this.types.lookup(file));
    const possible_entries = [];
    if (this.apps) { // this.apps does not always exists.
      const default_apps = await this.apps.find(mime_type);
      for (const app of default_apps){
        possible_entries.push(await this.entries.getEntry(app))
      }
    }
    const default_entry = await this.entries.find(mime_type);
    if(default_entry){
      possible_entries.push(default_entry);
    }
    
    if(possible_entries.length == 0){
      console.log("No possible entries for", file, mime_type, await this.entries.find(mime_type))
      return null;
    }
    //const parsed_entries = await Promise.all(possible_entries.map((entry)=> { return this.entries.getEntry(entry) }));
    const valid_entries = possible_entries.filter(e => e && e[this.entries.type["name"]]);
    if(valid_entries.length == 0){

      console.log("No valid entries", possible_entries)
      return null;
    }
    console.log("Valid entry : ", valid_entries[0][this.entries.type["name"]])
    return valid_entries[0][this.entries.type["name"]];
  }
}



module.exports = Finder;
