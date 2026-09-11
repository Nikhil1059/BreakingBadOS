const welcomeWindow = document.getElementById("welcome");
const welcomeHeader = document.getElementById("welcomeheader");
const welcomeClose = document.getElementById("welcomeclose");
const welcomeOpen = document.getElementById("welcomeopen");
const resetApps = document.getElementById("resetApps")

const timeElement = document.getElementById("timeElement");
const calendar = document.getElementById("calendar");
const calendarMonth = document.getElementById("calendarMonth");
const calendarDates = document.getElementById("calendarDates");
const prevMonth = document.getElementById("prevMonth");
const nextMonth = document.getElementById("nextMonth");

let calendarDate = new Date();

const DEV_MODE = false;

const notesWindow = document.getElementById("notesWindow");
const notesHeader = document.getElementById("notesHeader");
const notesClose = document.getElementById("notesClose");
const notesIcon = document.getElementById("notesIcon");
const terminalIcon = document.getElementById("terminalIcon");

const terminalWindow = document.getElementById("terminalWindow");
const terminalHeader = document.getElementById("terminalHeader");
const terminalClose = document.getElementById("terminalClose");
const terminalInput = document.getElementById("terminalInput");
const terminalOutput = document.getElementById("terminalOutput");
const terminalBox = document.getElementById("terminalBox");
const terminalInputLine = document.getElementById("terminalInputLine");

const savedIconLeft = localStorage.getItem("chemNotesIconLeft");
const savedIconTop = localStorage.getItem("chemNotesIconTop");
const savedTerminalLeft = localStorage.getItem("terminalIconLeft");
const savedTerminalTop = localStorage.getItem("terminalIconTop");

const bootScreen = document.getElementById("bootScreen");
const desktop = document.getElementById("desktop");
const bootButton = document.getElementById("bootButton");
const introMusic = document.getElementById("introMusic");
introMusic.volume = 0.2;
introMusic.playbackRate = 0.9;



makeWindowDraggable(welcomeWindow, welcomeHeader);
makeWindowDraggable(notesWindow, notesHeader);
makeWindowDraggable(terminalWindow, terminalHeader);


welcomeClose.addEventListener("click", function(){

    welcomeWindow.style.display = "none";
    welcomeOpen.classList.remove("active");

});

welcomeOpen.addEventListener("click", function(){

    welcomeWindow.style.display = "block";
    welcomeOpen.classList.add("active");

});

notesClose.addEventListener("click", function(){

    notesWindow.style.display = "none";

});

notesIcon.addEventListener("dblclick", function(){

    notesWindow.style.display = "block";

});

terminalIcon.addEventListener("dblclick", function(){

    terminalWindow.style.display = "block";

    const activeInput = terminalWindow.querySelector("#terminalInput");

    activeInput.focus();
});

terminalClose.addEventListener("click", function(){

    terminalWindow.style.display = "none";
});

timeElement.addEventListener("click", function(){

    if(calendar.classList.contains("show")){

        calendar.classList.remove("show");
        timeElement.classList.remove("active");

    } else{
        calendarDate = new Date();
        renderCalendar();

        calendar.classList.add("show");
        timeElement.classList.add("active");
    }
});

desktop.addEventListener("click", function(e){

    if(e.target !== timeElement && !calendar.contains(e.target)){
        calendar.classList.remove("show");
        timeElement.classList.remove("active");
    }

});


function setupTerminalCursor(inputLine, input){
    const cursor = document.createElement("span");
    cursor.id = "terminalCursor";

    inputLine.appendChild(cursor);

    function updateCursor(){
        const mirror = document.createElement("span");
        
        mirror.style.position = "absolute";
        mirror.style.visibility = "hidden";
        mirror.style.whiteSpace = "pre";
        mirror.style.font = getComputedStyle(input).font;

        mirror.textContent = input.value.substring(0, input.selectionStart);

        document.body.appendChild(mirror);
        const textWidth = mirror.getBoundingClientRect().width;

        document.body.removeChild(mirror);

        cursor.style.left = (input.offsetLeft + textWidth + 2 - input.scrollLeft) + "px";

        cursor.style.top = (input.offsetTop + 2) + "px";

    }

    input.addEventListener("input", updateCursor);
    input.addEventListener("keyup", updateCursor);
    input.addEventListener("click", updateCursor);
    input.addEventListener("focus", updateCursor);

    updateCursor();

}

