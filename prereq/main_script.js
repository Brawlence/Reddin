"use strict";

var rainbowClass = document.getElementsByClassName("rbw"),
    currentHue = 0,
    hueAddition = 5,
    clickEvent = "ontouchstart" in window ? "touchend" : "click",
    classMethods = ["remove", "add"],
    rainbowTiming = 1000 / 25,
    stringArray = [ "Add more contrast",
                    "Remove additional contrast",
                    "Night mode",
                    "Regular mode",
                    "Switch to Serif",
                    "Return to Sans"];

function createControls() {
    var contrastDiv = document.createElement('div');
        contrastDiv.id = "contrast";
        contrastDiv.tabIndex = "3";
        contrastDiv.innerText = stringArray[0];

    var serifDiv = document.createElement('div');
        serifDiv.id = "serif";
        serifDiv.tabIndex = "4";
        serifDiv.innerText = stringArray[4];

    var nightmodeDiv = document.createElement('div');
        nightmodeDiv.id = "invmode";
        nightmodeDiv.tabIndex = "5";
        nightmodeDiv.innerText = stringArray[2];
    
    document.body.appendChild(serifDiv);
    document.body.appendChild(contrastDiv);
    document.body.appendChild(nightmodeDiv);
}

createControls();

function initListener(id, textArr, className) {
    var el = document.getElementsByTagName("html")[0];
    var acbox = document.getElementById(id),
        textNode = acbox.firstChild;
    acbox.addEventListener(
        clickEvent,
        function() {
            var selector = Number(localStorage.getItem(id)!=='true');
            localStorage.setItem(id, Boolean(selector));
            textNode.data = textArr[selector];
            el.classList[classMethods[selector]](className);
        },
        false
    );
}

function addJSHandlers() {
    initListener("contrast", [stringArray[0], stringArray[1]], "contrast");
    initListener("invmode",  [stringArray[2], stringArray[3]], "inverted");
    initListener("serif",    [stringArray[4], stringArray[5]], "serif");
}

addJSHandlers();

// Load the state of parameters from LocalStorage
if (localStorage.getItem('contrast')==='true') {
    document.getElementById('contrast').firstChild.data = stringArray[1];
    document.getElementsByTagName("html")[0].classList.add("contrast");
}
if (localStorage.getItem('invmode')==='true') {
    document.getElementById('invmode').firstChild.data = stringArray[3];
    document.getElementsByTagName("html")[0].classList.add("inverted");
}
if (localStorage.getItem('serif')==='true') {
    document.getElementById('serif').firstChild.data = stringArray[5];
    document.getElementsByTagName("html")[0].classList.add("serif");
}

// Rainbow shifting text
function doThatFuckingColorThing() {
    var color = "hsl(" + currentHue + ", 80%, 60%)",
        nextHue = currentHue + hueAddition;
    currentHue = nextHue > 360 ? 0 : nextHue;
    if (rainbowClass) for (let item of rainbowClass) {item.style.color = color;} 
    setTimeout(doThatFuckingColorThing, rainbowTiming);
}

doThatFuckingColorThing();