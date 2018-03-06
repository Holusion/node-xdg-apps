var EntryList = require("./EntryList")
  , MimeApps = require("./MimeApps")
  , TypeList = require("./MimeType");

function Finder(type){
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
Finder.prototype.find = function (file,callback) {
  var self = this;
  return self.findEntry(file, callback).then((entry)=>{
    if(entry) return entry['Exec'];
    return null;
  });
};

Finder.prototype.findEntry = function(file, callback) {
  return this.types.lookup(file)
  .then((res)=>{
    if(this.apps) { //self.apps does not always exists.
      return this.apps.find(res).then(r => {
        if(r) return r;
        return this.entries.find(res);
      }).then((apps)=>{
        if(!Array.isArray(apps)) return apps; //If apps is not an array, apps is null or we already found the entry
        return Promise.all(apps.map((entry)=> { return this.entries.getEntry(entry) }));
      }).then(function(keys) {
        if (! Array.isArray(keys) || keys.length == 0) return keys;
        return keys.filter(function(key) {return key != null});
      }).then((keys)=>{
        if (! Array.isArray(keys) || keys.length == 0) return keys;
        return keys[0];
      });
    } else {
      return this.entries.find(res);
    }
  }).then(entry => {
    if(entry) return entry[this.entries.type['name']];
    return null; // It's not an error to not find an entry
  })
}

module.exports = Finder;
