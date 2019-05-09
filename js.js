"use strict";
/*Udemy jQuery Lektion 82*/
jQuery(document).ready(function($) {

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

/*resizing*/
function resizeCanvas(width, height) {
  canvas[0].width = width;
  canvas[0].height = height;
  canvas.css("width", width);
  canvas.css("height", height);
}


/*To draw something in the Canvas Element*/
//fill the draw with a specified color

//draw rectangle
//ctx.fillRect(x, y, width, height);
// ctx.fillRect(0, 0, canvas[0].width, canvas[0].height);
// ctx.fillRect(0, 0, 150, 200);

/*higher-order function*/
/*setTimeoutis a native JavaScript function*/
// function animation () {
//    function() {
//       setTimeout(function() {
//         ctx.fillRect(0, 0, 150, 200);
//       }, 3000)
//       console.log("here")
//     }
// }

/*Draw a house: see that the (x,y) are the end point coordinates in the canvas 2D!*/
ctx.beginPath();
ctx.moveTo(100,10);
ctx.lineTo(200,50);
ctx.lineTo(200,100);
ctx.lineTo(10,100);
ctx.lineTo(10,50);
ctx.lineTo(100,10);
// ctx.closePath(); TO CLOSE THE PATH
ctx.stroke();


let animation = function () {
  console.log("canvas[0].width");

  ctx.fillStyle = "green";
  for (let index=1; index <= canvas[0].width; index++) {

    setTimeout( () => {
      console.log(index);
      ctx.fillRect(0, 0, index, canvas[0].height);

    },10)
  }
}

/*Draw a house: see that the (x,y) are the end point coordinates in the canvas 2D!*/
ctx.beginPath();
ctx.moveTo(100,10);
ctx.lineTo(200,50);
ctx.lineTo(200,100);
ctx.lineTo(10,100);
ctx.lineTo(10,50);
ctx.lineTo(100,10);
// ctx.closePath(); TO CLOSE THE PATH
ctx.stroke();

function draw (posX, posY) {
  /*Draw a house: see that the (x,y) are the end point coordinates in the canvas 2D!*/
  ctx.lineTo(posX,posY);
  // ctx.closePath(); TO CLOSE THE PATH
  ctx.stroke();
};


// setTimeout(function() {
//   ctx.fillRect(0, 0, 150, 200);
// }, 3000)

// animation();

//add canvas addEventListener


function getCursorPosition(canvas, event) {
  //you can get the bounding box of any element by calling getBoundingClientRecht
  //javaScript native function
  const rect = canvas[0].getBoundingClientRect();
  const x = event.pageX - rect.left;
  const y = event.pageY - rect.top;
  return [x , y];
}

function draw(posX, posY) {
  ctx.beginPath();
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.lineTo(posX,posY);
  ctx.stroke();
}

  $("#canvas").mousemove(function(event) {
    if ($(".bStift").hasClass("active")) {
      let cursorPositions = getCursorPosition(canvas, event);
      console.log(cursorPositions[0], cursorPositions[1]);
      draw(cursorPositions[0], cursorPositions[1]);
    }
  });


$("#canvas").mouseup(function(event) {
  $(".bStift").removeClass("active");
})

$("#canvas").mousedown(function(event) {
  $(".bStift").addClass("active");

})



/**nav functions:*/

/*adding buttons*/
//Stift
$(".bStift").click(function() {
  $(".bStift").toggleClass("active");
});
//Zoom
$(".bZoom").click(function() {
  $(".bZoom").toggleClass("active");
  resizeCanvas(window.innerWidth, 600);
});
//Reload
$(".bReload").click(function() {
    resizeCanvas(400, 400);
})
//Animation
$(".bAnimation").click(function() {
  animation();
})



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


});
