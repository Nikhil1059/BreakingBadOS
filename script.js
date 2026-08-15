const welcomeWindow = document.getElementById("welcome");
const welcomeHeader = document.getElementById("welcomeheader");
const welcomeClose = document.getElementById("welcomeclose");
const welcomeOpen = document.getElementById("welcomeopen");

const DEV_MODE = false;

const notesWindow = document.getElementById("notesWindow");
const notesHeader = document.getElementById("notesHeader");
const notesClose = document.getElementById("notesClose");
const notesIcon = document.getElementById("notesIcon");
const savedIconLeft = localStorage.getItem("chemNotesIconLeft");
const savedIconTop = localStorage.getItem("chemNotesIconTop");

const bootScreen = document.getElementById("bootScreen");
const desktop = document.getElementById("desktop");
const bootButton = document.getElementById("bootButton");
const introMusic = document.getElementById("introMusic");
introMusic.volume = 0.2;
introMusic.playbackRate = 0.9;



makeWindowDraggable(welcomeWindow, welcomeHeader);
makeWindowDraggable(notesWindow, notesHeader);


welcomeClose.addEventListener("click", function(){

    welcomeWindow.style.display = "none";

});

welcomeOpen.addEventListener("click", function(){

    welcomeWindow.style.display = "block";

});

notesClose.addEventListener("click", function(){

    notesWindow.style.display = "none";

});

notesIcon.addEventListener("dblclick", function(){

    notesWindow.style.display = "block";

});

welcomeClose.addEventListener("mouseenter", function(){

    this.style.background = "#e81123";

});

welcomeClose.addEventListener("mouseleave", function(){

    this.style.background = "transparent";

});

notesClose.addEventListener("mouseenter", function(){

    this.style.background = "#e81123";

});

notesClose.addEventListener("mouseleave", function(){

    this.style.background = "transparent";

});

welcomeOpen.addEventListener("mouseenter", function(){

    this.style.background = "rgba(57,174,241,.35)";

});

welcomeOpen.addEventListener("mouseleave", function(){

    this.style.background = "rgba(57,174,241,.18)";

});

function makeWindowDraggable(windowElement, header){

    let dragging = false;

    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener("mousedown", startDrag);

    function startDrag(e){

        dragging = true;

        if(windowElement.style.transform !== "none"){

            const rect = windowElement.getBoundingClientRect();

            windowElement.style.width = rect.width + "px";
            windowElement.style.height = rect.height + "px";

            windowElement.style.left = rect.left + "px";
            windowElement.style.top = rect.top + "px";

            windowElement.style.transform = "none";

        }

        offsetX = e.clientX - windowElement.offsetLeft;
        offsetY = e.clientY - windowElement.offsetTop;

        document.addEventListener("mousemove", dragWindow);
        document.addEventListener("mouseup", stopDrag);

    }

    function dragWindow(e){

        if(!dragging) return;

        windowElement.style.left = (e.clientX - offsetX) + "px";
        windowElement.style.top = (e.clientY - offsetY) + "px";

    }

    function stopDrag(){

        dragging = false;

        document.removeEventListener("mousemove", dragWindow);
        document.removeEventListener("mouseup", stopDrag);

    }

}

