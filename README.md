# node-xdg-apps

[![Build Status](https://travis-ci.org/Holusion/node-xdg-apps.svg?branch=master)](https://travis-ci.org/Holusion/node-xdg-apps) [![Test Coverage](https://codeclimate.com/github/Holusion/node-xdg-apps/badges/coverage.svg)](https://codeclimate.com/github/Holusion/node-xdg-apps/coverage)

Find the best app to open a file / thumbnailize it according to XDG Specifications

    npm install xdg-apps

## Usage

### Find the right app to open a file
    var Finder = require("xdg-apps");
    var finder = new Finder();
    finder.find("/path/to/my/file",function(err,launcher){
      //DO SOMETHING
    });
    //OR
      finder.find("/path/to/my/file").then(function(launcher){
        //DO SOMETHING
      }).catch(function(e){
        //ERROR
      });

If you want to really open the file afterward, take a look at [desktop-launch](https://github.com/Holusion/node-desktop-launch).

### Find a list of system apps

    var Finder = require("xdg-apps");
    var finder = new Finder();    
    finder.apps.list().then(function(apps){
      //An array of parsed desktop entries
    }).catch(function(e){
        //Handle errors
    })


## Options

finder takes only one parameter : the type of apps we want to search for. Possible values :

- desktop for [desktop entries](http://standards.freedesktop.org/desktop-entry-spec/latest/) **(default)**
- thumbnailer  for [thumbnails Specification](http://specifications.freedesktop.org/thumbnail-spec/thumbnail-spec-latest.html)

Other values wont throw an error but will produce undefined results.