function processCommmand(command){

    const outputLine = document.createElement("div");

    if(command === "/help"){

        outputLine.textContent = "Available Commands:";
        terminalOutput.appendChild(outputLine);

        const commands = [
            "/help",
            "/time",
            "/home",
            "/chemnotes",
            "/iconreset",
            "/calc",
            "/clear",
            //"/timer",
            //"/convert",
            //"/purity",
            //"/labstatus"

        ]

        commands.forEach(function(commandName){

            const line = document.createElement("div");

            line.textContent = " " + commandName;

            terminalOutput.appendChild(line);

        });
        
    }else if(command === "/time"){

    outputLine.textContent = "Current time: " + new Date().toLocaleTimeString();

    terminalOutput.appendChild(outputLine);

} else if(command === "/home"){

    outputLine.textContent = "Opening Home...";
    terminalOutput.appendChild(outputLine);

    setTimeout(function(){
         welcomeWindow.style.display = "block";
    }, 400);

} else if(command === "/chemnotes"){

    outputLine.textContent = "Opening ChemNotes...";
    terminalOutput.appendChild(outputLine);

    setTimeout(function(){
        notesWindow.style.display = "block";
    }, 400);

} else if(command === "/iconreset"){

    outputLine.textContent = "Resetting Icons..."
    terminalOutput.appendChild(outputLine);

    setTimeout(function(){
        terminalWindow.style.display = "none";
        resetApps.click();
    }, 400);

} else if(command === "/clear"){

    terminalOutput.innerHTML = "";

} else if(command === "/calc"){

    outputLine.textContent = "Usage: /calc <number> <operator> <number>";
    terminalOutput.appendChild(outputLine);

    const exampleLine = document.createElement("div");
    exampleLine.textContent = "Example: /calc 25 + 10";
    terminalOutput.appendChild(exampleLine);

} else if(command.startsWith("/calc ")){

    const calculation = command.substring(6).trim()
    const parts = calculation.split(" ");

    if(parts.length !== 3){

        outputLine.textContent = "Invalid format.";
        terminalOutput.appendChild(outputLine);

        const hintLine = document.createElement("div");
        hintLine.textContent = "Example: /calc 25 + 10";
        terminalOutput.appendChild(hintLine);

        return;
    }

    const number1 = Number(parts[0]);
    const operator = parts[1];
    const number2 = Number(parts[2]);

    if(Number.isNaN(number1) || Number.isNaN(number2)){

        outputLine.textContent = "Invalid Numbers."
        terminalOutput.appendChild(outputLine);

        return;
    }

    let result;

    if(operator === "+"){
        result = number1 + number2;
    } else if(operator === "-"){
        result = number1 - number2;
    } else if(operator === "*"){
        result = number1 * number2;
    } else if(operator == "/"){
        if(number2 === 0){

            outputLine.textContent = "Cannot divide by zero.";
            terminalOutput.appendChild(outputLine);

            return;
        }
        result = number1 / number2;
    } else{

        outputLine.textContent = "Invalid operator.";
        terminalOutput.appendChild(outputLine);

        const hintLine = document.createElement("div");
        hintLine.textContent = "Use +, -, * or /.";
        terminalOutput.appendChild(hintLine);

        return;
    }

    outputLine.textContent = "Result: " + result;
    terminalOutput.appendChild(outputLine);


}else{

    outputLine.textContent = "Command not found: " + command;
    terminalOutput.appendChild(outputLine)

    const hintLine = document.createElement("div");
    hintLine.textContent = "Type /help for available commands.";
    terminalOutput.appendChild(hintLine);
}
}

function createInputLine(){

    const newInputLine = document.createElement("div");
    newInputLine.id = "terminalInputLine";
    

    const newPrompt = document.createElement("span");
    newPrompt.textContent = "root@breakingbados:~$";
    newPrompt.style.color = "#00ff66";

    const newInput = document.createElement("input");
    newInput.id = "terminalInput";
    newInput.type = "text";
    newInput.autocomplete = "off";

    newInputLine.appendChild(newPrompt);
    newInputLine.appendChild(newInput);

    setupTerminalCursor(newInputLine, newInput);

    newInput.addEventListener("keydown", function(e){

        if(e.key === "Enter"){

            const command = newInput.value;

            const commandLine = document.createElement("div");

            const commandPrompt = document.createElement("span");
            commandPrompt.textContent = "root@breakingbados:~$";
            commandPrompt.style.color = "#00ff66";

            const commandText = document.createElement("span");
            commandText.textContent = " " + command;
            commandText.style.color = "white";

            commandLine.appendChild(commandPrompt);
            commandLine.appendChild(commandText);

            terminalOutput.appendChild(commandLine);

            processCommmand(command);

            const spacer = document.createElement("div");
            spacer.style.height = "10px";
            terminalOutput.appendChild(spacer);

            newInputLine.remove();

            createInputLine();

        }

    });

    terminalBox.appendChild(newInputLine);

    newInput.focus();
}

     setupTerminalCursor(terminalInputLine, terminalInput);

