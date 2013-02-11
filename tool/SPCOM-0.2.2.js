var SPCOM = (function(){
    var version = "0.2.2",
        listCount = 0,
        listsCollected = 0,
        types,
        listArr = {
            items: [],
            lists: []
        },
        pages = [],
        additionalPages = [
            {title: "List Templates", url: "_catalogs/lt/Forms/AllItems.aspx"}, //Needs to go to the top-most site
            {title: "People And Groups", url: "_layouts/people.aspx"},
            {title: "Create", url: "_layouts/Create.aspx"},
            {title: "Site Settings", url: "_layouts/settings.aspx"},
            {title: "Default", url: "default.aspx"},
            {title: "All Site Content", url: "_layouts/viewlsts.aspx"}
        ],
        siteUrl,
        PARENT_WINDOW = window.opener.parent,
        MAX_LIST_SIZE = 100,
        finishedLoadingRan = false;
    
    var trunc = function(word, size, endWith){
	if (size === undefined) size = 30;
        if (endWith === undefined) endWith = "...";
        
        if (word.length > (size - endWith.length)){
            return word.substring(0, (size - endWith.length)) + endWith;
        }
        else{
            return word;
        }
    }
    
    var UI = (function(){
        var left, middle, right;
        
        function Column(id){
            this.id = id;
            this.columnClass = this.id + "ColumnClass";
            
            this.click = function(id){
                $("." + parentColumn.columnClass).removeClass("selectedListItem");
                $("#" + parentColumn.items[id].rowId).addClass("selectedListItem");
                parentColumn.selected = parentColumn.items[id].title;
                if(parentColumn.items[id].action !== undefined) parentColumn.items[id].action(parentColumn.items[id], parentColumn);
            }
            
            this.add = function(item, action, insertBeforeIndex){
                var id = parentColumn.items.length,
                    rowId = parentColumn.id + "Column-" + id,
		    thisObj = {
			id: id,
			rowId: rowId,
			title: item.title,
			data: item,
			action: action,
			element: "<div id='" + rowId + "' onclick='SPCOM.UI." + parentColumn.id + ".click(" + id + ");' class='menu-item " + parentColumn.columnClass + ((item.title === parentColumn.selected) ? " selectedListItem" : "") + "'><table class='listItem' cellspacing='0px'><tr><td>" + trunc(item.title) + "</td></tr></table></div>"
		    };
		if (parentColumn.sortFunc === undefined) parentColumn.items.push(thisObj);
		else parentColumn.sortFunc({obj: thisObj, parentColumn: parentColumn});
                return parentColumn.items[id].element;
            }
            
            this.addLinked = function(item, action){
                var id = parentColumn.items.length,
                    rowId = parentColumn.id + "Column-" + id;
                parentColumn.items.push({
                    id: id,
                    rowId: rowId,
                    title: item.title,
                    data: item,
                    action: action,
                    element: "<div id='" + rowId + "' class='menu-item " + parentColumn.columnClass + ((item.title === parentColumn.selected) ? " selectedListItem" : "") + "'><table class='listItem' cellspacing='0px'><tr><td class='listItem-first' onclick='SPCOM.UI." + parentColumn.id + ".click(" + id + ");'>" + trunc(item.title) + "</td><td class='listItem-second' onclick='SPCOM.link(\"" + item.url + "\")'>&gt;</td></tr></table></div>"
                });
                return parentColumn.items[id].element;
            }
            
            this.startNew = function(itemArr, linked, sortFunc){
                parentColumn.selected = undefined;
                parentColumn.clear();
                if (linked === undefined) parentColumn.linked = false;
                else parentColumn.linked = linked;
		if (sortFunc !== undefined) parentColumn.sortFunc = sortFunc;
                
                var html = "";
                for (var i = 0; i < itemArr.length; i++){
                    if (parentColumn.linked) html += parentColumn.addLinked(itemArr[i].item, itemArr[i].action);
                    else html += parentColumn.add(itemArr[i].item, itemArr[i].action);
                }
                if (html === "") html = "<div class='invisItem'><table><tr><td></td></tr></table></div>";
                parentColumn.column.html(html);
            }
            
            this.refresh = function(){
                var html = "";
                for (var i = 0; i < parentColumn.items.length; i++){
                    html += parentColumn.items[i].element;
                }
                if (html === "") html = "<div class='invisItem'><table><tr><td></td></tr></table></div>";
                parentColumn.column.html(html);
            }
            
            this.clear = function(){
                parentColumn.column.html("<div class='invisItem'><table><tr><td></td></tr></table></div>");
                parentColumn.items = [];
                if (parentColumn.child !== undefined) parentColumn.child.clear();
            }
            
            this.remove = function(title){
                for (var i = 0; i < parentColumn.items.length; i++){
                    if (title === parentColumn.items[i].title){
                        parentColumn.column.remove("#" + parentColumn.id + "Column-" + parentColumn.items[i].id);
                        break;
                    }
                }
            }
            
            this.init = function(child){
                parentColumn.column = $("#" + this.id + "Column");
                parentColumn.items = [];
                parentColumn.selected = undefined;
                parentColumn.linked = false;
                if (child !== undefined) parentColumn.child = child;
            }
            
            var parentColumn = this;
        }
        
        left = new Column("left");
        middle = new Column("middle");
        right = new Column("right");
        
        var init = function(){
            right.init();
            middle.init(right);
            left.init(middle);
            tabs.clear();
        }
        
        var tabs = (function(){
            var tabsArr = [],
                currentIndex,
                viewTabs = "<div id='viewTabs'><span id='status'></span></div>";
            
            var clear = function(){
                $("#viewArea").html(viewTabs + "<div id='viewLogo'><table id='logoTable'><tr><td><img src='http://joshrouwhorst.com/sp/imgs/v0.2/spCom-150.png' /><div class='spcomVersion'>v" + version + "</div></td></tr></table><table id='logoMenu'><tr><td onclick='SPCOM.link(\"" + siteUrl +
                                    "/_layouts/viewlsts.aspx\")'>All Site Content</td><td onclick='SPCOM.link(\"" + siteUrl +
                                    "/default.aspx\")'>Default</td><td onclick='SPCOM.link(\"" + siteUrl +
                                    "/_layouts/settings.aspx\")'>Site Settings</td></tr><tr><td onclick='SPCOM.link(\"" + siteUrl +
                                    "/_layouts/Create.aspx\")'>Create</td><td onclick='SPCOM.link(\"" + siteUrl +
                                    "/_layouts/people.aspx\")'>People And Groups</td><td onclick='SPCOM.link(\"" + siteUrl + "/_catalogs/lt/Forms/AllItems.aspx\")'>List Templates</td></tr>" +
                                    "<tr><td onclick='SPCOM.link(\"" + siteUrl + "/_layouts/RecycleBin.aspx\")'>Recycle Bin</td><td></td><td onclick='SPCOM.startLoading()'>Refresh Data</td></tr></table></div>");
                tabsArr = [];
                currentIndex = undefined;
            }
            
            var drawTabs = function(){
                if (tabsArr.length <= 0) clear();
                else{
                    var html = "";
                    for (var i = 0; i < tabsArr.length; i++){
                        if (i === currentIndex) html += "<span class='currentTab'>" + tabsArr[i].title + "</span>";
                        else html += "<span class='viewTab' onclick='SPCOM.UI.tabs.click(" + i + ")'>" + tabsArr[i].title + "</span>";
                    }
                    $("#viewTabs").html(html);
                    $("#currentViewContent").html(tabsArr[currentIndex].content);
                }
            }
            
            var add = function(tabInfo){
                if (tabsArr.length <= 0) $("#viewArea").html(viewTabs + "<div id='currentView'><div id='currentViewContent'></div></div>");
                if (tabInfo.title === undefined) tabInfo.title = "";
                if (tabInfo.content === undefined) tabInfo.content = "";
                
                for (var i = 0; i < tabsArr.length; i++){
                    if (tabsArr[i].title === tabInfo.title){
                        remove(i);
                    }
                }
                
                tabsArr.push(tabInfo);
                
                currentIndex = tabsArr.length - 1;
                
                drawTabs();
            }
            
            var remove = function(tabIndex){
                if (tabIndex === "last") tabIndex = tabsArr.length - 1;
                if (tabIndex === "first") tabIndex = 0;
                if (tabIndex === "current") tabIndex = currentIndex;
                if (tabIndex === currentIndex) currentIndex = 0;
                tabsArr.splice(tabIndex, 1);
                drawTabs();
            }
            
            var click = function(tabIndex){
                currentIndex = tabIndex;
                drawTabs();
            }
            
            return{
                drawTabs: drawTabs,
                click: click,
                add: add,
                remove: remove,
                clear: clear
            }
        })();
        
        return{
            init: init,
            left: left,
            middle: middle,
            right: right,
            tabs: tabs
        }
    })();
    
    var lists = (function(){
        var types = [
                {
                    display: "Lists",
                    type: "Generic List",
                    serverTemp: "100",
                    bucket: [],
                    common: true
                },
                {
                    display: "Document Libraries",
                    type: "Document Library",
                    serverTemp: "101",
                    bucket: [],
                    common: true
                },
                {
                    display: "Surveys",
                    type: "Survey",
                    serverTemp: "102",
                    bucket: [],
                    common: true
                },
                {
                    display: "Links Lists",
                    type: "Links List",
                    serverTemp: "103",
                    bucket: [],
                    common: false
                },
                {
                    display: "Announcements Lists",
                    type: "Annoucements List",
                    serverTemp: "104",
                    bucket: [],
                    common: false
                },
                {
                    display: "Contacts Lists",
                    type: "Contacts List",
                    serverTemp: "105",
                    bucket: [],
                    common: false
                },
                {
                    display: "Events Lists",
                    type: "Events List",
                    serverTemp: "106",
                    bucket: [],
                    common: false
                },
                {
                    display: "Tasks Lists",
                    type: "Tasks List",
                    serverTemp: "107",
                    bucket: [],
                    common: false
                },
                {
                    display: "Discussion Boards",
                    type: "Discussion Board",
                    serverTemp: "108",
                    bucket: [],
                    common: false
                },
                {
                    display: "Picture Libraries",
                    type: "Picture Library",
                    serverTemp: "109",
                    bucket: [],
                    common: true
                },
                {
                    display: "Data Sources",
                    type: "Data Sources",
                    serverTemp: "110",
                    bucket: [],
                    common: false
                },
                {
                    display: "Site Template Galleries",
                    type: "Site Template Gallery",
                    serverTemp: "111",
                    bucket: [],
                    common: false
                },
                {
                    display: "User Information Lists",
                    type: "User Information List",
                    serverTemp: "112",
                    bucket: [],
                    common: true
                },
                {
                    display: "Web Part Galleries",
                    type: "Web Part Gallery",
                    serverTemp: "113",
                    bucket: [],
                    common: false
                },
                {
                    display: "List Template Galleries",
                    type: "List Template Gallery",
                    serverTemp: "114",
                    bucket: [],
                    common: false
                },
                {
                    display: "XML Form Libraries",
                    type: "XML Form Library",
                    serverTemp: "115",
                    bucket: [],
                    common: false
                },
                {
                    display: "Master Pages Galleries",
                    type: "Master Pages Gallery",
                    serverTemp: "116",
                    bucket: [],
                    common: false
                },
                {
                    display: "No-Code Workflows",
                    type: "No-Code Workflows",
                    serverTemp: "117",
                    bucket: [],
                    common: false
                },
                {
                    display: "Custom Workflow Processes",
                    type: "Custom Workflow Process",
                    serverTemp: "118",
                    bucket: [],
                    common: false
                },
                {
                    display: "Wiki Page Libraries",
                    type: "Wiki Page Library",
                    serverTemp: "119",
                    bucket: [],
                    common: false
                },
                {
                    display: "Custom Grids for Lists",
                    type: "Custom Grid for a List",
                    serverTemp: "120",
                    bucket: [],
                    common: false
                },
                {
                    display: "Data Connection Libraries",
                    type: "Data Connection Library",
                    serverTemp: "130",
                    bucket: [],
                    common: false
                },
                {
                    display: "Workflow Histories",
                    type: "Workflow History",
                    serverTemp: "140",
                    bucket: [],
                    common: false
                },
                {
                    display: "Gantt Tasks Lists",
                    type: "Gantt Tasks List",
                    serverTemp: "150",
                    bucket: [],
                    common: false
                },
                {
                    display: "Meeting Series Lists",
                    type: "Meeting Series List",
                    serverTemp: "200",
                    bucket: [],
                    common: false
                },
                {
                    display: "Meeting Agenda Lists",
                    type: "Meeting Agenda List",
                    serverTemp: "201",
                    bucket: [],
                    common: false
                },
                {
                    display: "Meeting Attendees Lists",
                    type: "Meeting Attendees List",
                    serverTemp: "202",
                    bucket: [],
                    common: false
                },
                {
                    display: "Meeting Decisions Lists",
                    type: "Meeting Decisions List",
                    serverTemp: "204",
                    bucket: [],
                    common: false
                },
                {
                    display: "Meeting Objectives Lists",
                    type: "Meeting Objectives List",
                    serverTemp: "207",
                    bucket: [],
                    common: false
                },
                {
                    display: "Meeting Text Boxes",
                    type: "Meeting Text Box",
                    serverTemp: "210",
                    bucket: [],
                    common: false
                },
                {
                    display: "Meeting Things-To-Bring Lists",
                    type: "Meeting Things To Bring List",
                    serverTemp: "211",
                    bucket: [],
                    common: false
                },
                {
                    display: "Meeting Workspace Pages Lists",
                    type: "Meeting Workspace Pages List",
                    serverTemp: "212",
                    bucket: [],
                    common: false
                },
                {
                    display: "Portal Sites Lists",
                    type: "Portal Sites List",
                    serverTemp: "300",
                    bucket: [],
                    common: false
                },
                {
                    display: "Blog Posts Lists",
                    type: "Blog Posts List",
                    serverTemp: "301",
                    bucket: [],
                    common: false
                },
                {
                    display: "Blog Comments Lists",
                    type: "Blog Comments List",
                    serverTemp: "302",
                    bucket: [],
                    common: false
                },
                {
                    display: "Blog Categories Lists",
                    type: "Blog Categories List",
                    serverTemp: "303",
                    bucket: [],
                    common: false
                },
                {
                    display: "Page Libraries",
                    type: "Page Library",
                    serverTemp: "850",
                    bucket: [],
                    common: false
                },
                {
                    display: "Issue Tracking",
                    type: "Issue Tracking",
                    serverTemp: "1100",
                    bucket: [],
                    common: false
                },
                {
                    display: "Administrator Tasks Lists",
                    type: "Administrator Tasks List",
                    serverTemp: "1200",
                    bucket: [],
                    common: false
                },
                {
                    display: "Personal Document Libraries",
                    type: "Personal Document Library",
                    serverTemp: "2002",
                    bucket: [],
                    common: false
                },
                {
                    display: "Private Document Libraries",
                    type: "Private Document Library",
                    serverTemp: "2003",
                    bucket: [],
                    common: false
                }
            ];
        
        
        function selectField(item, column){
            var field = item.data.field,
                list = item.data.list;
                
            UI.tabs.add({
                title: "Field",
                content:
                    "<table>" +
                        "<tr>" +
                            "<td class='listTable-side'>" +
                                "<div class='listMenu'>" +
                                    "<table class='listMenu'>" +
                                        "<tr><td onclick='SPCOM.link(\"" + siteUrl + "/_layouts/FldEdit.aspx?List=" + encodeURIComponent(list.id) + "&Field=" + field.name + "\")'>Settings</td></tr>" +
                                    "</table>" +
                                "</div>" +
                            "</td>" +
                            "<td class='listTable-main'><div class='listMenu'>" +
                                "<h1 class='listMenu'>" + field.displayName + "</h1>" +
                                "<table class='listStats'>" + 
                                    "<tr><td>Name: <input type='text' value='" + field.name + "' /></td><td>M1SP: <input type='text' value='" + field.name.replace(/_x0020_/g, "") + "' /></td></tr>" +
                                    "<tr><td>Type: " + field.type + "</td><td>Required: " + ((field.required) ? "True" : "False") + "</td></tr>" +
                                    "<tr><td>Primary Key: " + ((field.primary) ? "True" : "False") + "</td><td>ColName: " + ((field.colName !== undefined) ? field.colName : "") + "</td></tr>" +
                                    "<tr><td>Read Only: " + ((field.readOnly) ? "True" : "False") + "</td><td></td></tr>" +
                                "</table>" +
                            "</div></td>" +
                        "</tr>" +
                    "</table>"
            });
        }
        
        function selectList(item, column){
            UI.tabs.clear();
            UI.tabs.drawTabs();
            for (var i = 0; i < types.length; i++){
                var list = types[i].bucket[item.data.list.title];
                if (list !== undefined){
                    var addArr = []
                    for (var id in list.fields){
                        addArr.push({item: {title: list.fields[id].displayName, field: list.fields[id], list: list}, action: selectField});
                    }
                    UI.right.startNew(addArr, false, function(data){
                        data.parentColumn.items.push(data.obj);
                        /*data.parentColumn.items.sort(function(a, b){
                            if (a.title < b.title) return -1;
                            else if (b.title < a.title) return 1;
                            else return 0;
                        });*/
                    });
                    UI.tabs.add({
                        title: "List",
                        content:
                            "<table>" +
                                "<tr>" +
                                    "<td class='listTable-side'>" +
                                        "<div class='listMenu'>" +
                                            "<table class='listMenu'>" +
                                                "<tr><td onclick='SPCOM.link(\"" + siteUrl + "/_layouts/listedit.aspx?List=" + encodeURIComponent(list.id) + "\")'>Settings</td></tr>" +
                                                "<tr><td onclick='SPCOM.link(\"" + siteUrl + "/_layouts/fldNew.aspx?List=" + encodeURIComponent(list.id) + "\")'>Create Column</td></tr>" +
                                                "<tr><td onclick='SPCOM.listQuery.init(\"" + list.title + "\")'>Query</td></tr>" +
                                            "</table>" +
                                        "</div>" +
                                    "</td>" +
                                    "<td class='listTable-main'><div class='listMenu'>" +
                                        "<h1 class='listMenu'>" + list.title + ((list.imgUrl !== "") ? " <img onclick='SPCOM.link(\"" + ((list.root === "") ? list.baseUrl : list.root) + "AllItems.aspx\")' src='" + list.imgUrl + "' class='listMenu' />" : "") + "</h1>" +
                                        "<h3 class='listMenu'>" + list.desc + "</h3>" +
                                        "<table class='listStats'>" + 
                                            "<tr><td>Item Count: " + list.itemCount + "</td><td>Hidden: " + ((list.hidden) ? "True" : "False") + "</td></tr>" +
                                            "<tr><td>Created: " + convertDate(list.created) + "</td><td>Modified: " + convertDate(list.modified) + "</td></tr>" +
                                            "<tr><td>Versioning Enabled: " + ((list.enableVersion) ? "True" : "False") + "</td><td>Version: " + list.version + "</td></tr>" +
                                            "<tr><td>Allow Deletion: " + ((list.allowDeletion) ? "True" : "False") + "</td><td>Attachments Enabled: " + ((list.enableAttachments) ? "True" : "False") + "</td></tr>" +
                                            "<tr><td>Show Users: " + ((list.showUsers) ? "True" : "False") + "</td><td>Ordered: " + ((list.ordered) ? "True" : "False") + "</td></tr>" +
                                        "</table>" +
                                    "</div></td>" +
                                "</tr>" +
                            "</table>"
                    });
                    break;
                }
            }
            
        }
        
        function selectType(item, column){
            var addArr = [];
            UI.tabs.clear();
            for (var id in item.data.type.bucket){
                var thisUrl = ((item.data.type.bucket[id].root === "") ? item.data.type.bucket[id].baseUrl : item.data.type.bucket[id].root) + "AllItems.aspx";
                addArr.push({item: {title: item.data.type.bucket[id].title, list: item.data.type.bucket[id], url: thisUrl}, action: selectList});
            }
            UI.middle.startNew(addArr, true);
        }
        
        function selectPages(item, column){
            var addArr = [];
            sortPages();
            UI.tabs.clear();
            for (var i = 0; i < pages.length; i++){
                addArr.push({item: {title: pages[i].title, url: pages[i].url}, action: function(item, column){
                    link(item.data.url);
                }});
            }
            UI.middle.startNew(addArr);
        }
	
	function clearBuckets(){
	    for (var i = 0; i < types.length; i++){
		types[i].bucket = [];
	    }
	}
        
        function init(){
            var addArr = [];
            
            types.sort(function(a, b){
                if (a.common && !b.common) return -1;
                else if (!a.common && b.common) return 1;
                else return 0;
            });
            
            addArr.push({item: {title: "Pages"}, action: selectPages});
            for (var i = 0; i < types.length; i++){
                //Makes sure there's at least 1 list in bucket
                for (var id in types[i].bucket){
                    addArr.push({item: {title: types[i].display, type:types[i]}, action: selectType});
                    break;
                }
            }
            UI.left.startNew(addArr);
        }
        
        return{
	    clearBuckets: clearBuckets,
            selectType: selectType,
            selectPages: selectPages,
            selectList: selectList,
            selectField: selectField,
            types: types,
            init: init
        }
    })();
    
    var listQuery = (function(){
        var list;
        
        var close = function(){
            $("#spcom").show();
            $("#listQuery").hide();
        }
	
	var checkAll = function(){
	    if ($("#lqCheckAll").is(":checked")){
		$("input[name='lqChecks']").each(function(){
		    $(this).prop("checked", true);
		});
	    }
	    else{
		$("input[name='lqChecks']").each(function(){
		    $(this).prop("checked", false);
		});
	    }
	}
	
	var deleteItems = function(){
	    var batch,
		index = 0;
	    
	    if (!confirm("Are you sure you want to delete these items?")) return;
	    
	    batch = "<Batch OnError='Continue'>\n";
	    $("input[name='lqChecks']").each(function(){
		if ($(this).is(":checked")){
		    batch += "<Method ID='" + (index++) + "' Cmd='Delete'>\n" +
			"<Field Name='ID'>" + $(this).val() + "</Field>\n" +
			"</Method>\n";
		}
	    });
	    batch += "</Batch>";
	    
	    $().SPCOMServices({
		operation: "UpdateListItems",
		listName: list.title,
		updates: batch,
		async: true,
		completefunc: function(xData, status){
		    run();
		}
	    });
	}
        
        var run = function(){
            var query = $("#listQuery textarea").val();
            $().SPCOMServices({
                operation: "GetListItems",
                listName: list.title,
                CAMLQuery: query,
                async: true,
                completefunc: function(xData, status){
                    var queryArr = {"Eq": [], "Neq": [], "Contains": [], "Gt": [], "Lt": [], "Geq": [], "Leq": [], "BeginsWith": []},
                        parsedQuery,
                        queryObj,
                        results = {items: []},
                        row;
                    
                    try{
                        parsedQuery = $.parseXML(query);
                    }
                    catch(e){
                        $("#listQueryResults tbody").html("Invalid XML.");
                        return;
                    }
                    queryObj = $(parsedQuery);
                    if ($(xData.responseXML).SPFilterNode("z:row")){
                        $(xData.responseXML).SPFilterNode("z:row").each(function(){
                            row = [];
                            $(this.attributes).each(function(){
                                row[this.name] = $(this).val();
                            });
                            results.items.push(row);
                        });
                    }
                    else{
                        $(xData.responseXML).find("[nodeName='z:row']").each(function(){
                            row = [];
                            $(this.attributes).each(function(){
                                row[this.name] = $(this).val();
                            });
                            results.items.push(row);
                        });
                    }
                    
                    for (var tag in queryArr){
                        queryObj.find(tag).each(function(){
                            var attr = "ows_" + $(this).find("FieldRef").attr("Name"),
                                targetValue = $(this).find("Value").text(),
                                itemArr = [],
                                condFunc;
                            
                            switch(tag){
                                case "Eq":
                                    condFunc = function(itemValue){
                                        if (itemValue !== undefined && itemValue === targetValue) return true;
                                        else return false;
                                    };
                                    break;
                                case "Neq":
                                    condFunc = function(itemValue){
                                        if (itemValue !== undefined && itemValue !== targetValue) return true;
                                        else return false;
                                    };
                                    break;
                                case "Contains":
                                    condFunc = function(itemValue){
                                        if (itemValue !== undefined && itemValue.indexOf(targetValue) > -1) return true;
                                        else return false;
                                    };
                                    break;
                                case "Gt":
                                    condFunc = function(itemValue){
					var itemDate,
					    targetDate,
					    itemFloat,
					    targetFloat;
					
					if (targetValue.indexOf("-") > -1){
					    targetDate = new Date(convertDate(targetDate));
					    itemDate = new Date(convertDate(targetDate));
					}
					else{
					    targetFloat = parseFloat(targetValue);
					    itemFloat = parseFloat(itemValue);
					}
					
                                        if (itemValue !== undefined && ((!isNaN(targetDate) && !isNaN(itemDate) && targetDate < itemDate) || (!isNaN(targetFloat) && !isNaN(itemFloat) && targetFloat < itemFloat))) return true;
                                        else return false;
                                    };
                                    break;
                                case "Lt":
                                    condFunc = function(itemValue){
                                        var itemDate,
					    targetDate,
					    itemFloat,
					    targetFloat;
					
					if (targetValue.indexOf("-") > -1){
					    targetDate = new Date(convertDate(targetDate));
					    itemDate = new Date(convertDate(targetDate));
					}
					else{
					    targetFloat = parseFloat(targetValue);
					    itemFloat = parseFloat(itemValue);
					}
					
                                        if (itemValue !== undefined && ((!isNaN(targetDate) && !isNaN(itemDate) && targetDate > itemDate) || (!isNaN(targetFloat) && !isNaN(itemFloat) && targetFloat > itemFloat))) return true;
                                        else return false;
                                    };
                                    break;
                                case "Geq":
                                    condFunc = function(itemValue){
                                        var itemDate,
					    targetDate,
					    itemFloat,
					    targetFloat;
					
					if (targetValue.indexOf("-") > -1){
					    targetDate = new Date(convertDate(targetDate));
					    itemDate = new Date(convertDate(targetDate));
					}
					else{
					    targetFloat = parseFloat(targetValue);
					    itemFloat = parseFloat(itemValue);
					}
					
                                        if (itemValue !== undefined && ((!isNaN(targetDate) && !isNaN(itemDate) && !(targetDate < itemDate)) || (!isNaN(targetFloat) && !isNaN(itemFloat) && targetFloat <= itemFloat))) return true;
                                        else return false;
                                    };
                                    break;
                                case "Leq":
                                    condFunc = function(itemValue){
                                        var itemDate,
					    targetDate,
					    itemFloat,
					    targetFloat;
					
					if (targetValue.indexOf("-") > -1){
					    targetDate = new Date(convertDate(targetDate));
					    itemDate = new Date(convertDate(targetDate));
					}
					else{
					    targetFloat = parseFloat(targetValue);
					    itemFloat = parseFloat(itemValue);
					}
					
                                        if (itemValue !== undefined && ((!isNaN(targetDate) && !isNaN(itemDate) && !(targetDate > itemDate)) || (!isNaN(targetFloat) && !isNaN(itemFloat) && targetFloat >= itemFloat))) return true;
                                        else return false;
                                    };
                                    break;
                                case "BeginsWith":
                                    condFunc = function(itemValue){
                                        if (itemValue !== undefined && itemValue.indexOf(targetValue) === 0) return true;
                                        else return false;
                                    };
                                    break;
                                default:
                                    condFunc = function(itemValue){
                                        return false;
                                    }
                                    break;
                            }
			    
                            for (var i = 0; i < results.items.length; i++){
                                if (condFunc(results.items[i][attr])) itemArr.push(results.items[i]);
                            }
                            
                            queryArr[tag].push({
                                attr: $(this).find("FieldRef").attr("Name"),
                                value: targetValue,
                                items: itemArr
                            });
                        });
                    }
                    
                    var html = "<tr><td><input type='checkbox' id='lqCheckAll' onclick='SPCOM.listQuery.checkAll()' /></td>";
                    for (var id in list.fields){
                        html += "<td>" + list.fields[id].displayName + "</td>";
                    }
                    html += "</tr>";
                    
                    $("#listQueryResults thead").html(html);
                    html = "";
                    for (var i = 0; i < results.items.length; i++){
                        html += "<tr><td><input type='checkbox' name='lqChecks' value='" + results.items[i].ows_ID + "' /></td>";
                        for (var id in list.fields){
                            if(list.fields[id].name === "Title" || list.fields[id].name.indexOf("LinkTitle") > -1){
                                html += "<td><a href='javascript:SPCOM.link(\"" + list.baseUrl + "DispForm.aspx?ID=" + results.items[i].ows_ID + "\");'>" + ((results.items[i]["ows_Title"] === undefined) ? "Link" : results.items[i]["ows_Title"]) + "</a></td>";
                            }
                            else{
                                html += "<td>" + ((results.items[i]["ows_" + list.fields[id].name] === undefined) ? "&nbsp;" : results.items[i]["ows_" + list.fields[id].name]) + "</td>";
                            }
                        }
                        html += "</tr>";
                    }
                    $("#listQueryResults tbody").html(html);
                    
                    html = "<table class='listQueryStats' cellspacing='0px'><tr><td><h3>Item Counts</h3></td><td><span class='label'>Total:</span> " + results.items.length + "</td></tr>";
                    var i = -1; 
                    for (var tag in queryArr){
                        for (var j = 0; j < queryArr[tag].length; j++){
                            if (++i % 2 === 0) html += "<tr>";
                            html += "<td><span class='label'>" + queryArr[tag][j].attr + " &lt;" + tag + "&gt; " + queryArr[tag][j].value + ":</span> " + queryArr[tag][j].items.length + "</td>";
                            if ((i + 1) % 2 === 0) html += "</tr>";
                        }
                    }
                    html += "</table>";
                    $("#listQueryStats").html(html);
                }
            })
        }
        
        var init = function(name){
            for (var type in lists.types){
                if (lists.types[type].bucket[name] !== undefined){
                    list = lists.types[type].bucket[name];
                    break;
                }
            }
            if (list !== undefined){
                $("#spcom").hide();
                $("#listQuery").show();
            }
        }
        
        return{
            close: close,
            init: init,
	    checkAll: checkAll,
	    deleteItems: deleteItems,
            run: run
        }
    })();
    
    function convertDate(date){
		if (date === undefined || typeof date !== "string") return date;
        if (date.indexOf("-") > -1){
            var dateArr = date.split(" ")[0].split("-");
            return dateArr[1] + "/" + dateArr[2] + "/" + dateArr[0] + " " + date.split(" ")[1];
        }
        else{
			try{
				var year = date.substr(0, 4);
				var month = date.substr(4, 2);
				var day = date.substr(6, 2);
				var time = date.split(" ")[1];
				return month + "/" + day + "/" + year + " " + time;
			}
            catch(e){
				return;
			}
        }
    }
    
    function loadingOut(msg){
        $("#loadingOutput").html(msg + "...");
    }
    
    function incrementLoadingBar(){
        $("#loadingBar").css("width", ((++listsCollected / (listCount * 2)) * 100) + "%");
    }
    
    function sortPages(){
        pages.sort(function(a, b){
            if (a.title < b.title) return -1;
            else if (a.title > b.title) return 1;
            else return 0;
        });
        /*for (var i = 0; i < additionalPages.length; i++){
            pages.unshift({
                url: siteUrl + "/" + additionalPages[i].url,
                title: additionalPages[i].title
            });
        }*/
    }
    
    function getItems(list){
        var type = undefined,
            fieldRef = "Title";
        
        //loadingOut("Smelling " + list);
        $("#status").html("Smelling " + list);
        for (var i = 0; i < types.length; i++){
            if (types[i].bucket[list] !== undefined){
                type = types[i];
                break;
            }
        }
        
        if (type.bucket[list].itemCount > MAX_LIST_SIZE){
            if (listArr.items.length > 0) getItems(listArr.items.splice(0, 1)[0]);
            else finishedLoading();
        }
        
        if (type.type === "Wiki Page Library") fieldRef = "FileLeafRef";
        
        $().SPCOMServices({
            operation: "GetListItems",
            listName: list,
            CAMLQuery: "<Query><Where><Neq><FieldRef Name='" + fieldRef + "' /><Value Type='Text'></Value></Neq></Where></Query>",
            CAMLQueryOptions: "<QueryOptions><ViewAttributes Scope='Recursive' /></QueryOptions>",
            async: true,
            completefunc: function(data, status){
                if (status === "success" && data !== undefined){
                    if ($().SPFilterNode !== undefined) {
                        $(data.responseXML).SPFilterNode("z:row").each(function(){
                            if ($(this).attr("ows_LinkFilename") !== undefined && $(this).attr("ows_LinkFilename").indexOf(".aspx") > -1){
                                pages.push({
                                    url: "/" + $(this).attr("ows_FileRef").split(";#")[1],
                                    title: $(this).attr("ows_LinkFilename")
                                });
                            }
                        });
                    }
                    else {
                        $(data.responseXML).find("[nodeName='z:row']").each(function(){
                            if ($(this).attr("ows_LinkFilename") !== undefined && $(this).attr("ows_LinkFilename").indexOf(".aspx") > -1){
                                pages.push({
                                    url: "/" + $(this).attr("ows_FileRef").split(";#")[1],
                                    title: $(this).attr("ows_LinkFilename")
                                });
                            }
                        });
                    }
                }
                
                incrementLoadingBar()
                if (listArr.items.length > 0) getItems(listArr.items.splice(0, 1)[0]);
                else if (listArr.lists.length > 0) getList(listArr.lists.splice(0, 1)[0]);
                else finishedLoading();
            }
        });
    }
    
    function getList(list){
        //loadingOut("Eyeing " + list);
        $("#status").html("Eyeing " + list);
        $().SPCOMServices({
            operation: "GetList",
            listName: list,
            async: true,
            completefunc: function(data, status){
                if (status === "success" && data !== undefined){
                    var list = $(data.responseXML).find("List"),
                        type;
                    
                    for (var i = 0; i < types.length; i++){
                        if (types[i].bucket[list.attr("Title")] !== undefined){
                            type = types[i];
                            break;
                        }
                    }
                    
                    if (type !== undefined){
                        $(data.responseXML).find("Fields > Field").each(function(){
                            var field = $(this);
                            type.bucket[list.attr("Title")].fields[field.attr("DisplayName")] = {
                                name: field.attr("Name"),
                                displayName: field.attr("DisplayName"),
                                type: field.attr("Type"),
                                primary: ((field.attr("PrimaryKey") === "TRUE") ? true : false),
                                required: ((field.attr("Required") === "TRUE") ? true : false),
                                readOnly: ((field.attr("ReadOnly") === "TRUE") ? true : false),
                                colName: field.attr("ColName")
                            };
                        });
                    }
                }
                
                incrementLoadingBar()
                if (listArr.lists.length > 0) getList(listArr.lists.splice(0, 1)[0]);
                else finishedLoading();
            }
        });
    }
    
    function finishedLoading(){
        $("#status").hide();
        if (finishedLoadingRan) return;
        finishedLoadingRan = true;
        //loadingOut("Waking the giant");
        //UI.init();
        //lists.init();
        //$("#loading").hide();
        //$("#spcom").show();
    }
    
    function startLoading(){
	lists.clearBuckets();
        UI.init();
	
        UI.left.startNew([{item: {title: "Pages"}, action: lists.selectPages}]);
        $("#spcom").show();
        $("#status").show();
        siteUrl = $().SPCOMServices.SPGetCurrentSite();
        $().SPCOMServices.defaults.webUrl = siteUrl;
        types = lists.types;
        //loadingOut("Collecting the list collection");
        $("#status").html("Collecting the list collection");
        //"Stalking" such and such is another good option...
        $().SPCOMServices({
            operation: "GetListCollection",
            async: true,
            completefunc: function(data, status){
                if (status === "success" && data !== undefined){
                    //loadingOut("Getting lists and list items");
                    $("#status").html("Getting lists and list items");
                    $(data.responseXML).find("Lists > List").each(function(){
                        listCount++;
                        var thisList = $(this);
                        for (var i = 0; i < types.length; i++){
                            if (types[i].serverTemp === thisList.attr("ServerTemplate")){
                                //Puts the lists(and doc libraries, etc.) in the bucket under they're respective type
                                
                                var firstRunForThisType = true;
                                for (var id in types[i].bucket){
                                    firstRunForThisType = false;
                                    break;
                                }
                                if (firstRunForThisType){
                                    UI.left.add({title: types[i].display, type: types[i]}, lists.selectType);
                                    UI.left.refresh();
                                }
                                
                                types[i].bucket[thisList.attr("Title")] = LIST(thisList);
                                
                                if (types[i].type === "Document Library" || types[i].type === "Wiki Page Library") listArr.items.push(thisList.attr("Title"));
                                listArr.lists.push(thisList.attr("Title"));
                                break;
                            }
                        }
                    });
					
                    if (listArr.items.length > 0) getItems(listArr.items.splice(0, 1)[0]);
                    else if (listArr.lists.length > 0) getLists(listArr.lists.splice(0, 1)[0]);
                    else finishedLoading();
                }
            }
        });
    }
    
    function link(url){
        PARENT_WINDOW.location.href = url;
        newPage();
    }
    
    function newPage(){
        PARENT_WINDOW.document.spcom = document.spcom;
        $(PARENT_WINDOW.document.body).append("<script type='text/javascript' href='http://joshrouwhorst.com/sp/tool/SPCOM-backDrop-0.2.0.js'></script>");
    }
    
    function startBroadcasting(){
        if (PARENT_WINDOW.document.SPCOM_SAT_DISH !== undefined){
            setInterval(function(){
                PARENT_WINDOW.document.SPCOM_SAT_DISH.reciever();
            }, 1000);
        }
    }
    
    function init(){
        siteUrl = $().SPCOMServices.SPGetCurrentSite();
        $().SPCOMServices.defaults.webUrl = siteUrl;
        
        var spcomHtml = "<div id='spcom'><div id='columns'><table id='columnsTable'><tr><td><div id='leftColumn'></div></td><td><div id='middleColumn'></div></td><td><div id='rightColumn'></div></td></tr></table></div><div id='viewArea'><div id='viewTabs'></div><div id='currentView'></div></div></div><script type='text/javascript'>SPCOM.startLoading();</script>";
        var listQueryHtml = "<div id='listQuery'><table class='listQuery'><tr><td class='listQuery'><textarea class='listQuery'></textarea></td><td><input type='button' value='Run' class='listQuery' onclick='SPCOM.listQuery.run()' /></td></tr></table><div id='listQueryResults'><div id='listQueryStats'></div><div id='listQueryRecords'><table cellspacing='0px'><thead></thead><tbody></tbody></table></div></div><div id='listQueryClose'><input type='button' value='Close' onclick='SPCOM.listQuery.close()' /> <input type='button' value='Delete' onclick='SPCOM.listQuery.deleteItems()' /></div></div>";
        $("body").append(spcomHtml + listQueryHtml);
    }
    
    return {
        link: link,
        startLoading: startLoading,
        startBroadcasting: startBroadcasting,
        UI: UI,
        init: init,
        version: version,
        listQuery: listQuery
    }
})();

