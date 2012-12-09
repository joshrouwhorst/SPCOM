var SPCOM;

function SPCOM_JQUERY_WAIT(){
    try{
        if (jQuery === undefined || $().SPCOMServices === undefined){
            setTimeout(SPCOM_JQUERY_WAIT, 100);
        }
        else{
            setTimeout(function(){
                SPCOM = (function(){
                    var HOME_URL = "http://joshrouwhorst.com/sp/";
                    var CSS_URL = HOME_URL + "css/spc.css";
                    var subsites = new Array();
                    var rootPath = $().SPCOMServices.SPGetCurrentSite();
                    
                    function safeWord(word){
                        if (word !== undefined){
                            return word.replace(/[^a-zA-Z0-9]+/g,"");
                        }
                        else{
                            return "";
                        }
                    }
                    
                    function shade(){
                        $(event.srcElement).addClass("SPCOM-shaded");
                    }
                    
                    function unshade(){
                        $(event.srcElement).removeClass("SPCOM-shaded");
                    }
                    
                    function shadeListMenuSelect(name, id){
                        menuName = safeName(menuName);
                        $("#SPCOM-menu-" + menuName).addClass("SPCOM-shaded");
                        $("#SPCOMitem" + menuName).parent().show();
                    }
                    
                    function unshadeListMenuSelect(name, id){
                        
                    }
                    
                    var info = (function(){
                        function build(){
                            var html = "<div class='SPCOM-listInfo-container SPCOMProp' id='SPCOMlistInfo'>" +
                                    "<div class='SPCOM-listInfo'>" +
                                        "<table class='SPCOM-listInfo-topTable'>" +
                                            "<tr>" +
                                                "<td class='SPCOM-listInfo-title'>" +
                                                "</td>" +
                                                "<td class='SPCOM-listInfo-desc'></td>" +
                                                "<td onclick='SPCOM.info.hide()' class='SPCOM-listInfo-exit'>X</td>" +
                                            "</tr>" +
                                        "</table>" +
                                        "<table>" +
                                            "<tr>" +
                                                "<td class='SPCOM-listInfo-sub1'></td>" +
                                                "<td class='SPCOM-listInfo-sub2'></td>" +
                                            "</tr>" +
                                        "</table>" +
                                        "<table class='SPCOM-listInfo-catTable'>" +
                                            "<tr valign='top'>" +
                                                "<td><div class='SPCOM-listInfo-menu1'></div></td>" +
                                                "<td><div class='SPCOM-listInfo-menu2'></div></td>" +
                                                "<td><div class='SPCOM-listInfo-menu3'></div></td>" +
                                            "</tr>" +
                                        "</table>" +
                                    "</div></div>"
                            $("body").append(html);
                        }
                        
                        function hide(){
                            $("#SPCOMlistInfo").hide();
                        }
                        
                        function show(){
                            $("#SPCOMlistInfo").show();
                        }
                        
                        function set(obj, resetRest){
                            if (obj.title !== undefined){
                                $("#SPCOMlistInfo .SPCOM-listInfo-title").html(obj.title);
                            }
                            else if (resetRest){
                                $("#SPCOMlistInfo .SPCOM-listInfo-title").html("");
                            }
                            
                            if (obj.desc !== undefined){
                                $("#SPCOMlistInfo .SPCOM-listInfo-desc").html(obj.desc);
                            }
                            else if (resetRest){
                                $("#SPCOMlistInfo .SPCOM-listInfo-desc").html("");
                            }
                            
                            if (obj.sub1 !== undefined){
                                $("#SPCOMlistInfo .SPCOM-listInfo-sub1").html(obj.sub1);
                            }
                            else if (resetRest){
                                $("#SPCOMlistInfo .SPCOM-listInfo-sub1").html("");
                            }
                            
                            if (obj.sub2 !== undefined){
                                $("#SPCOMlistInfo .SPCOM-listInfo-sub2").html(obj.sub2);
                            }
                            else if (resetRest){
                                $("#SPCOMlistInfo .SPCOM-listInfo-sub2").html("");
                            }
                            
                            if (obj.menu1 !== undefined){
                                $("#SPCOMlistInfo .SPCOM-listInfo-menu1").html(obj.menu1);
                            }
                            else if (resetRest){
                                $("#SPCOMlistInfo .SPCOM-listInfo-menu1").html("");
                            }
                            
                            if (obj.menu2 !== undefined){
                                $("#SPCOMlistInfo .SPCOM-listInfo-menu2").html(obj.menu2);
                            }
                            else if (resetRest){
                                $("#SPCOMlistInfo .SPCOM-listInfo-menu2").html("");
                            }
                            
                            if (obj.menu3 !== undefined){
                                $("#SPCOMlistInfo .SPCOM-listInfo-menu3").html(obj.menu3);
                            }
                            else if (resetRest){
                                $("#SPCOMlistInfo .SPCOM-listInfo-menu3").html("");
                            }
                        }
                        
                        function get(item){
                            switch (item){
                                case "title":
                                    return $("#SPCOMlistInfo .SPCOM-listInfo-title").html();
                                case "desc":
                                    return $("#SPCOMlistInfo .SPCOM-listInfo-desc").html();
                                case "sub1":
                                    return $("#SPCOMlistInfo .SPCOM-listInfo-sub1").html();
                                case "sub2":
                                    return $("#SPCOMlistInfo .SPCOM-listInfo-sub2").html();
                                case "menu1":
                                    return $("#SPCOMlistInfo .SPCOM-listInfo-menu1").html();
                                case "menu2":
                                    return $("#SPCOMlistInfo .SPCOM-listInfo-menu2").html();
                                case "menu3":
                                    return $("#SPCOMlistInfo .SPCOM-listInfo-menu3").html();
                                default:
                                    return false;
                            }
                        }
                        
                        return {
                            show: show,
                            hide: hide,
                            set: set,
                            build: build
                        }
                    }());
                    
                    var List = function(listObj){
                        this.generateDeleteHtml = function(){
                            var options = "";
                            
                            for (var id in parList.fields){
                                if (id !== undefined && id !== ""){
                                    options += "<option value='" + id + "'>" + parList.fields[id].displayName + "</option>";
                                }
                            }
                            
                            return "<table><tr><td class='SPCOM-listInfo-headers'>Delete Items</td></tr>" +
                                    "<tr><td><select class='SPCOM-deleteItem-field'>" + options + "</select></td></tr>" +
                                    "<tr><td><select class='SPCOM-deleteItem-operator'>" +
                                    "<option>Is Equal To</option>" +
                                    "<option>Is Not Equal To</option>" +
                                    "<option>Is Greater Than</option>" +
                                    "<option>Is Less Than</option>" +
                                    "<option>Is Greater Than or Equal To</option>" +
                                    "<option>Is Less Than or Equal To</option>" +
                                    "<option>Begins With</option>" +
                                    "<option>Contains</option>" +
                                    "</select></td></tr>" +
                                    "<tr><td><input type='text' class='SPCOM-deleteItem-value' /></td></tr></table>";
                        }
                        
                        this.addDelStatement = function (){
                            info.set({
                                menu3: info.get("menu3") + parList.generateDeleteHtml()
                            });
                        }
                        
                        this.selectDelete = function (){
                            var html = parList.generateDeleteHtml();
                            html += "<table><tr><td onclick='SPCOM.site.lists[\"" + parList.safeId + "\"].addDelStatement()'>Add Statement</td></tr></table>"
                            info.set({
                                menu3: html
                            });
                        }
                        
                        var Field = function(fieldObj){
                            this.selectField = function(){
                                var html = "<table><tr><td class='SPCOM-listInfo-headers'>Names</td></tr>" +
                                    "<tr><td><input type='text' value='ows_" + parField.staticName + "' /></td></tr>" +
                                    "<tr><td><input type='text' value='" + removeSpaces(parField.displayName) + "' /></td></tr></table>";
                                info.set({
                                   menu3: html 
                                });
                            }
                            
                            this.displayName = "";
                            this.staticName = "";
                            
                            if ($(fieldObj).attr("DisplayName") !== undefined){
                                this.displayName = $(fieldObj).attr("DisplayName");
                            }
                            if ($(fieldObj).attr("StaticName") !== undefined){
                                this.staticName = $(fieldObj).attr("StaticName");
                            }
                            this.readOnly = $(fieldObj).attr("ReadOnly") === "TRUE" ? true : false;
                            this.hidden = $(fieldObj).attr("Hidden") === "TRUE" ? true : false;
                            this.id = $(fieldObj).attr("ID");
                            this.safeId = safeWord(this.id);
                            
                            this.html = "<tr onmouseover='SPCOM.shade()' onmouseout='SPCOM.unshade()' onclick='SPCOM.site.lists[\"" + parList.safeId + "\"].fields[\"" + safeWord(this.id) + "\"].selectField()'><td>" +
                                    this.displayName + "</td></tr>";
                            var parField = this;
                            return this;
                        }
                        
                        this.moreInfo = function(){
                            info.set({
                               title: "<a href='" + parList.settings + "'>" + parList.title + "</a>",
                               desc: parList.desc,
                               sub1: "Item Count: " + parList.itemCount,
                               sub2: "<a href='" + parList.excel + "'>Edit In Datasheet</a>",
                               menu1: "<table>" +
                                        "<tr>" +
                                            "<td onclick='SPCOM.site.lists[\"" + parList.safeId + "\"].selectCommands()' onmouseover='SPCOM.shade()' onmouseout='SPCOM.unshade()'>" +
                                                "Commands" +
                                            "</td>" +
                                        "</tr>" +
                                        "<tr>" +
                                            "<td onclick='SPCOM.site.lists[\"" + parList.safeId + "\"].selectFields()' onmouseover='SPCOM.shade()' onmouseout='SPCOM.unshade()'>Fields</td>" +
                                        "</tr>" +
                                        "<tr>" +
                                            "<td onclick='SPCOM.site.lists[\"" + parList.safeId + "\"].selectViews()' onmouseover='SPCOM.shade()' onmouseout='SPCOM.unshade()'>Views</td>" +
                                        "</tr>" +
                                    "</table>"
                            }, true);
                            parList.selectCommands();
                            info.show();
                        }
                        
                        this.selectCommands = function(){
                            info.set({
                                menu2:
                                        "<table>" +
                                            "<tr>" + 
                                                "<td onclick='SPCOM.site.lists[\"" + parList.safeId + "\"].selectDelete()' onmouseover='SPCOM.shade()' onmouseout='SPCOM.unshade()'>" +
                                                    "Delete Items" +
                                                "</td>" +
                                            "</tr>" +
                                            "<tr>" +
                                                "<td onmouseover='SPCOM.shade()' onmouseout='SPCOM.unshade()'>" +
                                                    "Add Item" +
                                                "</td>" +
                                            "</tr>" +
                                            "<tr>" +
                                                "<td onmouseover='SPCOM.shade()' onmouseout='SPCOM.unshade()'>" +
                                                    "Add Demo Data" +
                                                "</td>" +
                                            "</tr>" +
                                        "</table>",
                                menu3: ""
                            });
                        }
                        
                        this.selectFields = function(){
                            var fieldHtml = "";
                            for (var id in parList.fields){
                                if (id !== undefined && id !== ""){
                                    if (parList.fields[id].displayName !== "" && parList.fields[id].staticName !== "" && !parList.fields[id].readOnly && !parList.fields[id].hidden){
                                        fieldHtml += parList.fields[id].html;
                                    }
                                }
                            }
                            
                            info.set({
                               menu2: "<table>" + fieldHtml + "</table>",
                               menu3: ""
                            });
                        }
                        
                        this.selectViews = function(){
                            
                        }
                        
                        function addToNav(){
                            if (parList.type === "Document Libraries"){
                                $().SPCOMServices({
                                    operation: "GetListItems",
                                    listName: parList.title,
                                    CAMLQuery: "<Query><Where><Neq><FieldRef Name='Title' /><Value Type='Text'></Value></Neq></Where></Query>",
                                    CAMLQueryOptions: "<QueryOptions><ViewAttributes Scope='Recursive' /></QueryOptions>",
                                    async: true,
                                    completefunc: function(data, success){
                                        //debugger;
                                        $(data.responseXML).find("[nodeName='z:row']").each(function(){
                                            if ($(this).attr("ows_LinkFilename").indexOf(".aspx") > -1){
                                                $("#SPCOMitemNav").append("<tr><td onmouseover='SPCOM.shade()' onmouseout='SPCOM.unshade()' onclick='window.location=\"/" + $(this).attr("ows_FileRef").split(";#")[1] + "\"'>" + $(this).attr("ows_LinkFilename") + "</td></tr>");
                                            }
                                        });
                                    }
                                });
                            }
                        }
                        
                        function getFields(){
                            $().SPCOMServices({
                                operation: "GetList",
                                listName: parList.title,
                                async: true,
                                completefunc: function(data, status){
                                    $(data.responseXML).find("Field").each(function(){
                                        if (safeWord($(this).attr("ID")) !== "" && safeWord($(this).attr("ID")) !== undefined){
                                            parList.fields[safeWord($(this).attr("ID"))] = new Field(this);
                                        }
                                    });
                                }
                            });
                        }
                        
                        this.type = "";
                        
                        switch ($(listObj).attr("ServerTemplate")){
                            case ("100"):
                                this.type = "Lists";
                                break;
                            case ("101"):
                                this.type = "Document Libraries";
                                break;
                            case ("109"):
                                this.type = "Picture Libraries";
                                break;
                            case ("108"):
                                this.type = "Discussion Boards";
                                break;
                            case ("102"):
                                this.type = "Surveys";
                                break;
                        }
                        
                        this.title = $(listObj).attr("Title");
                        this.desc = $(listObj).attr("Description");
                        this.itemCount = $(listObj).attr("ItemCount");
                        this.url = $(listObj).attr("DefaultViewUrl");
                        this.id = $(listObj).attr("ID");
                        this.safeId = safeWord(this.id);
                        this.name = $(listObj).attr("Name");
                        this.excel = this.url + "?ShowInGrid=True&View=";
                        this.fields = new Array();
                        this.settings = rootPath + "/_layouts/listedit.aspx?List=" + encodeURIComponent(this.name);
                        
                        var parList = this;
                        getFields();
                        addToNav();
                        return this;
                    }
                    
                    function safeName(name){
                        return name.replace(/[^a-zA-Z0-9]+/g,"");
                    }
                    
                    function makeListMenu(name){
                        if (name != "Nav"){
                            var list = new Array();
                            for (var id in site.lists){
                                if (site.lists[id].type == name){
                                    list.push(site.lists[id]);
                                }
                            }
                            var html = "<div class='SPCOM-menu-container'><table id='SPCOMitem" + safeWord(name) + "' class='SPCOM-menu-item'>";
                            var items = ""
                            $(list).each(function(){
                                items += "<tr><td onclick='SPCOM.site.lists[\"" + safeWord(this.id) + "\"].moreInfo()'>" + this.title + "</td><td onclick='window.location=\"" + this.url + "\";'>&gt;</td></tr>";
                            });
                            if (items === ""){
                                items = "<tr><td colspan='2'>No Items Found</td></tr>";
                            }
                            html += items + "</table></div>";
                            return html;
                        }
                        else{
                            return "<div class='SPCOM-menu-container'><table id='SPCOMitemNav' class='SPCOM-menu-item'><tr><td><a href='" +
                                site.allSite + "'>All Site Content</a></td></tr><tr><td><a href='" + site.main + "'>Default</a></table></div>";
                        }
                    }
                    
                    function showListInfo(id){
                        $("#SPCOMlistInfo" + id).show();
                    }
                    
                    function hideListInfo(id){
                        $("#SPCOMlistInfo" + id).hide();
                    }
                    
                    var menuItems = ["Nav", "Lists", "Document Libraries", "Surveys", "Subsites"];
                    
                    function showField(name){
                        $("#SPCOMlistInfo" + name + " .SPCOM-listInfo-field-detail").show();
                    }
                    
                    function hideField(name){
                        $("#SPCOMlistInfo" + name + " .SPCOM-listInfo-field-detail").hide();
                    }
                    
                    function page(){
                        return $(location).attr("href");
                    }
                    
                    function exit(){
                        $(".SPCOMProp").detach();
                        $(".SPCOMProp").die();
                        SPCOM = undefined;
                    }
                    
                    function removeSpaces(id){
                        while(id.indexOf(" ") > -1){
                            id = id.replace(" ", "");
                        }
                        return id;
                    }
                    
                    function showMenu(menuName){
                        menuName = safeName(menuName);
                        $("#SPCOM-menu-" + menuName).addClass("SPCOM-shaded");
                        $("#SPCOMitem" + menuName).parent().show();
                    }
                    
                    function hideMenu(menuName){
                        menuName = safeName(menuName);
                        $("#SPCOM-menu-" + menuName).removeClass("SPCOM-shaded");
                        $("#SPCOMitem" + menuName).parent().hide();
                    }
                    
                    function loadStyle(){
                        $("body").append("<link type='text/css' rel='stylesheet' href='" + CSS_URL + "' />");
                    }
                    
                    function buildBar(){
                        $(menuItems).each(function(){
                            $("#SPCOM-menu-row").append("<td class='SPCOM-menu-td' id='SPCOM-menu-" + safeWord(this) +
                                                        "' onmouseout='SPCOM.hideMenu(\"" + safeWord(this) +
                                                        "\")' onmouseover='SPCOM.showMenu(\"" + safeWord(this) + "\")'><div>" +
                                                        this + "</div>" + makeListMenu(this) + "</td>");
                        });
                        $(".SPCOM-menu-item tr").hover(function(){$(this).addClass("SPCOM-shaded");}, function(){$(this).removeClass("SPCOM-shaded");});
                        setTimeout(function(){$(".SPCOM-menu-item tr").hover(function(){$(this).addClass("SPCOM-shaded");}, function(){$(this).removeClass("SPCOM-shaded");});}, 1000);
                    }
                    
                    function makeListObj(obj){
                        return{
                            title: $(obj).attr("Title"),
                            itemCount: $(obj).attr("ItemCount"),
                            url: $(obj).attr("DefaultViewUrl"),
                            id: $(obj).attr("ID"),
                            name: $(obj).attr("Name")
                        }
                    }
                    
                    function init(){
                        //debugger;
                        $("body").prepend("<div id='SPCommander' class='SPCOMProp'><div><table id='SPCOM-menu'>" +
                        "<tr id='SPCOM-menu-row'><td class='SPCOM-menu-td'><img src='http://joshrouwhorst.com/sp/imgs/spcom.png' /></td></tr></table>" +
                        "</div>" +
                        "<script type='text/javascript'>setTimeout(SPCOM.buildBar, 500);</script></div>");
                    }
                    
                    var site = (function(){            
                        var main, path, folders, rootPath, allSite, lists = new Array();
                        $().SPCOMServices({
                            operation: "GetListCollection",
                            async: false,
                            completefunc: function (data, status) {
                                $(data.responseXML).find("List").each(function() {
                                    var list = new List(this);
                                    lists[safeWord(list.id)] = list;
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
                    
                    loadStyle();
                    $().SPCOMServices.defaults.webUrl = $().SPCOMServices.SPGetCurrentSite();
                    
                        
                    info.build();
                    
                    return{
                        shade: shade,
                        unshade: unshade,
                        info: info,
                        site: site,
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
                
                SPCOM.init();
            }, 1);
        }
    }
    catch(e){
        setTimeout(SPCOM_JQUERY_WAIT, 100);
    }
}

SPCOM_JQUERY_WAIT();
