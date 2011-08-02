/*

Copyright (c) 2011, R. Kowalski
All rights reserved.


Redistribution and use in source and binary forms, 
with or without modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, 
  this list of conditions and the following disclaimer.
  
* Redistributions in binary form must reproduce the above copyright notice, 
  this list of conditions and the following disclaimer in the documentation and/or other materials provided 
  with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, 
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, 
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, 
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) 
HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, 
STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING 
IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

enyo.kind({
    name: "Main",
    kind: enyo.VFlexBox,
    components: [

        {kind: "AppMenu", components: [
            {kind: "EditMenu"},
            {caption: "About", onclick: "showPopup", popup: "aboutPopup"}
        ]},
        {kind: "PageHeader", className: "headerlogoheight logo"},
        {name: "errorDialog", kind: "Dialog", lazy: false, components: [
            {name: "headline", style: "font-size: 20px; padding: 12px", content: "Error!"},
            {name: "errorMessage", style: "padding: 12px", content: ""},
            {kind: "Button", caption: "Close", onclick: "closeDialog"}
        ]},
        
        {name: "slidingPane", kind: "SlidingPane", flex: 1, onSelectView: "", components: [
            {name: "left", width: "320px", layoutKind: "VFlexLayout", components: [
                {className: "normal_enyo-header-inner", name: "dayHeader", kind: "Header", content: "Day 1"},
                {name: "dayScroller", kind: "Scroller", flex: 1, components: [

                ]},
                {kind: "Toolbar"}
            ]},

            {onResize: "", components: [
                {flex:1, kind: "Scroller", accelerated: true, autoHorizontal: true, horizontal: true, components: [
                    {kind: "rok.PaneView", name: "rooms", headerContent: "", onGo: "next", flex: 1, components: [

                    ]}
                ]},
                {kind: "Toolbar", components: [
                    {kind: "GrabButton"},
                    {caption: "Toggle Fullscreen", onclick: "next"}
                ]}
            ]},
        ]},

        {name: "aboutPopup", kind: "Popup", dismissWithClick: false, components: [
            {flex:1, kind: "rok.About", onCancel: "closePopup", authorInfo: "by R. Kowalski"}
        ]},
        {lazy: false, height: "600px", name: "eventInfoPopup", kind: "Popup", dismissWithClick: false, components: [
            {name: "eventInfo", kind: "rok.Event", onCancel: "closePopup"}
        ]},

        //Controls
        {name: "feedProcessor",
            kind: "rok.FeedProcessor",
            onFinished: "buildComponents",
            data: ""

        },

        //Services
        {name: "getConnMgrStatus",
            kind: "PalmService",
            service: "palm://com.palm.connectionmanager/",
            method: "getStatus",
            onSuccess: "statusFinished",
            onFailure: "statusFail",
            onResponse: "",
            subscribe: true
        },
    ],
    create: function() {
        this.inherited(arguments);
        this.getNetworkStatus();

        this.dayData = [];
    },
    rendered: function() {
        this.inherited(arguments);
    },
    showErrorMsg: function(msg) {
        this.$.errorMessage.setContent(msg);
        this.$.errorDialog.open();
    },
    closeDialog: function() {
        this.$.errorDialog.close();
    },
    showPopup: function (inSender, inEvent, inRowIndex) {
        var p = this.$[inSender.popup];
        if (inSender.popup == "eventInfoPopup") {
            try {
                if (!this.data.schedule.day[inSender.day].room[inSender.room].event[inRowIndex].empty) {
                    this.$.eventInfo.setEventInfo(this.data.schedule.day[inSender.day].room[inSender.room].event[inRowIndex]);
                    p.openAtCenter();
                }
            } catch(e) {

            }
        } else if (p) {
            p.openAtCenter();
        }
    },
    closePopup: function(inSender) {
        inSender.container.close();
    },
    //Service Methods
    statusFinished : function(inSender, inResponse) {
        if (this.checkState(inResponse)) {
            this.showErrorMsg('Please enable your Internet Connection');
            //this.$.spinner.hide();

        } else {
            //this.$.spinner.show();
            this.getFeed();
        }
    },
    checkState: function(response) {
        var state = "disconnected";
        if (((response.wifi.state == state && response.wifi.onInternet == "no") && response.wan.state == state ) || response.isInternetConnectionAvailable === false) {
            return true;
        } else {
            return false;
        }
    },
    statusFail: function(inSender, inResponse) {
        this.showErrorMsg('Please enable the Internet Connection');
    },
    getNetworkStatus: function(inSender, inResponse) {
        this.$.getConnMgrStatus.call({ "subscribe": true });
    },
    gotResultsFailure: function(inSender, inResponse) {
        this.showErrorMsg('Feed Failure');
    },
    getFeed: function() {
        var url = "http://programm.froscon.org/2011/schedule.xml";
        var http = new JKL.ParseXML(url);
        this.data = http.parse();
        this.$.feedProcessor.setData(this.data);
    },
    buildComponents: function () {
        this.$.dayScroller.destroyControls();

        this.buttonNames = [];
        for (var i = 0; i < this.data.schedule.day.length; i++) {
            this.buttonNames[i] = "button" + i;
            if (i == 0) {
                this.$.dayScroller.createComponent({name: "button" + i, owner:this, kind: "rok.ButtonItem", depressed: true, day: i, caption: this.data.schedule.day[i].date, className: "enyo-first", onclick: "buttonItemClick"});
            } else {
                this.$.dayScroller.createComponent({name: "button" + i, owner:this, kind: "rok.ButtonItem", depressed: false, day: i, caption: this.data.schedule.day[i].date, className: "enyo-first", onclick: "buttonItemClick"});
            }
        }
        this.$.dayScroller.render();
        this.$.rooms.setStyle("width: " + (110+(this.data.schedule.day[0].room.length) * 320) + "px");
        
        var html = "";
        for (var i = 0; i < this.data.schedule.day[0].room.length; i++) {
            this.$.rooms.createComponent({flex: 1, style:"width:320px; float:left;",
                name: "dayList" + i, owner: this, kind: "VirtualRepeater", onSetupRow: "listSetupRow",
                className: "list", components: [
                    {owner:this, name: "EventItem" + i, kind: "EventItem",
                        className: "item", popup: "eventInfoPopup", day: 0, room: i,
                        onEntryClick: "showPopup", components: [
                    ]}
                ]});


            this.room = i;
            this.dayData = this.data.schedule.day[0].room[i].event;
            this.$["dayList" + i].render();
            
            html += "<div style='width: 320px; text-align:center; float: left;'>" + this.data.schedule.day[0].room[i].name + "</div>";
            
        }
        this.$.rooms.setHeaderContent(html);
    },
    next: function() {
        this.$.slidingPane.next();
    },
    buttonItemClick: function(inSender) {
        this.humanDay = inSender.day + 1;

        for (var i = 0; i < this.buttonNames.length; i++) {
            if (inSender.name != this.buttonNames[i]) {
                this.$[this.buttonNames[i]].setDepressed(false);
            } else {
                this.$[inSender.name].setDepressed(true);
            }
        }

        this.$.dayHeader.setContent("Day " + this.humanDay);

        var html = "";
        for (var i = 0; i < this.data.schedule.day[inSender.day].room.length; i++) {

            html += "<div style='width: 320px; text-align:center; float: left;'>" + this.data.schedule.day[inSender.day].room[i].name + "</div>";


            this.room = i;
            this.dayData = this.data.schedule.day[inSender.day].room[i].event;
            this.$["dayList" + i].render();

        }
        this.$.rooms.setStyle("width: " + (110+(this.data.schedule.day[inSender.day].room.length) * 320) + "px");
        this.$.rooms.setHeaderContent(html);
    },
    backHandler: function(inSender, e) {
        this.$.slidingPane.back(e);
    },
    listSetupRow: function(inSender, inIndex) {
        //console.log(inSender.name)
        try {
            var record = this.dayData[inIndex];
        } catch(e) {
            var record = this.dayData;
        }

        if (record) {
            this.$['EventItem' + this.room].setEntry(record);
            return true;
        }
    },

});

/*
 * 
 [{"name":"HS1/2","event":[{"id":"681","start":"10:00","duration":"01:00","room":"HS1/2",
 "slug":"hs1_2_-_2011-08-20_10:00_-_gnome_3_-_ein_blick_in_die_zukunft_-_hendrik_richter_-_681",
 "title":"GNOME 3 - Ein Blick in die Zukunft","track":"Desktop","type":"lecture","language":"DE",
 "abstract":"Am 6. April wurde nach mehrjÃ¤hriger Entwicklungsarbeit Version 3.0 der freien Arbeitsumgebung GNOME verÃ¶ffentlicht.
 Dieser Vortrag zeigt, welche Ãberlegungen hinter den vielfÃ¤ltigen Ãnderungen stecken und gibt einen Ãberblick der geplanten Neuerungen
 fÃ¼r GNOME 3.2, das im Oktober erscheinen wird. Zu guter Letzt wird ein Blick in die Zukunft der 3.x-Reihe gewagt, der viele spannende Ideen aufzeigt.","
 persons":{"person":{"id":"247","#text":"Hendrik Richter"}},"links":{"link":{"href":"http://gnome3.org/index.html.de","#text":"GNOME 3.0"}}},
 {"id":"685","start":"11:15","duration":"01:00","room":"HS1/2","slug":"hs1_2_-_2011-08-20_11:15 
 * 
 */