function spLoading(){
    if (jQuery !== undefined && $ !== undefined && $().SPCOMServices !== undefined){
        SPCOM.init();
    }
    else{
        setTimeout(spLoading, 100);
    }
}

spLoading();

var LIST = function(record){
	var thisList = this;
	
	this.id = record.attr("ID");
	this.title = record.attr("Title");
	this.desc = ((record.attr("Description") === undefined) ? "" : record.attr("Description"));
	this.enableVersion = ((record.attr("EnableVersioning") === "True") ? true : false);
	this.version = record.attr("Version");
	this.hidden = ((record.attr("Hidden") === "True") ? true : false);
	this.itemCount = parseInt(record.attr("ItemCount"));
	this.ordered = ((record.attr("Ordered") === "True") ? true : false);
	this.defView = record.attr("DefaultViewUrl");
	this.root = record.attr("RootFolder");
	this.imgUrl = record.attr("ImageUrl");
	this.modified = record.attr("Modified");
	this.created = record.attr("Created");
	this.allowDeletion = record.attr("AllowDeletion");
	this.enableAttachments = ((record.attr("EnableAttachments") === "True") ? true : false);
	this.showUsers = ((record.attr("ShowUsers") === "True") ? true : false);
	this.baseUrl = ((types[i].type === "Document Library") ? siteUrl + "/" + record.attr("Title") + "/Forms/" : siteUrl + "/Lists/" + record.attr("Title") + "/");
	this.fields = [];
};