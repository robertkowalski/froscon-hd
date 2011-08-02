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
    name: "rok.Event",
    kind: enyo.Control,
    published: {
        eventInfo: {}
    },
    events: {
        onCancel: ""
    },
    components: [
        {layoutKind: "VFlexLayout", style: "height: 600px;", components: [
            {flex:1, width: "700px", height:"500px", kind: "FadeScroller", autoHorizontal: false, horizontal: false, autoVertical:true, vertical: true, components:[
                {kind: "VFlexBox", flex: 1, components: [
                    {kind: "HFlexBox", style: "padding-top: 6px;", components: [
                        {name: "type", content: "", style: "font-size: 23px; padding: 6px;"},
                        {kind: "Spacer"},
                        {name: "language", content: "", style: "font-size: 23px; padding: 6px;"}
                    ]},
                    {kind: "HFlexBox", style: "padding-top: 6px;", components: [
                        {name: "time", content: "", style: "font-size: 23px; padding: 6px;"},
                        {kind: "Spacer"},
                        {name: "track", content: "", style: "font-size: 23px; padding: 6px;"}
                    ]},
                    {name: "title", content: "", className: "", style: "font-size: 26px; padding: 6px;"},
                    {name: "subtitle", content: "", className: " italic", style: "font-size: 26px; padding: 6px;"},
                    {kind: "VFlexBox", style: "padding-top: 6px;", components: [
                        {name: "abstract", content: "", style: "font-size: 23px; padding: 6px;"}
                    ]},
                    {name: "persons", content: "", className: "", style: "padding-top:10px; font-size: 23px; padding: 6px;"},
                ]},

            ]},
            {style: "padding-top: 6px; padding-bottom: 50px", components: [
                {kind: "Button",  caption: "OK", onclick: "doCancel"}
            ]}
        ]}
    ],
    create: function() {
        this.inherited(arguments);
    },
    rendered: function() {
        this.inherited(arguments);
        this.eventInfoChanged();
    },
    eventInfoChanged: function () {
        this.$.language.setContent(this.eventInfo.language);

        this.$.time.setContent(this.eventInfo.start + " - " + this.eventInfo.end);
        this.$.track.setContent(this.eventInfo.track);

        this.$.title.setContent(this.eventInfo.title);
        this.$.abstract.setContent(this.eventInfo.abstract);

        var names = [];
        var counter = 0;
        try {
            for (var i in this.eventInfo.persons.person) {
                if (typeof(this.eventInfo.persons.person[i]) == "string") {
                    names[0] = this.eventInfo.persons.person['#text'];
                } else if (typeof(this.eventInfo.persons.person[i]) == "object") {
                    for (var k in this.eventInfo.persons.person[i]) {
                        if (k == '#text') {
                            names[counter] = this.eventInfo.persons.person[i][k];
                            counter++;
                        }
                    }
                }
            }
            names = names.join(', ');
            this.$.persons.setContent(names);
        } catch(e) {

        }
    }
});