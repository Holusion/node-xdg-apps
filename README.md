# node-xdg-apps

Find the best app to open a file / thumbnailize it according to XDG Specifications

    npm install xdg-apps

## Usage

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

## Options

finder takes only one parameter : the type of apps we want to search for. Possible values :

- desktop for [desktop entries](http://standards.freedesktop.org/desktop-entry-spec/latest/) **(default)**
- thumbnailer  for [thumbnails Specification](http://specifications.freedesktop.org/thumbnail-spec/thumbnail-spec-latest.html)

Other values wont throw an error but will produce undefined results.
