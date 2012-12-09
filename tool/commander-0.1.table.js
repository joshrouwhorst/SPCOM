var SPCOM = (function(){
    var HOME_URL = "http://joshrouwhorst.com/sp/";
    var CSS_URL = HOME_URL + "css/spc.css";
    var subsites = new Array(), site;
    
    function makeListMenu(list, name){
        var html = "<div class='SPCOM-menu-container'><table id='SPCOMitem" + removeSpaces(name) + "' class='SPCOM-menu-item'>";
        var items = ""
        $(list).each(function(){
            items += "<tr><td onclick='SPCOM.showListInfo(\"" + this.name + "\")'>" + this.name + "</td><td><a href='" + this.url + "'>&gt;</a></td></tr>";
            if (name === "Lists"){
                makeListInfoDiv(this.name);
            }
        });
        if (items === ""){
            items = "<tr><td colspan='2'>No Items Found</td></tr>";
        }
        html += items + "</table></div>";
        return html;
    }
    
    function showListInfo(id){
        $("#SPCOMlistInfo" + removeSpaces(id)).show();
    }
    
    function hideListInfo(id){
        $("#SPCOMlistInfo" + removeSpaces(id)).hide();
    }
    
    var menuItems = [
        {
            name: "Nav",
            menu: function(){
                return "<div class='SPCOM-menu-container'><table id='SPCOMitemNav' class='SPCOM-menu-item'><tr><td><a href='" + site.allSite + "'>All Site Content</a></td></tr><tr><td><a href='" + site.main + "'>Default</a></table></div>";
            }
        },
        {
            name: "Lists",
            menu: function(){ return makeListMenu(site.lists, "Lists");}
        },
        {
            name: "Document Libraries",
            menu: function(){ return makeListMenu(site.docs, "Document Libraries");}
        },
        {
            name: "Surveys",
            menu: function(){ return makeListMenu(site.docs, "Surveys");}
        },
        {
            name: "Subsites",
            menu: function(){ return makeListMenu(site.docs, "Subsites");}
        }
    ];
    
    function showField(name){
        $("#SPCOMlistInfo" + name + " .SPCOM-listInfo-field-detail").show();
    }
    
    function hideField(name){
        $("#SPCOMlistInfo" + name + " .SPCOM-listInfo-field-detail").hide();
    }
    
    function makeListInfoDiv(name){
        $().SPCOMServices({
            operation: "GetList",
            listName: name,
            async: true,
            completefunc: function(data, status){
                var itemCount, url, desc, fields = new Array();
                $(data.responseXML).find("List").each(function() {
                    itemCount = $(this).attr("ItemCount");
                    url = $(this).attr("DefaultViewUrl");
                    desc = $(this).attr("Description");
                });
                var fieldHtml = "";
                $(data.responseXML).find("Field").each(function(){
                    if ($(this).attr("DisplayName") !== undefined && $(this).attr("StaticName") !== undefined ){
                        fieldHtml += "<table class='SPCOM-listInfo-field' onmouseout='SPCOM.hideField(\"" +
                        removeSpaces(name) + removeSpaces($(this).attr("DisplayName")) + "\")' onmouseover='SPCOM.showField(\"" +
                        removeSpaces(name) + removeSpaces($(this).attr("DisplayName")) + "\")' id='SPCOMlistInfo" +
                        removeSpaces(name) + removeSpaces($(this).attr("DisplayName")) + "'><tr><td>" +
                        $(this).attr("DisplayName") + "</td></tr><tr class='SPCOM-listInfo-field-detail'><td>" +
                        $(this).attr("StaticName") + "</td></tr></table>";
                    }
                });
                
                listRoot = url.substring(0, url.lastIndexOf("/"));
                excelLink = url + "?ShowInGrid=True";
                
                var html = "<div class='SPCOM-listInfo-container SPCOMProp' id='SPCOMlistInfo" + removeSpaces(name) + "'><div class='SPCOM-listInfo'><table><tr><td><a href='" + url +
                "'>" + name + "</a></td><td>" + desc + "</td><td onclick='SPCOM.hideListInfo(\"" + name + "\")'>X</td></tr></table>" +
                "<table><tr><td>Item Count: " + itemCount + "</td><td><a href='" + excelLink + "'>Edit In Datasheet</a></td></tr></table>" +
                "<table><tr><td class='SPCOM-listInfo-commands'><table><tr><td>Delete Items</td></tr><tr><td>Add Item</td></tr><tr><td>Add Demo Data</td></tr></table></td><td class='SPCOM-listInfo-commands'>" + fieldHtml + "</td><td class='SPCOM-listInfo-commands'></td></tr></table>" + 
                "</div></div>";
                $("body").append(html);
            }
        });
    }
    
    function page(){
        return $(location).attr("href");
    }
    
    function exit(){
        $(".SPCOMProp").detach();
        $(".SPCOMProp").die();
        SPCOM = undefined;
    }
    
    function attachMenus(){
        
    }
    
    function removeSpaces(id){
        while(id.indexOf(" ") > -1){
            id = id.replace(" ", "");
        }
        return id;
    }
    
    function showMenu(menuName){
        menuName = removeSpaces(menuName);
        $("#SPCOM-menu-" + menuName).addClass("SPCOM-shaded");
        $("#SPCOMitem" + menuName).parent().show();
    }
    
    function hideMenu(menuName){
        menuName = removeSpaces(menuName);
        $("#SPCOM-menu-" + menuName).removeClass("SPCOM-shaded");
        $("#SPCOMitem" + menuName).parent().hide();
    }
    
    function loadStyle(){
        $("body").append("<link type='text/css' rel='stylesheet' href='" + CSS_URL + "' />");
    }
    
    function buildBar(){
        $(menuItems).each(function(){
            $("#SPCOM-menu-row").append("<td class='SPCOM-menu-td' id='SPCOM-menu-" + removeSpaces(this.name) + "' onmouseout='SPCOM.hideMenu(\"" + this.name + "\")' onmouseover='SPCOM.showMenu(\"" + this.name + "\")'><div>" + this.name + "</div>" + this.menu() + "</td>");
        });
        $(".SPCOM-menu-item tr").hover(function(){$(this).addClass("SPCOM-shaded");}, function(){$(this).removeClass("SPCOM-shaded");});
    }
    
    function makeListObj(obj){
        return{
            name: $(obj).attr("Title"),
            itemCount: $(obj).attr("ItemCount"),
            url: $(obj).attr("DefaultViewUrl")
        }
    }
    
    function setSite(){
        site = (function(){
            var URL_REGEX = "http://[a-zA-Z0-9]*.*(.com|.net|.org|.us)";
            var PATH_REGEX = "(?<=.com|.net|.org|.us)[^\?]([\/a-zA-Z0-9_%()]*)*\.[a-zA-Z0-9]*";
            var ARGS_REGEX = "\?[a-zA-Z0-9_\=%\-#]*";
            
            var main, path, folders, rootPath, args, allSite, url = window.location, lists = new Array(), docs = new Array(), pics = new Array(), boards = new Array(), surveys = new Array();
            $().SPCOMServices({
                operation: "GetListCollection",
                async: false,
                completefunc: function (data, status) {
                    $(data.responseXML).find("List").each(function() {
                        switch ($(this).attr("ServerTemplate")){
                            case ("100"):
                                lists.push(makeListObj(this));
                                break;
                            case ("101"):
                                docs.push(makeListObj(this));
                                break;
                            case ("109"):
                                pics.push(makeListObj(this));
                                break;
                            case ("108"):
                                boards.push(makeListObj(this));
                                break;
                            case ("102"):
                                surveys.push(makeListObj(this));
                                break;
                        }
                    });
                }
            });
            
            rootPath = $().SPCOMServices.SPGetCurrentSite();
            
            allSite = rootPath + "/_layouts/viewlsts.aspx";
            
            main = rootPath + "/default.aspx";
            
            return{
                lists: lists,
                rootPath: rootPath,
                allSite: allSite,
                main: main
            }
        }());
    }
    
    function init(){
        loadStyle();
        $("body").prepend("<div id='SPCommander' class='SPCOMProp'><div><table id='SPCOM-menu'>" +
        "<tr id='SPCOM-menu-row'><td class='SPCOM-menu-td'><img src='http://joshrouwhorst.com/sp/imgs/spcom.png' /></td></tr></table>" +
        "</div>" +
        "<script type='text/javascript'>setTimeout(SPCOM.buildBar, 500);</script></div>");
        $().SPCOMServices.defaults.webUrl = $().SPCOMServices.SPGetCurrentSite();
        setSite();
        attachMenus();
    }
    
    return{
        showField: showField,
        hideField: hideField,
        showListInfo: showListInfo,
        hideListInfo: hideListInfo,
        buildBar: buildBar,
        hideMenu: hideMenu,
        showMenu: showMenu,
        exit: exit,
        init: init
    }
}());

function SPCOM_JQUERY_WAIT(){
    try{
        if (jQuery === undefined || $().SPCOMServices === undefined){
            setTimeout(SPCOM_JQUERY_WAIT, 100);
        }
        else{
            setTimeout(SPCOM.init, 1);
        }
    }
    catch(e){
        setTimeout(SPCOM_JQUERY_WAIT, 100);
    }
}

SPCOM_JQUERY_WAIT();