function makeIconDraggable(icon){
let isDragging = false;
let startX;
let startY;
let startLeft;
let startTop;

if(savedIconLeft !== null && savedIconTop !== null){
    notesIcon.style.left = savedIconLeft + "px"
    notesIcon.style.top = savedIconTop + "px"
}
icon.addEventListener("mousedown", function(e){
    isDragging = true;
    icon.style.transition = "none";

    startX = e.clientX;
    startY = e.clientY;

    startLeft = icon.offsetLeft;
    startTop = icon.offsetTop;
});

document.addEventListener("mousemove", function(e){

    if(!isDragging) return;

    let dx = e.clientX - startX;
    let dy = e.clientY - startY;

    let newLeft = startLeft + dx;
    let newTop = startTop + dy;

    let maxLeft = desktop.clientWidth - icon.offsetWidth;
    let maxTop = window.innerHeight - 85 - icon.offsetHeight;

    newLeft = Math.max(-20, Math.min(newLeft, maxLeft));
    newTop = Math.max(0, Math.min(newTop, maxTop));

    icon.style.left = newLeft + "px";
    icon.style.top = newTop + "px";

});

 document.addEventListener("mouseup",function(){
    if(!isDragging) return;

        isDragging = false;

        let gridSize = 60;

        icon.style.transition = "0.1s";

        let snappedLeft = Math.round(icon.offsetLeft / gridSize) * gridSize;
        let snappedTop = Math.round(icon.offsetTop / gridSize) * gridSize;

        icon.style.left = snappedLeft + "px";
        icon.style.top = snappedTop + "px";

        localStorage.setItem("chemNotesIconLeft", snappedLeft);
        localStorage.setItem("chemNotesIconTop", snappedTop);
    });


}

makeIconDraggable(notesIcon);

const notesArea = document.getElementById("notesArea");

const savedNotes = localStorage.getItem("chemNotes");

const bootLines = [

    "Checking CPU............OK",
    "Checking Memory............OK",
    "Loading Mr White's Lab............OK",
    "Encrypting Files............OK",
    "Checking Vulnerabilities............OK",
    "Initializing Desktop............OK"
]

const lineElements = [

    document.getElementById("line1"),
    document.getElementById("line2"),
    document.getElementById("line3"),
    document.getElementById("line4"),
    document.getElementById("line5"),
    document.getElementById("line6"),
]

async function bootSequence(){

    for(let i = 0; i < bootLines.length; i++){

        await typeLine(lineElements[i], bootLines[i]);

        await sleep(250);

    }

    document.getElementById("status").textContent = "Status: READY";

    bootButton.style.display = "block";

    setTimeout(function(){

        bootButton.style.opacity = "1";

    },50);
}




function sleep(ms){

    return new Promise(resolve => setTimeout(resolve, ms));

}

async function typeLine(element,text){

    let split = text.lastIndexOf("OK");

    let firstPart = text.substring(0, split);

    element.textContent = "";

    for(let i = 0; i < firstPart.length; i++){

        element.textContent += firstPart.charAt(i);

        await sleep(18);

    }

    await sleep(250);

    element.textContent += "OK";

}



if(savedNotes !== null){

    notesArea.value = savedNotes;

}

notesArea.addEventListener("input", function(){

    localStorage.setItem("chemNotes", notesArea.value);

});

let selectedItem = null;

function selectItem(element){

    if(selectedItem){

        selectedItem.style.background = "transparent";

    }

    selectedItem = element;

    element.style.background = "rgba(255,255,255,.08)";

}

notesIcon.addEventListener("click", function(e){

    e.stopPropagation();

    selectItem(notesIcon);

});

welcomeOpen.addEventListener("click", function(e){

    e.stopPropagation();

    selectItem(welcomeOpen);

});

document.addEventListener("click", function(){

    if(selectedItem){

        selectedItem.style.background = "transparent";
        selectedItem = null;

    }

});
notesWindow.addEventListener("mousedown", function(){

    notesWindow.style.zIndex = "20";
    welcomeWindow.style.zIndex = "10";

});

welcomeWindow.addEventListener("mousedown", function(){

    welcomeWindow.style.zIndex = "20";
    notesWindow.style.zIndex = "10";

});

if (DEV_MODE) {

    bootScreen.style.display = "none";
    desktop.style.display = "block";
    desktop.style.opacity = "1";

} else {

    bootSequence();

}

bootButton.addEventListener("click", function(){

    introMusic.currentTime = 0;
    introMusic.play();

    desktop.style.display = "block";

    requestAnimationFrame(function(){

        desktop.style.opacity = "1";

    });

    bootScreen.style.transition = "opacity 1.8s";
    bootScreen.style.opacity = "0";

    setTimeout(function(){

        bootScreen.style.display = "none";

    },1800);

});
