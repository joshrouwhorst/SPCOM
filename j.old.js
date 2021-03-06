/*
 SP Commander by Josh Rouwhorst
 Loader File
*/

var SPCOMload = (function(){
    function loadJquery(){
        try{
            if (jQuery){}
        }
        catch(e){
            var jqueryTag = document.createElement("script");    
            jqueryTag.type = "text/javascript";
            document.body.appendChild(jqueryTag);
            jqueryTag.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.js";
        }
        loadSpserv();
    }
    
    function loadSpserv(){
        try{
            if (jQuery){
                if (!$().SPCOMServices){
                    var spservTag = document.createElement("script");
                    spservTag.type = "text/javascript";
                    document.body.appendChild(spservTag);
                    spservTag.src = "http://joshrouwhorst.com/sp/spservices/jquery.SPServices-0.6.2.js";
                }
                loadSpcom();
            }
            else{
                throw "Error";
            }
        }
        catch(e){
            setTimeout(loadSpserv, 100);
        }
    }
    
    function loadSpcom(){
        try{
            if ($().SPCOMServices){
                if (SPCOM === undefined){
                    throw "Error";
                }
                else{
                    SPCOM.init();
                }
            }
            else{
                setTimeout(loadSpcom, 100);
            }
        }
        catch(e){
            var spservTag = document.createElement("script");
            spservTag.type = "text/javascript";
            document.body.appendChild(spservTag);
            spservTag.src = "http://joshrouwhorst.com/sp/tool/SPCOM-0.1.2.js";
        }
    }
    
    return {
        loadJquery: loadJquery
    }
}());

try{
    if (SPCOM !== undefined){
        SPCOM.exit();
    }
    else{
       throw "Error";
    }
}
catch(e){
    SPCOMload.loadJquery();
}
