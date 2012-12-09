(function(){
    var version = "0.2.1",
        spcomHtml = "<html><head><link href='http://joshrouwhorst.com/sp/css/SPCOM-" + version + ".css' rel='stylesheet' type='text/css' /><script type='text/javascript' src='http://joshrouwhorst.com/sp/jquery/jquery-1.7.2.js'></script><script type='text/javascript' src='http://joshrouwhorst.com/sp/spservices/jquery.SPServices-0.7.1a.js'></script><script type='text/javascript' src='http://joshrouwhorst.com/sp/tool/SPCOM-" + version + ".js'></script></head><body></body></html>";
    if (document.spcom === undefined){
        var spcom = window.open("", "SPCOM", "status=0,location=0,toolbar=0,menubar=0,resizeable=0,width=700,height=550");
        spcom.document.spcom = spcom;
        spcom.document.write(spcomHtml);
    }
    else{
        document.SPCOM_SAT_DISH = (function(){
            var found = false;
            
            var reciever = function(){
                found = true;
            }
            
            var check = function(){
                if (!found){
                    document.spcom.document.spcom = document.spcom;
                    document.spcom.document.write(spcomHtml);
                }
                else{
                    setTimeout(check, 2000);
                    found = false;
                }
            }
            
            setTimeout(check, 2000);
            
            return{
                reciever: reciever
            }
        })();
    }
}());
 