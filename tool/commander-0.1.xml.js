var SPCOM = (function(){
    var HOME_URL = "http://joshrouwhorst.com/sp/";
    var CSS_URL = HOME_URL + "css/spc.xml.css";
    var subsites = new Array(), site;
    
    function makeListMenu(list, name){
        debugger;
        var html = "<SPCOMtable id='SPCOMitem" + removeSpaces(name) + "' class='SPCOM-menu-item'>";
        var items = ""
        $(list).each(function(){
            items += "<SPCOMtr><SPCOMtd onclick='SPCOM.showListInfo(\"" + this.name + "\")'>" + this.name + "</td><SPCOMtd><SPCOMa href='" + this.url + "'>&gt;</a></td></tr>";
            if (name === "Lists"){
                makeListInfoDiv(this.name);
            }
        });
        if (items === ""){
            items = "<SPCOMtr><SPCOMtd colspan='2'>No Items Found</td></tr>";
        }
        html += items + "</table>";
        return html;
    }
    
    function showListInfo(id){
        $("#SPCOMlistInfo" + id).show();
    }
    
    function hideListInfo(id){
        $("#SPCOMlistInfo" + id).hide();
    }
    
    var menuItems = [
        {
            name: "Nav",
            menu: function(){
                return "<SPCOMtable id='SPCOMitemNav' class='SPCOM-menu-item'><SPCOMtr><SPCOMtd><SPCOMa href='" + site.allSite + "'>All Site Content</a></td></tr><SPCOMtr><SPCOMtd><SPCOMa href='" + site.main + "'>Default</a></table>";
            }
        },
        {
            name: "Lists",
            menu: function(){
                return makeListMenu(site.lists, "Lists");
            }
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
    
    function makeListInfoDiv(name){
        //URL to edit in Excel
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
                
                $(data.responseXML).find("Field").each(function(){
                    fields.push({
                        name: $(this).attr("DisplayName"),
                        id: $(this).attr("ColName"),
                        type: $(this).attr("Type")
                    });
                });
                
                listRoot = url.substring(0, url.lastIndexOf("/"));
                excelLink = url + "?ShowInGrid=True";
                var html = "<SPCOMdiv class='SPCOM-listInfo' id='SPCOMlistInfo" + name + "'><SPCOMtable><SPCOMtr><SPCOMtd><SPCOMa href='" + url +
                "'>" + name + "</a></td><SPCOMtd>Item Count: " + itemCount + "</td></tr></table>" +
                "<SPCOMtable><SPCOMtr><SPCOMtd><SPCOMa href='" + excelLink + "'>Edit In Datasheet</a></td></tr></table>" + 
                "</div>";
                $("body").append(html);
            }
        });
    }
    
    function page(){
        return $(location).attr("href");
    }
    
    function exit(){
        $("#SPCommander").detach();
        $("#SPCommander").die();
        SPCOM = undefined;
    }
    
    function attachMenus(){
        
    }
    
    function removeSpaces(id){
        return id.replace(" ", "");
    }
    
    function showMenu(menuName){
        menuName = removeSpaces(menuName);
        $("#SPCOM-menu-" + menuName).addClass("SPCOM-shaded");
        $("#SPCOMitem" + menuName).show();
    }
    
    function hideMenu(menuName){
        menuName = removeSpaces(menuName);
        $("#SPCOM-menu-" + menuName).removeClass("SPCOM-shaded");
        $("#SPCOMitem" + menuName).hide();
    }
    
    function loadStyle(){
        $("body").append("<link type='text/css' rel='stylesheet' href='" + CSS_URL + "' />");
    }
    
    function buildBar(){
        $(menuItems).each(function(){
            $("#SPCOM-menu-row").append("<SPCOMtd class='SPCOM-menu-td' id='SPCOM-menu-" + removeSpaces(this.name) + "' onmouseout='SPCOM.hideMenu(\"" + this.name + "\")' onmouseover='SPCOM.showMenu(\"" + this.name + "\")'><SPCOMdiv>" + this.name + "</div>" + this.menu() + "</td>");
        });
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
        $("body").prepend("<SPCOMdiv id='SPCommander'><SPCOMdiv><SPCOMtable id='SPCOM-menu'>" +
        "<SPCOMtr id='SPCOM-menu-row'><SPCOMtd class='SPCOM-menu-td'>SPCommander</td></tr></table>" +
        "</div>" +
        "<script type='text/javascript'>setTimeout(SPCOM.buildBar, 500);</script></div>");
        $().SPCOMServices.defaults.webUrl = $().SPCOMServices.SPGetCurrentSite();
        setSite();
        attachMenus();
    }
    
    return{
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
