/*
 SPCOM by Josh Rouwhorst
 Launcher File
*/

(function(){
    var version = "0.2.2",
        branch = "AngularJS-Updates",
        spcomServerUrl = "https://raw.github.com/joshrouwhorst/SPCOM/" + branch,
        jqueryVersion = "-1.7.2",
        spservicesVersion = "-0.7.1a",
        spcomHtml = "<html><head><link href='" + spcomServerUrl + "/css/SPCOM-" + version + ".css' rel='stylesheet' type='text/css' /><script type='text/javascript' src='" + spcomServerUrl + "/jquery/jquery" + jqueryVersion + ".js'></script><script type='text/javascript' src='" + spcomServerUrl + "/spservices/jquery.SPServices" + spservicesVersion + ".js'></script><script type='text/javascript' src='" + spcomServerUrl + "/tool/SPCOM-" + version + ".js'></script></head><body></body></html>",
        rand = parseInt(Math.random() * 1000, 10),
        spcom;
    
    spcom = window.open("", "SPCOM" + rand, "status=0,location=0,toolbar=0,menubar=0,resizeable=0,width=700,height=550");
    spcom.document.spcom = spcom;
    spcom.document.write(spcomHtml);
})();