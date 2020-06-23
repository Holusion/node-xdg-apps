'use strict';
const { PerformanceObserver, performance } = require('perf_hooks');
const Finder =  require("./lib");
const EntryList = require("./lib/EntryList")

const {find} = require("./lib/MimeApps")
const {lookup} = require("./lib/MimeType");

const delay = (d)=> new Promise((r)=> setTimeout(r, d));

(async ()=>{

  const obs = new PerformanceObserver((items) => {
    console.log(items.getEntries()[0].duration);
    performance.clearMarks();
  });
  obs.observe({ entryTypes: ['measure'] });

  const f = new Finder();
  await delay(300);
  performance.mark("Finder");
  await f.find("foo.mp4");
  performance.mark("end_Finder");
  performance.measure("Finder.find()", "Finder", "end_Finder");
  performance.mark("find");
  await find("foo.mp4");
  performance.mark("end_find");
  performance.measure("find() time", "find", "end_find");
  performance.mark("lookup");
  await lookup("video/mp4");
  performance.mark("end_lookup");
  performance.measure("lookup() time", "lookup", "end_lookup");

  const el = new EntryList();
  performance.mark("Entrylist");
  await el.find("video/mp4");
  performance.mark("end_Entrylist");
  performance.measure("Entrylist() time", "Entrylist", "end_Entrylist");

})()