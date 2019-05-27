"use strict";

/*TODO:
1) Bezier Curve the coordinates are not correct in the tutorial.
At least, it is not matching the code! TOBECHECKED!

2) Generate a palettes of color through js
https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Applying_styles_and_colors


2) we need an array to push the values of x, y of the mouse position.
The ghost function should delete and use these values.



*/
/*Tutorial: lines MDN:

lineWidth = value // sets the width of lines drawn in the future.
lineCap  = type //(defaultvalue = butt) sets the appearance of the ends of lines.
lineJoin = type // sets the appearance of the "corners" where lines meet
miterLimit = value // Establishes a limit on the miter when two lines join
//at a sharp angle, to let you control how the thick the junction becomes.

getLineDash() //returns the current line dash pattern array.
setLineDash(segments) //sets the current line dash pattern.
lineDashOffset = value //specifies where to start a dash array on a line.



*/
/*
Using quadratic and cubic Bézier curves can be quite challenging, because unlike
 vector drawing software like Adobe Illustrator, we don't have direct visual
 feedback as to what we're doing. */
/*Udemy jQuery Lektion 82*/
jQuery(document).ready(function($) {

  /*Declarations*/
  let stiftActive = false;
  let eraseActive = false;
  let rectActive = false;
  let circleActive = false;
  let bezierQActive = false;
  let bezierCActive = false;
  let straightLine = false;
  let straightLine2 = false;
  let posArrayX = [];
  let posArrayY = [];
  let firstPosClickX = 0;
  let firstPosClickY = 0;
  let activeButtons = [];
  let activeColor = "black";
  let transparency = 1;
  let thickness = 5;
  let lineCap = ["square","round","butt"]; //"butt" lineCap DO NOT WORK, With
  //free style stift.
  let lineCapString = "round";
  // let thickness = [4,8,12,16,20,24,28,36,42];
  // let indexThickness = 0;

  //let index = 0;

  /*The Canvas API provides a means for drawing graphics
  via JavaScript and the HTML <canvas> element.*/
  /*Among other things, it can be used for animation,
  game graphics, data visualization, photo manipulation,
  and real-time video processing.*/

  /*We need to get the canvas!
  The first line in the script retrieves the node in the DOM representing the
  <canvas> element by calling the document.getElementById() method. */
  const canvas = $("#canvas"); //document.getElementById
  /*jQuery exposes the actual DOM element in numeric
  indexes, where you can perform normal JavaScript/DOM functions.*/
  //javaScript ohne [0];
  /*We need to specific write the kind of environment we are
  working: is it 2D or 3D!*/
  // if(canvas[0].getContext) {
    const ctx = canvas[0].getContext("2d");
  // } else {
  //   alert("Sorry, the canvas is unsupported in your browser");
  // }
  /*I have also seen that it's often preferred to use .get(0) to
  reference a jquery target as HTML element:
  var myCanvasElem = $("#canvas").get(0);*/

  /*resizing: to avoid cursor position problem, sometimes fine in some browsers and
  sometimes not. So, let's resize as soon as the document is loaded.*/
/*The element can be sized arbitrarily by CSS, but during rendering the image is
scaled to fit its layout size: if the CSS sizing doesn't respect the ratio of the
initial canvas, it will appear distorted.*/

/*Another important note:  If your renderings seem distorted, try specifying your
width and height attributes explicitly in the <canvas> attributes, and not using CSS.*/

  function resizeCanvas(width, height) {
    canvas[0].width = width;
    canvas[0].height = height;
    canvas.css("width", width);
    canvas.css("height", height);
  }
  /*You make sure that the attributes of canvas and css are the same!*/
  resizeCanvas(600, 600);

 // smileFace();

  function smileFace() {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    //Big Circle//////////////////
    //arc(x,y,radius,startAngle, endAngle, anticlockwise);
    //Draw an arc which is centerd at (x,y),
    //Angles in the arc function are measured in radians, not degress.
    ctx.arc(300, 300, 300, 0, Math.PI * 2, true); // Outer circle
    /*Another way to draw an arc is to type:
    arcTo(x1, y1, x2, y2, radius)
    It draws an arc with the given control poionts and radius, connected to the
    previous point by a straight line.*/

    //Mouth
    //MoveTo: moves the pen to the coordinates specified by x,y
    ctx.moveTo(500, 300);
    // Mouth (clockwise) - outside part
    ctx.arc(300, 300, 200, 0, Math.PI, false);
    // Mouth (clockwise) - inside part
    ctx.moveTo(500, 300);
    ctx.arc(300, 300, 220, 0, Math.PI, false);  // Mouth (clockwise)
    ctx.moveTo(80, 300);
    //draws a line from the current drawing position to the position specified x,y
    ctx.lineTo(100,300)
    // ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    //eyes
    ctx.moveTo(260, 200);
    //eye left
    ctx.arc(200, 200, 60, 0, Math.PI * 2, true);  // Left eye
    ctx.moveTo(460, 200);
    //eye right
    ctx.arc(400, 200, 60, 0, Math.PI * 2, true);  // Right eye
    //Sets the style for shapes outlines
    ctx.strokeStyle = "blue";
    ctx.stroke();
    //nose
    ctx.beginPath();
    ctx.moveTo(342, 350);
    //Sets the style used when filling shapes
    ctx.fillStyle = "red";
    ctx.arc(302, 350, 40, 0, Math.PI * 2, true);  // Right eye
    ctx.fill();

    //Nice way to clear
    for(let index=0; index <= 310; index = index + 0.3) {
      setTimeout( function() {
        ctx.strokeStyle = "white";
        ctx.arc(300, 300, index, 0, Math.PI * 2, true); // Outer circle
        ctx.stroke();
      }.bind(index), 3000);
    }
  }

  function getCursorPosition(canvas, event) {
    //you can get the bounding box of any element by calling getBoundingClientRecht
    //javaScript native function
    const rect = canvas[0].getBoundingClientRect();
    // const x = event.pageX - rect.left;
    // const y = event.pageY - rect.top;
    // let scaleX = canvas[0].width / rect.width;
    // let scaleY = canvas[0].height / rect.height;

    const x = (event.pageX - rect.left);
    const y = (event.pageY - rect.top);
    // console.log("event.pageX: " + event.pageX);
    //   console.log(" rect.left: " +  rect.left);
    // console.log("event.pagey: " + event.pageY);
    // console.log("rect.top: " + rect.top);
    return [x, y];
  }


  /*get active color*/
$(".colorChart").click( (e) => {
  // console.log(`clicked at: ${e.target.id}`);
  activeColor = e.target.id;
});

// $(".gridThickness").click( (e) => {
//   console.log(`the thickness is: ${e.target.id}`);
//   indexThickness = e.target.id;
// })

// $(".colorChart").css("color", "red");

  function draw(posX, posY) {
    //create a new path
    ctx.beginPath();
    //path width
    ctx.lineWidth = thickness;
    ctx.lineCap = lineCapString;

    // ctx.lineCap = "round";
    ctx.strokeStyle = activeColor;
    ctx.globalAlpha = transparency;
    //draws a straightLine from the current drawing position to the position
    //specified by posX, posY
    ctx.lineTo(posX, posY);
    //draws the shape by stroking its outline
    ctx.stroke();
    //close is an option step that tries to close the path
    //by drawing a straight line from the current point to the start.
    //closePath();
    //Fill: when you call fill(), any open shapes are closed automatically.
    //when you call fill any open shape are closed automatically. so you do not
    //need to call stroke();
  }

  function erase(posX, posY) {
    ctx.beginPath();
    ctx.lineWidth = thickness;
    ctx.lineCap = lineCapString;
    ctx.strokeStyle = "white";
    ctx.lineTo(posX, posY);
    ctx.stroke();
  }

  //FOR STRAIGHTLINE////////////////////////////
  //think about if it would not be a better way, to draw a line,
  //hold it change its size and angle??
  function drawStraightLine(posArrayX, posArrayY) {
    // ctx.clearRect(0,0, innerWidth, innerHeight);
    ctx.beginPath();
    ctx.lineWidth = thickness;
    ctx.lineCap = lineCapString;
    ctx.strokeStyle = activeColor;
    ctx.globalAlpha = transparency;
    ctx.lineTo(posArrayX[0], posArrayY[0]);
    ctx.lineTo(posArrayX[1], posArrayY[1]);
    ctx.stroke();
  }

  function drawStraightLineGhost(posX, posY) {
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "rgba(255, 160, 122, 0.3)";
    ctx.lineTo(posArrayX[0], posArrayY[0]);
    ctx.lineTo(posX, posY);
    ctx.stroke();

    setTimeout(function() {
      //ctx.clearRect(0,0, innerWidth, innerHeight);
      deleteStraightLineGhost(posX, posY);
    }, 100);

  }

  function deleteStraightLineGhost(posX, posY) {
    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";
    ctx.lineTo(posArrayX[0], posArrayY[0]);
    ctx.lineTo(posX, posY);
    ctx.stroke();
  }

  /////FOR Rectangle//////////////////////////////
  function drawRect(posX, posY) {
    // ctx.clearRect(0,0, innerWidth, innerHeight);
    ctx.beginPath();
    ctx.lineWidth = thickness;
    ctx.lineCap = lineCapString;
    // ctx.fillStyle = activeColor;
    ctx.strokeStyle = activeColor;
    ctx.globalAlpha = transparency;
    console.log(firstPosClickX, firstPosClickY);
    // ctx.fillRect(x, y, width, height);

    let width = posX - firstPosClickX;
    let height = posY - firstPosClickY;
    console.log(width);
    console.log(height);
    //ctx.fillRect-> draw and fill the inside of a rectangle
    // ctx.fillRect(firstPosClickX, firstPosClickY, width, height);
    //Draw the countour of a rectangle
    ctx.rect(firstPosClickX, firstPosClickY, width, height);
    ctx.stroke();
  }

  function drawRectGhost(posX, posY) {
    // ctx.clearRect(0,0, innerWidth, innerHeight);
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.fillStyle  = "rgba(255, 160, 122, 0.3)";
    console.log(firstPosClickX, firstPosClickY);
    // ctx.fillRect(x, y, width, height);

    let width = posX - firstPosClickX;
    let height = posY - firstPosClickY;
    console.log(width);
    console.log(height);
    // ctx.fillRect(firstPosClickX, firstPosClickY, width, height);
    ctx.rect(firstPosClickX, firstPosClickY, width, height);
    ctx.stroke();

    setTimeout(function() {
      //ctx.clearRect(0,0, innerWidth, innerHeight);
    deleteRectGhost(posX, posY);
  },50);

  }

  function deleteRectGhost(posX, posY) {
    ctx.beginPath();
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.fillStyle  = "white";

    let width = posX - firstPosClickX;
    let height = posY - firstPosClickY;
    console.log(width);
    console.log(height);
    /*clear and fill Rect have the same results*/
    ctx.fillRect(firstPosClickX, firstPosClickY, width, height);
    // ctx.clearRect(firstPosClickX, firstPosClickY, width, height);

  }

  ////////////////////////////////

  /////FOR Circle//////////////////////////////
  function drawCircle(posX, posY) {
    // ctx.clearRect(0,0, innerWidth, innerHeight);
    ctx.beginPath();
    ctx.lineWidth = thickness;
    ctx.lineCap = lineCapString;
    ctx.strokeStyle = activeColor;
    ctx.globalAlpha = transparency;
    console.log(posArrayX, posArrayY);
    ctx.arc(posX, posY, Math.abs(((firstPosClickX-posX)+(firstPosClickY-posY))/2), Math.PI * 2, false);
    // ctx.lineTo(posArrayX[0],posArrayY[0]);
    // ctx.lineTo(posArrayX[1],posArrayY[1]);
    ctx.stroke();
  }

  function drawCircleGhost(posX, posY) {
    // ctx.clearRect(0,0, innerWidth, innerHeight);
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = "rgba(255, 160, 122, 0.3)";
    console.log(posX, posY);
    ctx.arc(posX, posY, Math.abs(((firstPosClickX-posX)+(firstPosClickY-posY))/2), Math.PI * 2, false);
    // ctx.lineTo(posArrayX[0],posArrayY[0]);
    // ctx.lineTo(posArrayX[1],posArrayY[1]);
    ctx.stroke();

    setTimeout(function() {
      //ctx.clearRect(0,0, innerWidth, innerHeight);
    deleteDrawCircleGhost(posX, posY);
  },50);

  }
  function deleteDrawCircleGhost(posX, posY) {
    // ctx.clearRect(0,0, innerWidth, innerHeight);
    ctx.beginPath();
    ctx.lineWidth = 7;
    ctx.strokeStyle = "white";
    console.log(posX, posY);
    ctx.arc(posX, posY, Math.abs(((firstPosClickX-posX)+(firstPosClickY-posY))/2), Math.PI * 2, false);
    // ctx.lineTo(posArrayX[0],posArrayY[0]);
    // ctx.lineTo(posArrayX[1],posArrayY[1]);
    ctx.stroke();
  }

  /////FOR Bezier Quadratic//////////////////////////////
  function drawBezier(posX, posY) {
    // ctx.clearRect(0,0, innerWidth, innerHeight);
    ctx.beginPath();
    ctx.lineWidth = thickness;
    ctx.lineCap = lineCapString;
    ctx.strokeStyle = activeColor;
    ctx.globalAlpha = transparency;
    // console.log(posArrayX, posArrayY);
    //quadraticCurveTo(cp1x, cp1y, x, y)
    //x,y = coordinates of the end poionts of the curve
    //cp1x, cp1y = coordinates of the first control point
    //In this case I think we have to use the moveTo
    ctx.moveTo(posArrayX[0], posArrayY[0])
    // ctx.quadraticCurveTo(canvas.width/2, canvas.height/2, posX, posY);
    ctx.quadraticCurveTo(posX, posY, posArrayX[1], posArrayY[1]);
    ctx.stroke();
  }

  function drawBezierGhost(posX, posY) {
    // ctx.clearRect(0,0, innerWidth, innerHeight);

    ctx.beginPath();
    ctx.lineWidth = thickness;
    ctx.lineCap = lineCapString;
    ctx.strokeStyle = activeColor;
    ctx.globalAlpha = transparency;
    // console.log(posArrayX, posArrayY);
    //quadraticCurveTo(cp1x, cp1y, x, y)
    //x,y = coordinates of the end poionts of the curve
    //cp1x, cp1y = coordinates of the first control point
    //In this case I think we have to use the moveTo
    ctx.moveTo(posArrayX[0], posArrayY[0]);
    ctx.quadraticCurveTo(posX, posY, posArrayX[1], posArrayY[1]);
    ctx.stroke();

    setTimeout(()=> {
      deleteDrawBezierGhost(posX, posY) ;
    },50)
  }

  function deleteDrawBezierGhost(posX, posY) {
    // ctx.clearRect(0,0, innerWidth, innerHeight);
    ctx.beginPath();
    ctx.lineWidth = thickness+20;
    ctx.lineCap = lineCapString;
    ctx.strokeStyle = "white";
    // console.log(posArrayX, posArrayY);
    //quadraticCurveTo(cp1x, cp1y, x, y)
    //x,y = coordinates of the end poionts of the curve
    //cp1x, cp1y = coordinates of the first control point
    //In this case I think we have to use the moveTo
    ctx.moveTo(posArrayX[0], posArrayY[0]);
    ctx.quadraticCurveTo(posX, posY, posArrayX[1], posArrayY[1]);
    ctx.stroke();
  }

  /////FOR Bezier Curve//////////////////////////////
  function drawBezierCurve(posX, posY) {
    // ctx.clearRect(0,0, innerWidth, innerHeight);
    ctx.beginPath();
    ctx.lineWidth = thickness;
    ctx.lineCap = lineCapString;
    ctx.strokeStyle = activeColor;
    ctx.globalAlpha = transparency;
    console.log(posArrayX, posArrayY);
    //quadraticCurveTo(cp1x, cp1y, x, y)
    //x,y = coordinates of the end poionts of the curve
    //cp1x, cp1y = coordinates of the first control point
    //In this case I think we have to use the moveTo
    ctx.moveTo(posArrayX[0], posArrayY[0]);
    // bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)

    //ctx.quadraticCurveTo(posArrayX[1], posArrayY[1], posArrayX[2], posArrayY[2], posX, posY);
    ctx.quadraticCurveTo(posArrayX[1], posArrayY[1], posX, posY, posArrayX[2], posArrayY[2]);
    ctx.stroke();
  }

  function drawBezierCurveGhost(posX, posY) {
    // ctx.clearRect(0,0, innerWidth, innerHeight);
    ctx.beginPath();
    ctx.lineWidth = thickness;
    ctx.lineCap = lineCapString;
    ctx.strokeStyle = activeColor;
    ctx.globalAlpha = transparency;
    console.log(posArrayX, posArrayY);
    //quadraticCurveTo(cp1x, cp1y, x, y)
    //x,y = coordinates of the end poionts of the curve
    //cp1x, cp1y = coordinates of the first control point
    //In this case I think we have to use the moveTo
    ctx.moveTo(posArrayX[0], posArrayY[0]);
    // ctx.quadraticCurveTo(canvas.width/2, canvas.height/2, posX, posY);
    //ctx.quadraticCurveTo(posArrayX[1], posArrayY[1], posArrayX[2], posArrayY[2], posX, posY);
    ctx.quadraticCurveTo(posArrayX[1], posArrayY[1], posX, posY, posArrayX[2], posArrayY[2]);
    ctx.stroke();

    setTimeout(()=> {
      deleteDrawBezierCurveGhost(posX, posY) ;
    },50)
  }

  function deleteDrawBezierCurveGhost(posX, posY) {
    // ctx.clearRect(0,0, innerWidth, innerHeight);
    ctx.beginPath();
    ctx.lineWidth = thickness+20;
    ctx.lineCap = lineCapString;
    ctx.strokeStyle = "white";
    console.log(posArrayX, posArrayY);
    //quadraticCurveTo(cp1x, cp1y, x, y)
    //x,y = coordinates of the end poionts of the curve
    //cp1x, cp1y = coordinates of the first control point
    //In this case I think we have to use the moveTo
    ctx.moveTo(posArrayX[0], posArrayY[0]);
    // ctx.quadraticCurveTo(canvas.width/2, canvas.height/2, posX, posY);
    //ctx.quadraticCurveTo(posArrayX[1], posArrayY[1], posArrayX[2], posArrayY[2], posX, posY);
    ctx.quadraticCurveTo(posArrayX[1], posArrayY[1], posX, posY, posArrayX[2], posArrayY[2]);
    ctx.stroke();
  }

/*
Path2D Objects
// The Path2D() constructor returns a newly instantiated Path2D object, optionally with
another path as an argument (creates a copy), or optionally with a string consisting of SVG path data.
new Path2D();     // empty path object
new Path2D(path); // copy from another Path2D object
new Path2D(d);    // path from SVG path data
All path methods like moveTo, rect, arc or quadraticCurveTo, etc., which we got
to know above, are available on Path2D objects.

It is easier to use it to copy and past, so I will do
above an simple example. We will use it to improve
our code!

*/

// function draw() {
//
//   let rectangle = new Path2D();
//   rectangle.rect(10,10,50,50);
//
//   let circle = new Path2D();
//   circle.moveTo(125,35);
//   circle.arc(100,35,25,0,2*Math.PI);
// console.log("Canvas Width': " + canvas.width);
//   for(var indexX=100; indexX < 600; indexX = indexX + 52) {
//     circle.arc(indexX,35,25,0,2*Math.PI);
//     // ctx.stroke(circle);
//     console.log(`Circles: ${circle}`);
//   }
//   console.log("outside");
//   ctx.fill(rectangle);
//   ctx.stroke(circle);
//
// }

/*Using SVG paths*/
/*Another powerful feature of the new canvas Path2D API is using SVG path data
 to initialize paths on your canvas. */

/*
The path will move to point (M10 10) and then move horizontally 80 points to
the right (h 80), then 80 points down (v 80), then 80 points to the left (h -80),
and then back to the start (z).
*/
// function SVG() {
//   let p = new Path2D('M10 10 h 80 v 180 h -80 Z');
//   ctx.stroke(p);
// }

// SVG();
// draw();


  ////////////////////////////////////////////////////
  //MOUSEEEEEEEEEEEEEEEEEEEEEEEE

  $("#canvas").mousedown(function(event) {
    if ($(".bStift").hasClass("active")) {
      stiftActive = true;
      let cursorPositions = getCursorPosition(canvas, event);
      draw(cursorPositions[0], cursorPositions[1]);

    //lineCap "butt do not work with Stift"
    $("#lineCap")[0].max = 1;
  } else {
    $("#lineCap")[0].max = 2;
  };
    if ($(".bErase").hasClass("active")) {
      eraseActive = true;
      let cursorPositions = getCursorPosition(canvas, event);
      erase(cursorPositions[0], cursorPositions[1]);
    };
    if ($(".bStraightLine").hasClass("active")) {
      straightLine = true;
      let cursorPositions = getCursorPosition(canvas, event);
      posArrayX.push(cursorPositions[0]);
      posArrayY.push(cursorPositions[1]);
      console.log(`First X position: ${cursorPositions[0]}`);
      console.log(`First Y position: ${cursorPositions[1]}`);
    };
    if ($(".bRect").hasClass("active")) {
      rectActive = true;
      let cursorPositions = getCursorPosition(canvas, event);
      firstPosClickX = cursorPositions[0];
      firstPosClickY = cursorPositions[1];
    };

    if ($(".bCircle").hasClass("active")) {
      circleActive = true;
      let cursorPositions = getCursorPosition(canvas, event);
      firstPosClickX = cursorPositions[0];
      firstPosClickY = cursorPositions[1];
    };

    if ($(".bBezierQ").hasClass("active")) {
        bezierQActive = true;
        let cursorPositions = getCursorPosition(canvas, event);
        posArrayX.push(cursorPositions[0]);
        posArrayY.push(cursorPositions[1]);

        console.log(`posArrayX: ${cursorPositions[0]}`);
        console.log(`posArrayY: ${cursorPositions[1]}`);
        switch(posArrayX.length) {
          case 1:
            ctx.font = "30px Arial";
            //fillText(text,x,y); - draws "filled" text on the canvas
            ctx.fillStyle = "blue";
            ctx.fillText("1", cursorPositions[0], cursorPositions[1]);
            break;
          case 2:
            //ctx.font = "30px Arial";
            //fillText(text,x,y); - draws "filled" text on the canvas
            ctx.fillStyle = "blue";
            ctx.fillText("2", cursorPositions[0], cursorPositions[1]);
            break;
          case 3:
            //ctx.font = "30px Arial";
            //fillText(text,x,y); - draws "filled" text on the canvas
            ctx.fillStyle = "red";
            ctx.fillText("3", cursorPositions[0], cursorPositions[1]);
            break;

          default:
            console.log("not matched");

        }

    };

    if ($(".bBezierC").hasClass("active")) {
      bezierCActive = true;
      let cursorPositions = getCursorPosition(canvas, event);
      posArrayX.push(cursorPositions[0]);
      posArrayY.push(cursorPositions[1]);
      console.log(`posArrayX: ${cursorPositions[0]}`);
      console.log(`posArrayY: ${cursorPositions[1]}`);

      switch(posArrayX.length) {
        case 1:
          ctx.font = "30px Arial";
          //fillText(text,x,y); - draws "filled" text on the canvas
          ctx.fillStyle = "blue";
          ctx.fillText("1", cursorPositions[0], cursorPositions[1]);
          break;
        case 2:
          //ctx.font = "30px Arial";
          //fillText(text,x,y); - draws "filled" text on the canvas
          ctx.fillStyle = "red";
          ctx.fillText("2", cursorPositions[0], cursorPositions[1]);
          break;
        case 3:
          //ctx.font = "30px Arial";
          //fillText(text,x,y); - draws "filled" text on the canvas
          ctx.fillStyle = "red";
          ctx.fillText("3", cursorPositions[0], cursorPositions[1]);
          break;

        case 4:
          //ctx.font = "30px Arial";
          //fillText(text,x,y); - draws "filled" text on the canvas
          ctx.fillStyle = "blue";
          ctx.fillText("4", cursorPositions[0], cursorPositions[1]);
          break;

        default:
          console.log("not matched");

      }
    };
  })

  $("#canvas").mousemove(function(event) {
    if (stiftActive) {
      let cursorPositions = getCursorPosition(canvas, event);
      // console.log(cursorPositions[0], cursorPositions[1]);
      draw(cursorPositions[0], cursorPositions[1]);
    };
    if (eraseActive) {
      let cursorPositions = getCursorPosition(canvas, event);
      erase(cursorPositions[0], cursorPositions[1]);
    };
    if (straightLine) {
      let cursorPositions = getCursorPosition(canvas, event);
      drawStraightLineGhost(cursorPositions[0], cursorPositions[1]);
    }

    if (rectActive) {
      let cursorPositions = getCursorPosition(canvas, event);
      drawRectGhost(cursorPositions[0], cursorPositions[1]);
    }

    if (circleActive) {
      let cursorPositions = getCursorPosition(canvas, event);
      drawCircleGhost(cursorPositions[0], cursorPositions[1]);
    }

    if (bezierQActive) {
      let cursorPositions = getCursorPosition(canvas, event);
      drawBezierGhost(cursorPositions[0], cursorPositions[1]);
    }

    if (bezierCActive) {

      let cursorPositions = getCursorPosition(canvas, event);
      drawBezierCurveGhost(cursorPositions[0], cursorPositions[1]);
    }

  });



  $("#canvas").mouseup(function(event) {
    /*reseting*/
    stiftActive = false;
    eraseActive = false;

    if(rectActive) {
      let cursorPositions = getCursorPosition(canvas, event);
      drawRect(cursorPositions[0], cursorPositions[1]);
      rectActive = false;
    }

    if(circleActive) {
      let cursorPositions = getCursorPosition(canvas, event);
      drawCircle(cursorPositions[0], cursorPositions[1]);
      circleActive = false;
    }

    if (straightLine) {
      let cursorPositions = getCursorPosition(canvas, event);
      posArrayX.push(cursorPositions[0]);
      posArrayY.push(cursorPositions[1]);
      console.log(`Last X position: ${cursorPositions[0]}`);
      console.log(`Last Y position: ${cursorPositions[1]}`);
      drawStraightLine(posArrayX, posArrayY);
      straightLine = false;
      posArrayX = [];
      posArrayY = [];
    }

    if(posArrayY.length >= 3 && bezierQActive) {
      bezierQActive = false;
      let cursorPositions = getCursorPosition(canvas, event);
      //Erasing the numbers:
      ctx.fillStyle = "white";
      ctx.strokeStyle = "white";
      ctx.font = "30px Arial";
      ctx.fillText("1", posArrayX[0], posArrayY[0]);
      ctx.fillText("2", posArrayX[1], posArrayY[1]);
      ctx.fillText("3", posArrayX[2], posArrayY[2]);
      ctx.strokeText("1", posArrayX[0], posArrayY[0]);
      ctx.strokeText("2", posArrayX[1], posArrayY[1]);
      ctx.strokeText("3", posArrayX[2], posArrayY[2]);

      drawBezier(cursorPositions[0], cursorPositions[1]);

      posArrayX = [];
      posArrayY = [];

    }


    if (posArrayY.length >= 4 && bezierCActive) {
      //Erasing the numbers:
      ctx.fillStyle = "white";
      ctx.strokeStyle = "white";
      ctx.font = "30px Arial";
      ctx.fillText("1", posArrayX[0], posArrayY[0]);
      ctx.fillText("2", posArrayX[1], posArrayY[1]);
      ctx.fillText("3", posArrayX[2], posArrayY[2]);
      ctx.fillText("4", posArrayX[3], posArrayY[3]);
      ctx.strokeText("1", posArrayX[0], posArrayY[0]);
      ctx.strokeText("2", posArrayX[1], posArrayY[1]);
      ctx.strokeText("3", posArrayX[2], posArrayY[2]);
      ctx.strokeText("4", posArrayX[3], posArrayY[3]);
      let cursorPositions = getCursorPosition(canvas, event);
      drawBezierCurve(cursorPositions[0], cursorPositions[1]);
      posArrayX = [];
      posArrayY = [];
      bezierCActive = false;
    }

  })

  /**nav functions:*/

  /*reset nav buttons function*/
  function resetButtons() {
    /*reseting other buttons*/
    if (activeButtons.length > 1) {
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
  $(".bFill").click(() => {
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, canvas[0].width, canvas[0].height);
    $(".bFill").toggleClass("active");
    activeButtons.push(".bFill");
    resetButtons();
  });
  //bFillElement
  //bFill
  $(".bFillElement").click(() => {
    $(".bFillElement").toggleClass("active");
    activeButtons.push(".bFillElement");
    resetButtons();
  });
  //bStraightLine
  $(".bStraightLine").click(() => {
    $(".bStraightLine").toggleClass("active");
    activeButtons.push(".bStraightLine");
    resetButtons();
  });

  //bRectangle
  $(".bRect").click(() => {
    $(".bRect").toggleClass("active");
    activeButtons.push(".bRect");
    resetButtons();
  });

  //bCircle
  $(".bCircle").click(() => {
    $(".bCircle").toggleClass("active");
    activeButtons.push(".bCircle");
    resetButtons();
  });

  //bBezierQ
  $(".bBezierQ").click(() => {
    $(".bBezierQ").toggleClass("active");
    activeButtons.push(".bBezierQ");
    resetButtons();
  });
  //bBezierC
  $(".bBezierC").click(() => {
    $(".bBezierC").toggleClass("active");
    activeButtons.push(".bBezierC");
    resetButtons();
  });

  $(".bSelect").click(() => {
    $(".bSelect").toggleClass("active");
    activeButtons.push(".bSelect");
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

$("#transparency").change( () => {
  transparency = $("#transparency")[0].value;
  console.log($("#transparency")[0].value);
});

$("#thickness").change( () => {
  thickness = $("#thickness")[0].value;
  console.log($("#thickness")[0].value);
})

$("#lineCap").change( () => {
  lineCapString = lineCap[($("#lineCap")[0].value)];

  console.log(($("#lineCap")[0].value))
})



  /*if you resize the window, then you have
  to click the .bZoom again or addAnEventListener*/
  /*jQuery equivalent of JavaScript's addEventListener method*/
  // window.addEventListener("resize", () => {
  //
  // });
  $(window).on("resize", function() {
    if ($(".bZoom").hasClass("active")) {
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
  let animation = function() {
    ctx.fillStyle = "green";
    for (let index = 1; index <= canvas[0].width; index++) {
      setTimeout(() => {
        console.log(index);
        ctx.fillRect(0, 0, index, canvas[0].height);
      }, 10)
    }
  }

  console.log("This is a log");
  console.warn("this is a warn");


});
