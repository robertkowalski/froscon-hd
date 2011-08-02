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
    name: "EventItem",
    kind: "HFlexBox",
    style: "width:320px;",
    events: {
        onEntryClick: "",
        onEntryHold: ""
    },
    published: {
        entry: ""
    },
    factor: 3.8,
    components: [
        {className: "", name: "item", kind: "Item", layoutKind: "HFlexLayout", onclick: "doEntryClick", flex: 1, tapHighlight: true, style: "padding-right: 5px;", components: [
            {name: "text", allowHtml: true, flex: 1, className: ""}
        ]}
    ],
    entryChanged: function() {

        var length = this.factor * (Number(this.entry.durationMinutes));

        var names = [];
        var counter = 0;
        try {
            for (var i in this.entry.persons.person) {
                if (typeof(this.entry.persons.person[i]) == "string") {
                    names[0] = this.entry.persons.person['#text'];
                } else if (typeof(this.entry.persons.person[i]) == "object") {
                    for (var k in this.entry.persons.person[i]) {
                        if (k == '#text') {
                            names[counter] = this.entry.persons.person[i][k];
                            counter++;
                        }
                    }
                }
            }
            names = names.join(', ');
        } catch(e) {

        }

        //10 uhr start - 6000min
        if (!this.entry.empty && !this.entry.roomEmpty) {
            var content = "<div style='height:" + length + "px; -webkit-border-radius: 30px; background-color:white; border:1px solid black;' class=''>";
            content += "<div style='padding-bottom:10px; padding-right:10px; padding-left:15px'>";

            content += "<div class=''>" + this.entry.start + " - " + this.entry.end + "</div>";
            content += "<div class='truncateCSS3'>" + this.entry.title + "</div>";
            if (this.entry.subtitle) {
                content += "<div class='truncateCSS3 italic'>" + this.entry.subtitle + "</div>";
            }
            content += "<div style='' class=''>" + names + "</div>";
            content += "</div>";
            content += "</div>";

        } else if (this.entry.roomEmpty) {
            var content = "<div style='' class=''>&nbsp;";

            content += "</div>";
        } else {
            var content = "<div style='height:" + length + "px; -webkit-border-radius: 30px; background-color:lightgreen; border:1px solid black;' class=''>";
            content += "<div style='padding-bottom:10px; padding-right:10px; padding-left:15px'>";

            content += "</div>";
            content += "</div>";
        }
        this.$.text.setContent(content);
    }
});
/*
 * 
 {"id":"806","start":"14:10","duration":"03:00","room":"FrogLabs 2","slug":"froglabs_2_-_2011-08-20_14:10_-_webdesign_fur_unersattliche_-_oliver_klee_-_806",
 "title":"Webdesign fÃ¼r UnersÃ¤ttliche","track":"Frog Labs (Kids Track)","type":"workshop","language":"DE",
 "abstract":"Wenn ihr nach dem Workshop \"Webdesign fÃ¼r Neugierige\" direkt noch mehr\nÃ¼ber Webdesign lernen mÃ¶chtet, seid ihr hier richtig.
 Auf diesem\nWorkshop werden wir weiter in HTML und CSS einsteigen, und ihr kÃ¶nnt\nweiter an euren Sites bauen. Den genauen Inhalt des Workshops bestimmt\n
 ihr auf dem Workshop selbst. :-)","persons":{"person":{"id":"549","#text":"Oliver Klee"}},"links":"\n"}
 * 
 */