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
            jqueryTag.src = "http://joshrouwhorst.com/sp/jquery/jquery-1.6.4.js";
            //jqueryTag.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.js";
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
            //var spservTag = document.createElement("script");
            //spservTag.type = "text/javascript";
            //document.body.appendChild(spservTag);
            //spservTag.src = "http://joshrouwhorst.com/sp/tool/SPCOM-0.1.3.js";
            var spWin = window.open("", "SPCOM", "resizeable=no, scrollbars=no, status=no, height=420, width=420");
            spWin.document.write("<html><head><link src='http://joshrouwhorst.com/sp/css/SPCOM-0.1.3.css' rel='stylesheet' /><script type='text/javascript' href='http://joshrouwhorst.com/sp/jquery/jquery-1.6.4.js'></script><script type='text/javascript' href='http://joshrouwhorst.com/sp/tool/SPCOM-0.1.3.js'></script><script type='text/javascript'>debugger;</script></head><body><div id='leftColumnWrapper'><div id='leftColumn'></div></div><div id='midColumnWrapper'><div id='midColumn'></div></div><div id='rightColumnWrapper'><div id='rightColumn'></div></div></body></html>");
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
