// ==============================
// Elements
// ==============================

const welcomeWindow = document.getElementById("welcome");
const titleBar = document.getElementById("welcomeheader");
const closeButton = document.getElementById("welcomeclose");
const openButton = document.getElementById("welcomeopen");

// ==============================
// Window Dragging
// ==============================

let dragging = false;
let offsetX = 0;
let offsetY = 0;

titleBar.addEventListener("mousedown", startDrag);

function startDrag(e){

    dragging = true;

    // Remove translate() only the first time
    if(welcomeWindow.style.transform !== "none"){

        const rect = welcomeWindow.getBoundingClientRect();

        welcomeWindow.style.width = rect.width + "px";
        welcomeWindow.style.height = rect.height + "px";

        welcomeWindow.style.left = rect.left + "px";
        welcomeWindow.style.top = rect.top + "px";

        welcomeWindow.style.transform = "none";

    }

    offsetX = e.clientX - welcomeWindow.offsetLeft;
    offsetY = e.clientY - welcomeWindow.offsetTop;

    document.addEventListener("mousemove", dragWindow);
    document.addEventListener("mouseup", stopDrag);

}

function dragWindow(e){

    if(!dragging) return;

    welcomeWindow.style.left = (e.clientX - offsetX) + "px";
    welcomeWindow.style.top = (e.clientY - offsetY) + "px";

}

function stopDrag(){

    dragging = false;

    document.removeEventListener("mousemove", dragWindow);
    document.removeEventListener("mouseup", stopDrag);

}

// ==============================
// Close Window
// ==============================

closeButton.addEventListener("click", function(){

    welcomeWindow.style.display = "none";

});

// ==============================
// Open Window
// ==============================

openButton.addEventListener("click", function(){

    welcomeWindow.style.display = "block";

});

// ==============================
// Close Button Hover
// ==============================

closeButton.addEventListener("mouseenter", function(){

    this.style.background = "#e81123";
    this.style.color = "white";

});

closeButton.addEventListener("mouseleave", function(){

    this.style.background = "transparent";
    this.style.color = "white";

});

// ==============================
// Home Button Hover
// ==============================

openButton.addEventListener("mouseenter", function(){

    this.style.background = "rgba(57,174,241,.35)";

});

openButton.addEventListener("mouseleave", function(){

    this.style.background = "rgba(57,174,241,.18)";

});
