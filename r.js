/*
 SPCOM by Josh Rouwhorst
 Loader File
*/

(function(){
    var branch = "AngularJS-Updates",
        mainUrl = "https://raw.github.com/joshrouwhorst/SPCOM/" + branch,
        version = "0.2.2",
        spservTag = document.createElement("script");
    
    spservTag.type = "text/javascript";
    document.body.appendChild(spservTag);
    spservTag.src = mainUrl + "/tool/SPCOM-backDrop-" + version + ".js";
    
    alert("r.js");
}());
