/*
 SPCOM by Josh Rouwhorst
 Loader File
*/

var SPCOMload = (function(){
    var branch = "angularjs",
        mainUrl = "https://raw.github.com/joshrouwhorst/spcom/" + branch,
        version = "0.2.2";
    
    var spservTag = document.createElement("script");
    spservTag.type = "text/javascript";
    document.body.appendChild(spservTag);
    spservTag.src = mainUrl + "/tool/SPCOM-backDrop-" + version + ".js";
    
}());
