"use strict";
/*Udemy jQuery Lektion 82*/
jQuery(document).ready(function($) {

/*Declarations*/
let stiftActive = false;
let eraseActive = false;
let straightLine = false;
let straightLine2 = false;
let posArrayX = [];
let posArrayY = [];
let activeButtons = [];
//let index = 0;

/*The Canvas API provides a means for drawing graphics
via JavaScript and the HTML <canvas> element.*/
/*Among other things, it can be used for animation,
game graphics, data visualization, photo manipulation,
and real-time video processing.*/

/*We need to get the canvas!*/
const canvas = $("#canvas"); //document.getElementById
/*jQuery exposes the actual DOM element in numeric
indexes, where you can perform normal JavaScript/DOM functions.*/
//javaScript ohne [0];
/*We need to specific write the kind of environment we are
working: is it 2D or 3D!*/
const ctx = canvas[0].getContext("2d");
/*I have also seen that it's often preferred to use .get(0) to
reference a jquery target as HTML element:
var myCanvasElem = $("#canvas").get(0);*/

/*resizing: to avoid cursor position problem, sometimes fine in some browsers and
sometimes not. So, let's resize as soon as the document is loaded.*/
function resizeCanvas(width, height) {
  canvas[0].width = width;
  canvas[0].height = height;
  canvas.css("width", width);
  canvas.css("height", height);
}
/*You make sure that the attributes of canvas and css are the same!*/
resizeCanvas(600,600);

function getCursorPosition(canvas, event) {
  //you can get the bounding box of any element by calling getBoundingClientRecht
  //javaScript native function
  const rect = canvas[0].getBoundingClientRect();
  // const x = event.pageX - rect.left;
  // const y = event.pageY - rect.top;
  const x = event.pageX - rect.left;
  const y = event.pageY - rect.top;
  // console.log("event.pageX: " + event.pageX);
  // console.log("event.pagey: " + event.pageY);
  // console.log(" rect.left: " +  rect.left);
  // console.log("rect.top: " + rect.top);
  return [x , y];
}

function draw(posX, posY) {
  ctx.beginPath();
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.lineTo(posX,posY);
  ctx.stroke();
}

function erase(posX, posY) {
  ctx.beginPath();
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.strokeStyle = "white";
  ctx.lineTo(posX,posY);
  ctx.stroke();
}

//FOR STRAIGHTLINE////////////////////////////
function drawStraightLine(posArrayX, posArrayY) {
  // ctx.clearRect(0,0, innerWidth, innerHeight);
  ctx.beginPath();
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.strokeStyle = "black";
  ctx.lineTo(posArrayX[0],posArrayY[0]);
  ctx.lineTo(posArrayX[1],posArrayY[1]);
  ctx.stroke();
}

function drawStraightLineGhost(posX, posY) {
  ctx.beginPath();
  ctx.lineWidth = 5;
  ctx.lineCap = "round";
  ctx.strokeStyle = "rgba(255, 160, 122, 0.3)";
  ctx.lineTo(posArrayX[0], posArrayY[0]);
  ctx.lineTo(posX,posY);
  ctx.stroke();

  setTimeout(function() {
    //ctx.clearRect(0,0, innerWidth, innerHeight);
  deleteStraightLineGhost(posX, posY);
   },100);

}
function deleteStraightLineGhost(posX, posY) {
  ctx.beginPath();
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.strokeStyle = "white";
  ctx.lineTo(posArrayX[0], posArrayY[0]);
  ctx.lineTo(posX,posY);
  ctx.stroke();
}



$("#canvas").mousedown(function(event) {
  if($(".bStift").hasClass("active")) {
    stiftActive = true;
    let cursorPositions = getCursorPosition(canvas, event);
    draw(cursorPositions[0], cursorPositions[1]);
  };
  if($(".bErase").hasClass("active")) {
    eraseActive = true;
    let cursorPositions = getCursorPosition(canvas, event);
    erase(cursorPositions[0], cursorPositions[1]);
  };
  if($(".bStraightLine").hasClass("active")) {
    if(straightLine) {
      straightLine2 = true;
    } else {
    straightLine = true;
    let cursorPositions = getCursorPosition(canvas, event);
    posArrayX.push(cursorPositions[0]);
    posArrayY.push(cursorPositions[1]);
    console.log(`First X position: ${cursorPositions[0]}`);
    console.log(`First Y position: ${cursorPositions[1]}`);
    }
  };
  if($(".bRect").hasClass("active")) {
    stiftActive = true;
    let cursorPositions = getCursorPosition(canvas, event);
    drawRect(cursorPositions[0], cursorPositions[1]);
  };
})

$("#canvas").mousemove(function(event) {
    if (stiftActive) {
    let cursorPositions = getCursorPosition(canvas, event);
    // console.log(cursorPositions[0], cursorPositions[1]);
    draw(cursorPositions[0], cursorPositions[1]);
  };
  if( eraseActive) {
    let cursorPositions = getCursorPosition(canvas, event);
    erase(cursorPositions[0], cursorPositions[1]);
  };
  if(straightLine && !straightLine2) {
    let cursorPositions = getCursorPosition(canvas, event);
    drawStraightLineGhost(cursorPositions[0], cursorPositions[1]);
  }
});

$("#canvas").mouseup(function(event) {
  /*reseting*/
  stiftActive = false;
  eraseActive = false;
  if(straightLine2) {
    let cursorPositions = getCursorPosition(canvas, event);
    posArrayX.push(cursorPositions[0]);
    posArrayY.push(cursorPositions[1]);
    console.log(`Last X position: ${cursorPositions[0]}`);
    console.log(`Last Y position: ${cursorPositions[1]}`);
    drawStraightLine(posArrayX, posArrayY);
    straightLine = false;
    straightLine2 = false;
    posArrayX = [];
    posArrayY = [];
  }
})

/**nav functions:*/

/*reset nav buttons function*/
function resetButtons() {
  /*reseting other buttons*/
  if(activeButtons.length > 1)
  {
    $(activeButtons[0]).toggleClass("active");
    activeButtons.shift();
  }
  console.log(activeButtons);
};

/*adding buttons*/
//Stift
$(".bStift").click(function() {
  $(".bStift").toggleClass("active");
  activeButtons.push(".bStift");
  resetButtons();
});
//bErase
$(".bErase").click(function() {
  $(".bErase").toggleClass("active");
  /*reseting other buttons*/
    activeButtons.push(".bErase");
    resetButtons();
});
//bFill
$(".bFill").click( () => {
   ctx.fillStyle = "green";
   ctx.fillRect(0, 0, canvas[0].width, canvas[0].height);
    $(".bFill").toggleClass("active");
   activeButtons.push(".bFill");
   resetButtons();
});
//bFillElement
//bFill
$(".bFillElement").click( () => {
  $(".bFillElement").toggleClass("active");
  activeButtons.push(".bFillElement");
  resetButtons();
});
//bStraightLine
$(".bStraightLine").click( () => {
   $(".bStraightLine").toggleClass("active");
   activeButtons.push(".bStraightLine");
   resetButtons();
});

//bRectangle
$(".bRect").click( () => {
   $(".bRect").toggleClass("active");
   activeButtons.push(".bRect");
   resetButtons();
});

//bCircle
$(".bCircle").click( () => {
   $(".bCircle").toggleClass("active");
   activeButtons.push(".bCircle");
   resetButtons();
});

//Zoom
$(".bZoom").click(function() {
  $(".bZoom").toggleClass("active");
  resizeCanvas(window.innerWidth, 600);
  activeButtons.push(".bZoom");
  resetButtons();
});
//Reload
$(".bReload").click(function() {
    resizeCanvas(600, 600);
    $(".bReload").toggleClass("active");
    activeButtons.push(".bReload");
    resetButtons();
});
//Animation
$(".bAnimation").click(function() {
  animation();
  $(".bAnimation").toggleClass("active");
  activeButtons.push(".bAnimation");
  resetButtons();

});

/*if you resize the window, then you have
to click the .bZoom again or addAnEventListener*/
/*jQuery equivalent of JavaScript's addEventListener method*/
// window.addEventListener("resize", () => {
//
// });
$(window).on("resize", function() {
  if ( $(".bZoom").hasClass("active") ) {
  resizeCanvas(window.innerWidth, 600);
  }
});

/*FUNCTIONS USED ONLY TO LEARN HOW IT WORKS*/
/*Draw a house: see that the (x,y) are the end point coordinates in the canvas 2D!*/
  // ctx.beginPath();
  // ctx.moveTo(100,10);
  // ctx.lineTo(200,50);
  // ctx.lineTo(200,100);
  // ctx.lineTo(10,100);
  // ctx.lineTo(10,50);
  // ctx.lineTo(100,10);
  // // ctx.closePath(); TO CLOSE THE PATH
  // ctx.stroke();
  //
  // /*The animation function was done only to test!*/
  let animation = function () {
    ctx.fillStyle = "green";
    for (let index=1; index <= canvas[0].width; index++) {
      setTimeout( () => {
        console.log(index);
        ctx.fillRect(0, 0, index, canvas[0].height);
      },10)
    }
  }

console.log("This is a log");
console.warn("this is a warn");


});
