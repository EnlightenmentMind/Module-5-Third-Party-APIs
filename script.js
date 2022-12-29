"use strict";

// Limit how many hours should be showing on the Time Blocks.
var availableHours = [9, 10, 11, 12, 13, 14, 15, 16, 17, ];

// When all files have been loaded.
$(window).bind("load", function() {
    onLoaded();
});

function onLoaded() {
    showCurrentDate();
    createTimeBlockFrame();
    createTimeBlocks();
    retrieveSavedEvent();
    cssUpdate();
}

// Update the current date on the title
function showCurrentDate() {
    var currentDateElem = document.getElementById('currentDay');
    currentDateElem.innerHTML = moment().format('dddd, MMMM Do');
}

// Create div(Time Block) for all rows
function createTimeBlockFrame() {
    var container = document.getElementsByClassName('container')[0];
    var timeBlock = document.createElement("div");
    timeBlock.className = "time-block";
    container.appendChild(timeBlock);
}

// Create rows based on <availableHours> defined on the top
function createTimeBlocks() {
    var timeBlock = document.getElementsByClassName('time-block')[0];

    for (var i = 0; i < availableHours.length; i++) {
        var row = buildRowByHour(availableHours[i]);
        timeBlock.appendChild(row);
    }
}

// Create row by hours (availableHours)
function buildRowByHour(hourIn24) {
    // Create Row with className "row"
    var row = document.createElement("div");
    row.className = "row";

    // Create Hour Indicator
    var hourIndicator = document.createElement("div");
    row.appendChild(hourIndicator);
    hourIndicator.className = "col-md-1 hour";
    hourIndicator.innerHTML = moment(hourIn24, ["HH"]).format("h A");

    // Create Event Input
    var eventInput = document.createElement("input");
    row.appendChild(eventInput);
    // Check time is past, present or future
    var currentHour = moment().hour();
    var tenseString = "";
    if (hourIn24 < currentHour) {
        tenseString = "past";
    } else if (hourIn24 == currentHour) {
        tenseString = "present";
    } else {
        tenseString = "future";
    }

    eventInput.className = "col-md-10 " + tenseString;
    eventInput.id = "event_" + generateEventBaseKey(hourIn24);
    eventInput.style = "box-sizing: border-box; border: 2px solid #ccc; outline: none; color:#000"

    // Create Button
    var saveBtn = document.createElement("button");
    row.appendChild(saveBtn);    
    saveBtn.className = "col-md-1 saveBtn";
    saveBtn.id = generateEventBaseKey(hourIn24);
    var saveBtnText = document.createElement("i");
    saveBtnText.innerText = " Save ";
    saveBtn.appendChild(saveBtnText);
    saveBtn.onclick = function() {
        var eventInputId = 'event_' + this.id + "";
        var eventInputText = document.getElementById(eventInputId).value;
        localStorage.setItem(eventInputId, eventInputText);
    }

    return row;
}

// Use this for getting elements of eventInput and saveButton
function generateEventBaseKey(hourIn24) {
    var key = moment().format('YYYY-MMM-Do-') + hourIn24; // event_2022-Dec-28th-15
    return key;
}

// Update current data in local storage and display them on the time blocks.
function retrieveSavedEvent() {
    for (var i = 0; i < availableHours.length; i++) {
        var eventInputId = "event_" + generateEventBaseKey(availableHours[i]);
        var eventInputText = localStorage.getItem(eventInputId);
        document.getElementById(eventInputId).value = eventInputText;
    }    
}

// Use JQuery to update event input border color style
function cssUpdate() {
    $('input').focus(function(){
        $(this).css('border','2px solid #0000ff');
    });
    $('input').blur(function(){
        $(this).css('box-sizing', 'border-box');
        $(this).css('border', '2px solid #ccc');
        $(this).css('outline', 'none;3px solid #000000');
    }); 
}