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
    name: "rok.FeedProcessor",
    kind: "enyo.Component",
    published: {
        data: ""
    },
    events: {
        onFinished: ""
    },
    create: function() {
        this.inherited(arguments);
    },
    calculateMinutes: function (time) {
        var timeArr = time.split(':');
        var tmp = Number(timeArr[0]) * 60;

        return tmp + Number(timeArr[1])
    },
    calculateStartEnding: function (minutes) {
        var minutes = Number(minutes);
        if (minutes <= 240) {
            
            return minutes + 1440
        } else {
            
            return minutes
        }
    },
    calculateEndHuman: function (startTime, duration, date) {
        var startTime = startTime.split(':');

        var dayDate = date.split('-'); //2011-08-13

        var dateObj = new Date(Number(dayDate[0]), Number(dayDate[1]) - 1, Number(dayDate[2]), Number(startTime[0]), Number(startTime[1]));
        var timeStamp = Number(dateObj.getTime());

        var timeStampMinutes = Number(timeStamp) / 1000 / 60;
        var tmpResult = Number(timeStampMinutes) + Number(duration);

        var resultObj = new Date();
        resultObj.setTime((tmpResult * 60) * 1000);

        var resultminutes;
        if (resultObj.getMinutes() < 10) {
            resultminutes = "0" + resultObj.getMinutes();
        } else {
            resultminutes = resultObj.getMinutes();
        }
        
        return resultObj.getHours() + ":" + resultminutes
    },
    dataChanged: function() {
        for (var day = 0; day < this.data.schedule.day.length; day++) {
            var date = this.data.schedule.day[day].date;
            for (var room = 0; room < this.data.schedule.day[day].room.length; room++) {
                for (var e in this.data.schedule.day[day].room[room]) {
                    if (e == 'event') {
                        if (typeof(this.data.schedule.day[day].room[room][e][0]) == 'undefined') {
                            var obj = this.data.schedule.day[day].room[room][e];
                            this.data.schedule.day[day].room[room][e] = [];
                            this.data.schedule.day[day].room[room][e][0] = {};
                            this.data.schedule.day[day].room[room][e][0] = obj;
                        }
                        for (var i in this.data.schedule.day[day].room[room][e]) {
                            this.data.schedule.day[day].room[room][e][i].startMinutes = this.calculateMinutes(this.data.schedule.day[day].room[room].event[i].start);
                            this.data.schedule.day[day].room[room][e][i].durationMinutes = this.calculateMinutes(this.data.schedule.day[day].room[room].event[i].duration);
                            this.data.schedule.day[day].room[room][e][i].endMinutes = this.data.schedule.day[day].room[room].event[i].startMinutes + this.data.schedule.day[day].room[room].event[i].durationMinutes;
                            this.data.schedule.day[day].room[room][e][i].end = this.calculateEndHuman(this.data.schedule.day[day].room[room].event[i].start, this.data.schedule.day[day].room[room].event[i].durationMinutes, date);
                            this.data.schedule.day[day].room[room][e][i].empty = false;
                        }
                    }
                }
                if ("undefined" == typeof(this.data.schedule.day[day].room[room].event)) {
                    this.data.schedule.day[day].room[room].event = [];
                    this.data.schedule.day[day].room[room].event[0] = {};
                    this.data.schedule.day[day].room[room].event[0].roomEmpty = true;
                }
            }
        }
        var countEmpty = 0;
        var emptyTimes = {};
        emptyTimes.schedule = {};
        emptyTimes.schedule.day = [];

//@todo: for in instead of combination of for() with try/catch
        for (var day = 0; day < this.data.schedule.day.length; day++) {
            emptyTimes.schedule.day[day] = {};
            emptyTimes.schedule.day[day].room = [];
            var date = this.data.schedule.day[day].date;
            for (var room = 0; room < this.data.schedule.day[day].room.length; room++) {
                emptyTimes.schedule.day[day].room[room] = {};
                emptyTimes.schedule.day[day].room[room].event = [];
                try {
                    for (var i = 0; i < (this.data.schedule.day[day].room[room].event.length - 1); i++) {
                        if (Number(this.data.schedule.day[day].room[room].event[i].endMinutes) < Number(this.data.schedule.day[day].room[room].event[i + 1].startMinutes)) {
                            emptyTimes.schedule.day[day].room[room].event[countEmpty] = {};
                            emptyTimes.schedule.day[day].room[room].event[countEmpty].startMinutes = this.data.schedule.day[day].room[room].event[i].endMinutes;
                            emptyTimes.schedule.day[day].room[room].event[countEmpty].endMinutes = this.data.schedule.day[day].room[room].event[i + 1].startMinutes;
                            emptyTimes.schedule.day[day].room[room].event[countEmpty].durationMinutes = Number(emptyTimes.schedule.day[day].room[room].event[countEmpty].endMinutes) - Number(emptyTimes.schedule.day[day].room[room].event[countEmpty].startMinutes);
                            emptyTimes.schedule.day[day].room[room].event[countEmpty].empty = true;
                            countEmpty++;
                        }
                    }
                } catch(e) {

                }
                try {
                    this.data.schedule.day[day].room[room].event = this.data.schedule.day[day].room[room].event.concat(emptyTimes.schedule.day[day].room[room].event);
                } catch(e) {

                }
                try {
                    this.data.schedule.day[day].room[room].event.sort(function(a, b) {
                        return a.startMinutes - b.startMinutes
                    });

                } catch(e) {

                }
            }
        }
        this.doFinished();
    }//end dataChanged
});
