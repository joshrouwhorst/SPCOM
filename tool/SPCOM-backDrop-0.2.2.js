var SPCOM_PAGE = function(){
    var version = "0.2.2",
        siteUrl = "https://raw.github.com/joshrouwhorst/SPCOM/master",
        spcomHtml = "<html><head><link href='" + siteUrl + "/css/SPCOM-" + version + ".css' rel='stylesheet' type='text/css' /><script type='text/javascript' src='" + siteUrl + "/jquery/jquery-1.7.2.js'></script><script type='text/javascript' src='" + siteUrl + "/spservices/jquery.SPServices-0.7.1a.js'></script><script type='text/javascript' src='" + siteUrl + "/tool/SPCOM-" + version + ".js'></script></head><body></body></html>",
        rand = parseInt(Math.random() * 1000),
        spcom;
    
    function init(){        
        spcom = window.open("", "SPCOM" + rand, "status=0,location=0,toolbar=0,menubar=0,resizeable=0,width=700,height=550");
        spcom.document.spcom = spcom;
        spcom.document.write(spcomHtml);
    }
    
    return{
        init: init
    }
}();

(function(){
    SPCOM_PAGE.init();
}());
 