terminalInput.addEventListener("keydown", function(e){

    if(e.key === "Enter"){

        const command = terminalInput.value;

        const commandLine = document.createElement("div");

        const commandPrompt = document.createElement("span");
        commandPrompt.textContent = "root@breakingbados:~$";
        commandPrompt.style.color = "#00ff66";

        const commandText = document.createElement("span");
        commandText.textContent = " " + command;
        commandText.style.color = "white";

        commandLine.appendChild(commandPrompt);
        commandLine.appendChild(commandText);

        terminalOutput.appendChild(commandLine);

        processCommmand(command);

        const spacer = document.createElement("div");
        spacer.style.height = "10px";
        terminalOutput.appendChild(spacer);

        terminalInputLine.remove();

        createInputLine();

    }

});

resetApps.addEventListener("click", function(){

    notesIcon.style.left = "20px";
    notesIcon.style.top = "100px";

    terminalIcon.style.left = "20px";
    terminalIcon.style.top = "0px";

    localStorage.removeItem("chemNotesIconLeft");
    localStorage.removeItem("chemNotesIconTop");

    localStorage.removeItem("terminalIconLeft");
    localStorage.removeItem("terminalIconTop");

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

terminalClose.addEventListener("mouseenter", function(){

    this.style.background = "#e81123";
})

terminalClose.addEventListener("mouseleave", function(){

    this.style.background = "transparent";
})


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

 function isOverlapping(icon1,icon2){

    let rect1 = icon1.getBoundingClientRect();
    let rect2 = icon2.getBoundingClientRect();

    return!(
        rect1.right <= rect2.left ||
        rect1.left >= rect2.right ||
        rect1.bottom <= rect2.top ||
        rect1.top >= rect2.bottom
    );
 }

 function moveNextTo(icon, otherIcon){

    let otherLeft = otherIcon.offsetLeft;
    let otherTop = otherIcon.offsetTop;

    let leftDistance = Math.abs(icon.offsetLeft - (otherLeft - icon.offsetWidth));
    let rightDistance = Math.abs(icon.offsetLeft - (otherLeft + otherIcon.offsetWidth));
    let topDistance = Math.abs(icon.offsetTop - (otherTop - icon.offsetHeight));
    let bottomDistance = Math.abs(icon.offsetTop - (otherTop + otherIcon.offsetHeight));

    let smallest = Math.min(
        leftDistance,
        rightDistance,
        topDistance,
        bottomDistance
    );

    if(smallest === leftDistance){

        icon.style.left = (otherLeft - icon.offsetWidth - 2) + "px";

    }else if(smallest === rightDistance){

        icon.style.left = (otherLeft + otherIcon.offsetWidth + 2) + "px";

    }else if(smallest === topDistance){

        icon.style.top = (otherTop - icon.offsetHeight - 2) + "px";

    }else{

        icon.style.top = (otherTop + otherIcon.offsetHeight + 2) + "px";

    }

    let maxLeft = desktop.clientWidth - icon.offsetWidth;
    let maxTop = window.innerHeight - 85 - icon.offsetHeight;

    let finalLeft = Math.max(-20, Math.min(icon.offsetLeft, maxLeft));
    let finalTop = Math.max(0, Math.min(icon.offsetTop, maxTop));

    icon.style.left = finalLeft + "px";
    icon.style.top = finalTop + "px";
}

document.addEventListener("mouseup", function(){

    if(!isDragging) return;

    isDragging = false;

    let otherIcon;

    if(icon === notesIcon){
        otherIcon = terminalIcon;
    }else{
        otherIcon = notesIcon;
    }

    if(isOverlapping(icon, otherIcon)){
        moveNextTo(icon, otherIcon);
    }

    let gridSize = 60;

    let snappedLeft = Math.round(icon.offsetLeft / gridSize) * gridSize;
    let snappedTop = Math.round(icon.offsetTop / gridSize) * gridSize;

    icon.style.left = snappedLeft + "px";
    icon.style.top = snappedTop + "px";

    // Make sure grid snapping didn't create an overlap
    if(isOverlapping(icon, otherIcon)){
        moveNextTo(icon, otherIcon);
    }

    icon.style.transition = "0.1s";

    if(icon === notesIcon){
        localStorage.setItem("chemNotesIconLeft", icon.offsetLeft);
        localStorage.setItem("chemNotesIconTop", icon.offsetTop);
    }

    if(icon === terminalIcon){
        localStorage.setItem("terminalIconLeft", icon.offsetLeft);
        localStorage.setItem("terminalIconTop", icon.offsetTop);
    }

});


}

makeIconDraggable(notesIcon);
makeIconDraggable(terminalIcon);

if(savedTerminalLeft !== null && savedTerminalLeft !== null){
    terminalIcon.style.left = savedTerminalLeft + "px";
    terminalIcon.style.top = savedTerminalTop + "px";
}

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
