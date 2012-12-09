debugger;
var jq = document.createElement("script");
jq.type = "text/javascript";
document.body.appendChild(jq);
jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js";
var spserv = document.createElement("script");
spserv.type = "text/javascript";
document.body.appendChild(spserv);
spserv.src = "http://joshrouwhorst.com/sp/spservices/jquery.SPServices-0.6.2.js";
var board = document.createElement("div");
board.style.width = "100%";
board.style.backgroundColor = "#FFF";
board.style.color = "#000";
board.setAttribute("id", "lp");
document.body.appendChild(board);

var tester = (function(){
    function init(){
        var lp = $("#lp");
        $().SPCOMServices.defaults.webUrl = $().SPCOMServices.SPGetCurrentSite();
        $().SPCOMServices({
            operation: "GetList",
            listName: "Test",
            async: true,
            completefunc: function(data, success){
                lp.append(data.responseXML);
            }
        });
    }
    
    return {
        init: init
    }
}());

function loader(){
    try{
        if (jQuery !== undefined && $().SPCOMServices !== undefined){
        tester.init();
        }
        else{
            setTimeout(loader, 100);
        }
    }
    catch(e){
        setTimeout(loader, 100);
    }
}

loader();