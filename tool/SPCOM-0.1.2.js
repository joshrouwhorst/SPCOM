SPCOM = (function(){
    var HOME_URL = "http://joshrouwhorst.com/sp/";
    var CSS_URL = HOME_URL + "css/SPCOM-0.1.2.css";
    var subsites = new Array();
    var rootPath = $().SPCOMServices.SPGetCurrentSite();
    
    function trunc(word, size, endWith){
        if (size === undefined) size = 25;
        if (endWith === undefined) endWith = "...";
        
        if (word.length > (size - endWith.length)){
            return word.substring(0, (size - endWith.length)) + endWith;
        }
        else{
            return word;
        }
    }
    
    var clickDrag = (function(){
        var xDif;
        var yDif;
        var elem;
        
        function grab(){
            if (event === undefined){
                event = window.event;
            }
            
            if (event.currentTarget){
                childElem = event.currentTarget;
            }
            else if (event.srcElement){
                childElem = event.srcElement;
            }
            elem = childElem.parentNode.parentNode.parentNode.parentNode;
            
            if (elem.style.left){
                var xPos = parseInt(elem.style.left);
            }
            else if (elem.style.right){
                var xPos = parseInt(elem.style.right);
            }
            
            if (elem.style.top){
                var yPos = parseInt(elem.style.top);
            }
            else if (elem.style.bottom){
                var yPos = parseInt(elem.style.bottom);
            }
            
            if (elem.style.left){
                xDif = event.clientX - xPos; 
            }
            else if (elem.style.right){
                var xDifAmount = (document.documentElement.clientWidth - event.clientX);
                xDif = xDifAmount - xPos; 
            }
            
            if (elem.style.top){
                yDif = event.clientY - yPos;
            }
            else if (elem.style.bottom){
                var yDifAmount = (document.documentElement.clientHeight - event.clientY);
                yDif = yDifAmount - yPos;
            }
            
            if (document.addEventListener){
                document.addEventListener("mousemove", move, true);
                document.addEventListener("mouseup", drop, true);
            }
            else if (document.attachEvent){
                document.attachEvent("onmousemove", move);
                document.attachEvent("onmouseup", drop);
            }
        }
        
        function move(){
            if(event === undefined){
                event = window.event;
            }
            
            if (elem.style.left){
                elem.style.left = (event.clientX - xDif) + "px";
            }
            else if (elem.style.right){
                var xMoveAmount = (document.documentElement.clientWidth - event.clientX);
                elem.style.right = (xMoveAmount - xDif) + "px";
            }
            
            if (elem.style.top){
                elem.style.top = (event.clientY - yDif) + "px";
            }
            else if (elem.style.bottom){
                var yMoveAmount = (document.documentElement.clientWidth - event.clientX);
                elem.style.top = (yMoveAmount - yDif) + "px";
            }
        }
        
        function drop(){
            if(event === undefined){
                event = window.event;
            }
            
            if (document.removeEventListener){
                document.removeEventListener("mouseup", drop, true);
                document.removeEventListener("mousemove", move, true);
            }
            else if (document.detachEvent){
                document.detachEvent("onmouseup", drop);
                document.detachEvent("onmousemove", move);
            }
        }
        
        return{
            grab: grab
        }
    }());
    
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
    
    var info = (function(){
        function build(){
            var html = "<div class='SPCOM-listInfo SPCOMprop' id='SPCOMlistInfo'>" +
                        "<table class='SPCOM-listInfo-bar'>" +
                            "<tr>" +
                                "<td class='SPCOM-clickDrag' onmousedown='SPCOM.clickDrag.grab()'></td>" +
                                "<td onclick='SPCOM.info.hide()' class='SPCOM-listInfo-exit' onmouseover='SPCOM.shade()' onmouseout='SPCOM.unshade()'>X</td>" +
                            "</tr>" + 
                        "</table>" +
                        "<table class='SPCOM-listInfo-topTable'>" +
                            "<tr>" +
                                "<td class='SPCOM-listInfo-title'>" +
                                "</td>" +
                            "</tr>" + 
                            "<tr>" +
                                "<td class='SPCOM-listInfo-desc'></td>" +
                            "</tr>" +
                        "</table>" +
                        "<table>" +
                            "<tr>" +
                                "<td class='SPCOM-listInfo-sub1'></td>" +
                                "<td class='SPCOM-listInfo-sub2'></td>" +
                                "<td class='SPCOM-listInfo-sub3'></td>" +
                            "</tr>" +
                        "</table>" +
                        "<table class='SPCOM-listInfo-status'>" +
                            "<tr>" +
                                "<td></td>" +
                            "</tr>" +
                        "</table>" + 
                        "<table class='SPCOM-listInfo-catTable'>" +
                            "<tr valign='top'>" +
                                "<td><div class='SPCOM-listInfo-menu1'></div></td>" +
                                "<td><div class='SPCOM-listInfo-menu2'></div></td>" +
                                "<td><div class='SPCOM-listInfo-menu3'></div></td>" +
                            "</tr>" +
                        "</table>" +
                    "</div>"
            $("body").append(html);
        }
        
        function status(message, time){
            $(".SPCOM-listInfo-status td").html(message);
            $(".SPCOM-listInfo-status").show();
            if (time !== undefined && !isNaN(parseInt(time))){
                setTimeout(function(){$(".SPCOM-listInfo-status").hide();}, time);
            }
        }
        
        function hide(){
            $("#SPCOMlistInfo").hide();
        }
        
        function show(){
            xWide = document.body.clientWidth;
	    $("#SPCOMlistInfo").css({"top": "100px", "left": ((xWide / 2) - 425) + "px"});
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
            status: status,
            show: show,
            hide: hide,
            set: set,
            get: get,
            build: build
        }
    }());
    
    var listTypes = [
	{
	    display: "Lists",
	    type: "Generic List",
	    serverTemp: "100",
	    common: true
	},
	{
	    display: "Document Libraries",
	    type: "Document Library",
	    serverTemp: "101",
	    common: true
	},
	{
	    display: "Surveys",
	    type: "Survey",
	    serverTemp: "102",
	    common: true
	},
	{
	    display: "Links Lists",
	    type: "Links List",
	    serverTemp: "103",
	    common: false
	},
	{
	    display: "Announcements Lists",
	    type: "Annoucements List",
	    serverTemp: "104",
	    common: false
	},
	{
	    display: "Contacts Lists",
	    type: "Contacts List",
	    serverTemp: "105",
	    common: false
	},
	{
	    display: "Events Lists",
	    type: "Events List",
	    serverTemp: "106",
	    common: false
	},
	{
	    display: "Tasks Lists",
	    type: "Tasks List",
	    serverTemp: "107",
	    common: false
	},
	{
	    display: "Discussion Boards",
	    type: "Discussion Board",
	    serverTemp: "108",
	    common: false
	},
	{
	    display: "Picture Libraries",
	    type: "Picture Library",
	    serverTemp: "109",
	    common: true
	},
	{
	    display: "Data Sources",
	    type: "Data Sources",
	    serverTemp: "110",
	    common: false
	},
	{
	    display: "Site Template Galleries",
	    type: "Site Template Gallery",
	    serverTemp: "111",
	    common: false
	},
	{
	    display: "User Information Lists",
	    type: "User Information List",
	    serverTemp: "112",
	    common: true
	},
	{
	    display: "Web Part Galleries",
	    type: "Web Part Gallery",
	    serverTemp: "113",
	    common: false
	},
	{
	    display: "List Template Galleries",
	    type: "List Template Gallery",
	    serverTemp: "114",
	    common: false
	},
	{
	    display: "XML Form Libraries",
	    type: "XML Form Library",
	    serverTemp: "115",
	    common: false
	},
	{
	    display: "Master Pages Galleries",
	    type: "Master Pages Gallery",
	    serverTemp: "116",
	    common: false
	},
	{
	    display: "No-Code Workflows",
	    type: "No-Code Workflows",
	    serverTemp: "117",
	    common: false
	},
	{
	    display: "Custom Workflow Processes",
	    type: "Custom Workflow Process",
	    serverTemp: "118",
	    common: false
	},
	{
	    display: "Wiki Page Libraries",
	    type: "Wiki Page Library",
	    serverTemp: "119",
	    common: false
	},
	{
	    display: "Custom Grids for Lists",
	    type: "Custom Grid for a List",
	    serverTemp: "120",
	    common: false
	},
	{
	    display: "Data Connection Libraries",
	    type: "Data Connection Library",
	    serverTemp: "130",
	    common: false
	},
	{
	    display: "Workflow Histories",
	    type: "Workflow History",
	    serverTemp: "140",
	    common: false
	},
	{
	    display: "Gantt Tasks Lists",
	    type: "Gantt Tasks List",
	    serverTemp: "150",
	    common: false
	},
	{
	    display: "Meeting Series Lists",
	    type: "Meeting Series List",
	    serverTemp: "200",
	    common: false
	},
	{
	    display: "Meeting Agenda Lists",
	    type: "Meeting Agenda List",
	    serverTemp: "201",
	    common: false
	},
	{
	    display: "Meeting Attendees Lists",
	    type: "Meeting Attendees List",
	    serverTemp: "202",
	    common: false
	},
	{
	    display: "Meeting Decisions Lists",
	    type: "Meeting Decisions List",
	    serverTemp: "204",
	    common: false
	},
	{
	    display: "Meeting Objectives Lists",
	    type: "Meeting Objectives List",
	    serverTemp: "207",
	    common: false
	},
	{
	    display: "Meeting Text Boxes",
	    type: "Meeting Text Box",
	    serverTemp: "210",
	    common: false
	},
	{
	    display: "Meeting Things-To-Bring Lists",
	    type: "Meeting Things To Bring List",
	    serverTemp: "211",
	    common: false
	},
	{
	    display: "Meeting Workspace Pages Lists",
	    type: "Meeting Workspace Pages List",
	    serverTemp: "212",
	    common: false
	},
	{
	    display: "Portal Sites Lists",
	    type: "Portal Sites List",
	    serverTemp: "300",
	    common: false
	},
	{
	    display: "Blog Posts Lists",
	    type: "Blog Posts List",
	    serverTemp: "301",
	    common: false
	},
	{
	    display: "Blog Comments Lists",
	    type: "Blog Comments List",
	    serverTemp: "302",
	    common: false
	},
	{
	    display: "Blog Categories Lists",
	    type: "Blog Categories List",
	    serverTemp: "303",
	    common: false
	},
	{
	    display: "Page Libraries",
	    type: "Page Library",
	    serverTemp: "850",
	    common: false
	},
	{
	    display: "Issue Tracking",
	    type: "Issue Tracking",
	    serverTemp: "1100",
	    common: false
	},
	{
	    display: "Administrator Tasks Lists",
	    type: "Administrator Tasks List",
	    serverTemp: "1200",
	    common: false
	},
	{
	    display: "Personal Document Libraries",
	    type: "Personal Document Library",
	    serverTemp: "2002",
	    common: false
	},
	{
	    display: "Private Document Libraries",
	    type: "Private Document Library",
	    serverTemp: "2003",
	    common: false
	}
    ]
    
    
    /*
     *
     * 	    LIST OBJECT
     *
     */
    var List = function(listObj, listType){
	
	/*
	 *	FIELD OBJECT
	 *
	 */
        var Field = function(fieldObj){
            this.selectField = function(){
                var numLines = (parField.numLines === "") ? "" : "<tr><td>Number of Lines: " + parField.numLines + "</td></tr>";
                var format = (parField.format === "") ? "" : "<tr><td>Format: " + parField.format + "</td></tr>";
                var maxLength = (parField.maxLength === "") ? "" : "<tr><td>Max Length: " + parField.maxLength + "</td></tr>";
                var choices = "";
                if (parField.type === "Choice"){
                    choices = "<tr><td>Choices: <select>";
                    for (var i = 0; i < parField.choices.options.length; i++){
                        choices += "<option>" + parField.choices.options[i] + "</option>";
                    }
                    choices += "</select></td></tr>";
                    if (parField.choices.defaultOpt !== ""){
                        choices += "<tr><td>Default Choice: " + parField.choices.defaultOpt + "</td></tr>";
                    }
                }
                
                var html = "<table><tr><td><a href='" + parField.settings + "'>Settings</a></td></tr>" +
                    "<tr><td class='SPCOM-listInfo-headers'>Names</td></tr>" +
                    "<tr><td>Display Name:</td></tr>" +
                    "<tr><td><input type='text' style='width: 100%;' value='" + parField.displayName + "' /></td></tr>" +
                    "<tr><td>Attribute Name:</td></tr>" + 
                    "<tr><td><input type='text' style='width: 100%;' value='ows_" + parField.name + "' /></td></tr>" +
                    "<tr><td>M1SP Name:</td></tr>" + 
                    "<tr><td><input type='text' style='width: 100%;' value='" + removeSpaces(parField.name) + "' /></td></tr>" +
                    "<tr><td class='SPCOM-listInfo-headers'>Info</td></tr>" +
                    "<tr><td>Type: " + parField.type + "</td></tr>" +
                    maxLength + 
                    format +
                    choices + 
                    "<tr><td>Required: " + parField.required + "</td></tr>" +
                    numLines +
                    "<tr><td>Sortable: " + parField.sortable + "</td></tr>" +
                    "<tr><td>Read Only: " + parField.readOnly + "</td></tr>" +
                    "<tr><td>Hidden: " + parField.hidden + "</td></tr>" +
		    "<tr><td>XML:</td><tr>" + 
		    "<tr><td><textarea>" + parField.xml + "</textarea></td></tr>" + 
                    "</table>";
                info.set({
                   menu3: html 
                });
            }
            
            this.displayName = "";
            this.staticName = "";
            this.name = "";
            this.required = false;
            this.numLines = "";
            this.sortable = false;
            this.format = "";
            this.maxLength = "";
            this.choices = "";
            
            if ($(fieldObj).attr("DisplayName") !== undefined){
                this.displayName = $(fieldObj).attr("DisplayName");
            }
            if ($(fieldObj).attr("StaticName") !== undefined){
                this.staticName = $(fieldObj).attr("StaticName");
            }
            if ($(fieldObj).attr("Name") !== undefined){
                this.name = $(fieldObj).attr("Name");
            }
            if ($(fieldObj).attr("Required") !== undefined && $(fieldObj).attr("Required") === "TRUE"){
                this.required = true;
            }
            if ($(fieldObj).attr("NumLines") !== undefined){
                this.numLines = $(fieldObj).attr("NumLines");
            }
            if ($(fieldObj).attr("Sortable") !== undefined && $(fieldObj).attr("Sortable") === "TRUE"){
                this.sortable = true;
            }
            if ($(fieldObj).attr("Format") !== undefined){
                this.format = $(fieldObj).attr("Format");
            }
            if ($(fieldObj).attr("MaxLength") !== undefined){
                this.maxLength = $(fieldObj).attr("MaxLength");
            }
            
            this.readOnly = $(fieldObj).attr("ReadOnly") === "TRUE" ? true : false;
            this.hidden = $(fieldObj).attr("Hidden") === "TRUE" ? true : false;
            this.id = $(fieldObj).attr("ID");
            this.safeId = safeWord(this.id);
            this.type = $(fieldObj).attr("Type");
            this.settings = site.rootPath + "/_layouts/FldEdit.aspx?List=" + parList.id + "&Field=" + this.staticName;
			this.xml = fieldObj.xml;
            
            var parField = this;
            
            if (this.type === "Choice"){
                this.choices = {
                    defaultOpt: "",
                    options: new Array()
                };
                
                $(fieldObj).find("Default").each(function(){
                    parField.choices.defaultOpt = this.text;
                });
                
                $(fieldObj).find("CHOICE").each(function(){
                    parField.choices.options.push(this.text);
                });
            }
            
            this.html = "<tr onmouseover='SPCOM.shade()' onmouseout='SPCOM.unshade()' onclick='SPCOM.site.lists[\"" + parList.listCat + "\"][\"" + parList.safeId + "\"].fields[\"" + this.safeId + "\"].selectField()'><td>" +
                    this.displayName + "</td></tr>";
            return this;
        }
        
        this.moreInfo = function(){
            info.set({
               title: parList.title,
               desc: parList.desc,
               sub1: "Item Count: " + parList.itemCount,
               sub2: "<a href='" + parList.settings + "'>Settings</a>",
               menu1: "<table>" +
                        "<tr>" +
                            "<td onclick='SPCOM.site.lists[\"" + parList.listCat + "\"][\"" + parList.safeId + "\"].selectCommands()' onmouseover='SPCOM.shade()' onmouseout='SPCOM.unshade()'>" +
                                "Commands" +
                            "</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td onclick='SPCOM.site.lists[\"" + parList.listCat + "\"][\"" + parList.safeId + "\"].selectFields()' onmouseover='SPCOM.shade()' onmouseout='SPCOM.unshade()'>Fields</td>" +
                        "</tr>" +
                        "<tr>" +
                            "<td onclick='SPCOM.site.lists[\"" + parList.listCat + "\"][\"" + parList.safeId + "\"].selectViews()' onmouseover='SPCOM.shade()' onmouseout='SPCOM.unshade()'>Views</td>" +
                        "</tr>" +
                    "</table>"
            }, true);
            parList.selectCommands();
            info.show();
            getFields();
        }
        
        this.selectCommands = function(){
            var html = "<table>";
            for (var i = 0; i < parList.commands.length; i++){
                html += "<tr>" +
                            "<td onclick='SPCOM.site.lists[\"" + parList.listCat + "\"][\"" + parList.safeId + "\"].commands[" + i + "].select()' onmouseover='SPCOM.shade()' onmouseout='SPCOM.unshade()'>" +
                                parList.commands[i].name +
                            "</td>" +
                        "</tr>";
            }
            html += "</table>";
            info.set({
                menu2: html,
                menu3: ""
            });
        }
        
        this.selectFields = function(){
            var fieldHtml = "";
            for (var id in parList.fields){
                if (id !== undefined && id !== ""){
                    if (parList.fields[id].displayName !== "" && parList.fields[id].staticName !== "" && !parList.fields[id].readOnly && !parList.fields[id].hidden && parList.fields[id].displayName !== "Attachments"){
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
        
        this.refresh = function(){
            if ($(info.get("title")).html() === parList.title){
                info.set({
                    title: "<a href='" + parList.settings + "'>" + parList.title + "</a>",
                    desc: parList.desc,
                    sub1: "Item Count: " + parList.itemCount,
                    sub2: "<a href='" + parList.addItem + "'>Add Item</a>"
                });
            }
        }
        
        function addToNav(){
			var fieldRef = "Title";
			if (parList.type === "Wiki Page Library") fieldRef = "FileLeafRef";
			$().SPCOMServices({
				operation: "GetListItems",
				listName: parList.title,
				CAMLQuery: "<Query><Where><Neq><FieldRef Name='" + fieldRef + "' /><Value Type='Text'></Value></Neq></Where></Query>",
				CAMLQueryOptions: "<QueryOptions><ViewAttributes Scope='Recursive' /></QueryOptions>",
				async: true,
				completefunc: function(data, success){
					if ($().SPFilterNode !== undefined) {
						$(data.responseXML).SPFilterNode("z:row").each(function(){
							if ($(this).attr("ows_LinkFilename") !== undefined && $(this).attr("ows_LinkFilename").indexOf(".aspx") > -1){
								if (site.pages === 0){
								$("#SPCOMitemPages > tbody").html("");
								}
								site.pages++;
								$("#SPCOMitemPages > tbody").append("<tr><td onmouseover='SPCOM.shade()' onmouseout='SPCOM.unshade()' onclick='window.location=\"/" + $(this).attr("ows_FileRef").split(";#")[1] + "\"'>" + trunc($(this).attr("ows_LinkFilename")) + "</td></tr>");
							}
						});
					}
					else {
						$(data.responseXML).find("[nodeName='z:row']").each(function(){
							if ($(this).attr("ows_LinkFilename") !== undefined && $(this).attr("ows_LinkFilename").indexOf(".aspx") > -1){
								if (site.pages === 0){
								$("#SPCOMitemPages > tbody").html("");
								}
								site.pages++;
								$("#SPCOMitemPages > tbody").append("<tr><td onmouseover='SPCOM.shade()' onmouseout='SPCOM.unshade()' onclick='window.location=\"/" + $(this).attr("ows_FileRef").split(";#")[1] + "\"'>" + trunc($(this).attr("ows_LinkFilename")) + "</td></tr>");
							}
						});
					}
				}
			});
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
        
        this.type = listType.type;
	this.listCat = listType.display;
	this.common = listType.common;
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
        this.addColumn = rootPath + "/_layouts/fldNew.aspx?List=" + encodeURIComponent(this.name);
        this.addItem = rootPath + "/Lists/" + encodeURIComponent(this.title) + "/NewForm.aspx";
        this.commands = new Array();
        
        var parList = this;
        
        if (this.type === "Document Library" || this.type === "Wiki Page Library"){
            addToNav();
        }
        
        this.commands[2] = (function(){
            var name = "Add Column";
            function select(){
                window.location = parList.addColumn;
            }
            
            return{
                name: name,
                select: select
            }
        }());
        
        this.commands[1] = (function(){
            var name = "Add Item";
            function select(){
                window.location = parList.addItem;
            }
            
            return{
                name: name,
                select: select
            }
        }());
        
        this.commands[0] = (function(){
            var name = "Delete Items";
            var menu = (function(){
                var html;
                var root = "SPCOM.site.lists[\"" + parList.listCat + "\"][\"" + parList.safeId + "\"].commands[0]";
                var table = "<table></table>";
                var header = "<tr><td class='SPCOM-listInfo-headers'>Delete Items</td></tr>";
                var deleteAllChecked = "<tr><td><input id='SPCOMdelAll' type='checkbox' onclick='" + root + ".menu.delAll(false)' checked /> Delete All Items?</td></tr>";
                var deleteAllUnchecked = "<tr><td><input id='SPCOMdelAll' type='checkbox' onclick='" + root + ".menu.delAll(true)' /> Delete All Items?</td></tr>";
                var andOr = "<tr><td><select class='SPCOM-deleteItem-andOr'><option>And</option><option>Or</option></select></td></tr>";
                var container = "<div></div>";
                var runButton = "<tr><td style='text-align: center;'><input onclick='" + root + ".run()' type='button' value='Run' /></td></tr>";
                
                function condDel(){
                    var options = "";
                    for (var id in parList.fields){
                        if (id !== undefined && id !== "" &&
                            ((!parList.fields[id].readOnly && !parList.fields[id].hidden) ||
                             ((parList.fields[id].displayName === "Created" && parList.fields[id].type === "DateTime")||
                              (parList.fields[id].displayName === "Modified" && parList.fields[id].type === "DateTime") ||
                              parList.fields[id].displayName === "Created By" ||
                              parList.fields[id].displayName === "Modified By" ||
                              parList.fields[id].displayName === "ID")) &&
                                parList.fields[id].displayName !== "Attachments"){
                            options += "<option value='" + id + "'>" + parList.fields[id].displayName + "</option>";
                        }
                    }
                    
                    return "<tr><td><select class='SPCOM-deleteItem-field'>" + options + "</select></td></tr>" +
                            "<tr><td><select class='SPCOM-deleteItem-operator'>" +
                            "<option value='Eq'>Is Equal To</option>" +
                            "<option value='Neq'>Is Not Equal To</option>" +
                            "<option value='Gt'>Is Greater Than</option>" +
                            "<option value='Lt'>Is Less Than</option>" +
                            "<option value='Geq'>Is Greater Than or Equal To</option>" +
                            "<option value='Leq'>Is Less Than or Equal To</option>" +
                            "<option value='BeginsWith'>Begins With</option>" +
                            "<option value='Contains'>Contains</option>" +
                            "</select></td></tr>" +
                            "<tr><td><input type='text' class='SPCOM-deleteItem-value' /></td></tr>";
                }
                
                function delAll(bool){
                    if (bool){
                        var newTable = $(table).append(header).append(deleteAllChecked).append(runButton);
                        var newContainer = $(container).append(newTable);
                        info.set({
                           menu3: $(newContainer).html()
                        });
                    }
                    else{
                        var newTable = $(table).append(header).append(deleteAllUnchecked).append(condDel()).append(runButton);
                        var newContainer = $(container).append(newTable);
                        info.set({
                           menu3: $(newContainer).html()
                        });
                    }
                }
                
                function init(){
                    var newTable = $(table).append(header).append(deleteAllChecked).append(runButton);
                    var newContainer = $(container).append(newTable);
                    info.set({
                        menu3: $(newContainer).html()
                    });
                }
                
                return{
                    delAll: delAll,
                    init: init
                }
            }());
            
            function run(){
                if ($("#SPCOMdelAll").attr("checked")){
                    var conf = confirm("Are you sure you want to delete ALL items from " + parList.title + "?");
                    if (conf){
                        info.status("Please Wait...");
                        $().SPCOMServices({
                            operation: "GetListItems",
                            listName: parList.title,
                            CAMLQuery: "<Query><Where><Neq><FieldRef Name='Title' /><Value Type='Text'></Value></Neq></Where></Query>",
                            async: true,
                            completefunc: function(data, success){
                                if (success && data !== undefined){
                                    var itemArray = new Array(), batch;
                                    
                                    $(data.responseXML).find("[nodeName='z:row']").each(function () {
                                        row = new Array();
                                        $(this.attributes).each(function () {
                                            row[this.name] = $(this).val();
                                        });
                                        itemArray[itemArray.length] = row;
                                    });
                                    
                                    batch = "<Batch OnError='Continue'>\n";
                                    for (var i = 0; i < itemArray.length; i++){
                                        batch += "<Method ID='" + (i + 1) + "' Cmd='Delete'>\n" +
                                                "<Field Name='ID'>" + itemArray[i].ows_ID + "</Field>\n" +
                                                "</Method>\n";
                                    }
                                    batch += "</Batch>";
                                    
                                    $().SPCOMServices({
                                        operation: "UpdateListItems",
                                        listName: parList.title,
                                        updates: batch,
                                        async: true,
                                        completefunc: function(data, success){
                                            info.status(itemArray.length + " items deleted.", 5000);
                                            site.refreshList(parList.title);
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
                else{
                    var fieldVal = $(".SPCOM-deleteItem-field").val();
                    var field;
                    for (var id in parList.fields){
                        if (id === fieldVal){
                            field = parList.fields[id];
                            break;
                        }
                    }
                    var op = $(".SPCOM-deleteItem-operator").val();
                    var val = $(".SPCOM-deleteItem-value").val();
                    var query = "<Query><Where><" + op + "><FieldRef Name='" + field.staticName + "' /><Value Type='" + field.type + "'>" + val + "</Value></" + op + "></Where></Query>";
                    $().SPCOMServices({
                        operation: "GetListItems",
                        listName: parList.title,
                        CAMLQuery: query,
                        async: true,
                        completefunc: function(data, success){
                            if (success === "success" && data !== undefined){
                                info.status("Please Wait...");
                                var itemArray = new Array(), batch;
                                
                                $(data.responseXML).find("[nodeName='z:row']").each(function () {
                                    row = new Array();
                                    $(this.attributes).each(function () {
                                        row[this.name] = $(this).val();
                                    });
                                    itemArray[itemArray.length] = row;
                                });
                                
                                var conf = confirm("Are you sure you want to delete " + itemArray.length + " items?");
                                if (conf){
                                    batch = "<Batch OnError='Continue'>\n";
                                    for (var i = 0; i < itemArray.length; i++){
                                        batch += "<Method ID='" + (i + 1) + "' Cmd='Delete'>\n" +
                                                "<Field Name='ID'>" + itemArray[i].ows_ID + "</Field>\n" +
                                                "</Method>\n";
                                    }
                                    batch += "</Batch>";
                                    
                                    $().SPCOMServices({
                                        operation: "UpdateListItems",
                                        listName: parList.title,
                                        updates: batch,
                                        async: true,
                                        completefunc: function(data, success){
                                            info.status(itemArray.length + " items deleted.", 5000);
                                            site.refreshList(parList.title);
                                        }
                                    });
                                }
                                else{
                                    info.status("", 0);
                                }
                            }
                        }
                    });
                }                                
            }
            
            function select(){
                menu.init();
            }
            
            return {
                name: name,
                menu: menu,
                run: run,
                select: select
            }
        }());
        
        return this;
    }
    
    function safeName(name){
        return name.replace(/[^a-zA-Z0-9]+/g,"");
    }
    
    function makeListMenu(name){
        if (name != "Nav"){
            var html = "<div class='SPCOM-menu-container'><table id='SPCOMitem" + safeWord(name) + "' class='SPCOM-menu-item'><tbody>";
            var items = ""
            for (var id in site.lists[name]){
                items += "<tr onmouseover='SPCOM.shade()' onmouseout='SPCOM.unshade()'><td onclick='SPCOM.site.lists[\"" + name + "\"][\"" + id + "\"].moreInfo()'>" + trunc(site.lists[name][id].title) + "</td><td onclick='window.location=\"" + site.lists[name][id].url + "\";'>&gt;</td></tr>";
            }
            if (items === ""){
                items = "<tr><td colspan='2'>No Items Found</td></tr>";
            }
            html += items + "</tbody></table></div>";
            return html;
        }
        else{
            return "<div class='SPCOM-menu-container'><table id='SPCOMitemNav' class='SPCOM-menu-item'><tr><td onmouseover='SPCOM.shade()' onmouseout='SPCOM.unshade()' onclick='window.location=\"" + site.allSite + "\"'>" +
                "All Site Content</td></tr><tr><td onmouseover='SPCOM.shade()' onmouseout='SPCOM.unshade()' onclick='window.location=\"" +
                site.main + "\"'>Default</td></tr><tr><td onmouseover='SPCOM.shade()' onmouseout='SPCOM.unshade()' onclick='window.location=\"" +
                site.create + "\"'>Create</td></tr><tr><td onmouseover='SPCOM.shade()' onmouseout='SPCOM.unshade()' onclick='window.location=\"" +
                site.settings + "\"'>Site Settings</td></tr><tr><td onmouseover='SPCOM.shade()' onmouseout='SPCOM.unshade()' onclick='window.location=\"" +
                site.templates + "\"'>List Templates</td></tr></table></div>";
        }
    }
    
    function showListInfo(id){
        $("#SPCOMlistInfo" + id).show();
    }
    
    function hideListInfo(id){
        $("#SPCOMlistInfo" + id).hide();
    }
    
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
    
    function removeSpaces(name){
		return name.replace(/ows_|_x0020_|_x003a_/g, "");
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
        if ($("#SPCOM-menu-row").html() !== undefined){
	    $("#SPCOM-menu-row").append("<td class='SPCOM-menu-td' id='SPCOM-menu-Nav' onmouseout='SPCOM.hideMenu(\"Nav\")' onmouseover='SPCOM.showMenu(\"Nav\")'><div>Nav</div>" + makeListMenu("Nav") +
					"</td><td class='SPCOM-menu-td' id='SPCOM-menu-Pages' onmouseout='SPCOM.hideMenu(\"Pages\")' onmouseover='SPCOM.showMenu(\"Pages\")'><div>Pages</div>" + makeListMenu("Pages") + "</td>");
            for (var displayName in site.lists){
		for (var i = 0; i < listTypes.length; i++){
		    if (listTypes[i].display === displayName && listTypes[i].common){
			$("#SPCOM-menu-row").append("<td class='SPCOM-menu-td' id='SPCOM-menu-" + safeWord(displayName) +
				    "' onmouseout='SPCOM.hideMenu(\"" + safeWord(displayName) +
				    "\")' onmouseover='SPCOM.showMenu(\"" + safeWord(displayName) + "\")'><div>" +
				    trunc(displayName, 25) + "</div>" + makeListMenu(displayName) + "</td>");
		    }
		    if (listTypes[i].display === displayName) break;
		}
	    }
        }
        else{
            setTimeout(buildBar, 100);
        }
    }
    
    function init(){
        $("body").prepend("<div id='SPCommander' class='SPCOMProp'><div><table id='SPCOM-menu'>" +
        "<tr id='SPCOM-menu-row'><td class='SPCOM-menu-td'><img src='http://joshrouwhorst.com/sp/imgs/spcom.png' /></td></tr></table>" +
        "</div>");
        buildBar();
    }
    
    var site = (function(){
        var main, rootPath, allSite, templates, create, lists = new Array(), pages = 0, settings;
        $().SPCOMServices({
            operation: "GetListCollection",
            async: false,
            completefunc: function (data, status) {
                $(data.responseXML).find("List").each(function() {
					for (var i = 0; i < listTypes.length; i++){
						if ($(this).attr("ServerTemplate") === listTypes[i].serverTemp){
							var list = new List(this, listTypes[i]);
							if (lists[listTypes[i].display] === undefined){
								lists[listTypes[i].display] = new Array();
							}
							lists[listTypes[i].display][list.safeId] = list;
							break;
						}
					}
                });
            }
        });
        
        rootPath = $().SPCOMServices.SPGetCurrentSite();
        
        allSite = rootPath + "/_layouts/viewlsts.aspx";
        
        main = rootPath + "/default.aspx";
        
        templates = rootPath + "/_catalogs/lt/Forms/AllItems.aspx";
        
        create = rootPath + "/_layouts/Create.aspx";
        
        settings = rootPath + "/_layouts/settings.aspx";
        
        function refreshList(title){
            $().SPCOMServices({
                operation: "GetList",
                listName: title,
                async: true,
                completefunc: function(data, status){
                    $(data.responseXML).find("List").each(function(){
						for (var i = 0; i < listTypes.length; i++){
							if ($(this).attr("ServerTemplate") === listTypes[i].serverTemp){
							var list = new List(this, listTypes[i]);
							if (lists[listTypes[i].display] === undefined){
								lists[listTypes[i].display] = new Array();
							}
							lists[listTypes[i].display][list.safeId] = list;
							list.refresh();
							break;
							}
						}
                    });
                }
            });
        }
        
        return{
            settings: settings,
            pages: pages,
            create: create,
            refreshList: refreshList,
            templates: templates,
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
        clickDrag: clickDrag,
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
