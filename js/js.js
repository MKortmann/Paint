"use strict";

/**
 * The code is composed and written in the order below:
 * PART 1: INITIALIZATION: GLOBAL Variables & Arrays & Classes
 * Create the GLOBAL Variables & Arrays & Classes:
 * Class Line: used to draw lines and the respectives attributes/methods
 * Class Rectangle: used to draw rectangle and the respectives attributes/methods
 * Class Circle: used to draw rectangle and the respectives attributes/methods
 * Class Bezier Quadratic: used to draw rectangle and the respectives attributes/methods
 * PART 2: INITIALIZE THE CANVAS & MAIN GLOBAL FUNCTIONS AS SELECT, REDO; UNDO; PRINT!
 * initialize canvas, function to resize it, function do free draw pencil, function to erase
 * Then global functions to detect if an element was selected/clicked.
 * Include also some extra functions as redo, undo, printCanvas,
 * saveCanvas. reset & set some global parameters
 * global function resetbuttons to reset the other buttons as soon you clicked
 * in another one. It add and remove the class active. The class active works as
 * a flag.
 * PART 3: MOUSE EVENTS: MOUSE DOWN; MOVE & UP! It does the main engine!
 * MOUSE DOWN: as soon you click at the mouse in the canvas it detect
 * which tool you have selected and do the respective job. It uses the class active
 * as a flag!
 * MOUSE MOVE: keep checking if have to do the respective action in accord to the
 * flag activated last movement!
 * MOUSE UP: checked what was active last time to reset it or do another cycle, as
 * in case of bezier.
 * PARTE 4: PRINT EXTRA INTERACTION (SETTINGS; BUTTONS, ZOOM IN...)
 * In the end you have a simple implementation for the HTML elements as
 * buttons, input, palette colors.
 * @summary Paint Program concise functionality description.
 */

jQuery(document).ready(function($) {

    /*
     ***PART 1: INITIALIZATION: GLOBAL Variables & Arrays & Classes
     */

    /*Global Declarations*/
    let stiftActive = false;
    let eraseActive = false;
    let rectActive = false;
    let circleActive = false;
    let bezierQActive = false;
    let bezierCActive = false;
    let straightLine = false;
    let straightLine2 = false;
    //for select
    let copy = false;
    let paste = false;
    let imageData = 0;
    let pixel = 0;
    let color = 0;
    //End of select
    let posArrayX = [];
    let posArrayY = [];
    let firstPosClickX = 0;
    let firstPosClickY = 0;
    let activeButtons = [];
    let activeColor = "black";
    let transparency = 1;
    let thickness = 20;
    //"butt" lineCap DO NOT WORK, With
    let lineCap = ["square", "round", "butt"];
    let dashIndex = 0;
    let gradient = false;
    let linearGradient = 0;
    let radialGradient = 0;
    let textDraw = false;
    let lineCapString = "round";
    // let width = $(window).width();
    let width = 1900;
    let height = 560;
    /*Undo Function*/
    //TODO: I want to simplify here. I want to remove flag and 1 array.

    let globalArray = new Array();
    let globalRedo = new Array();
    let canvasImg = new Image();

    //the array below will store all the object created in canvas! In this way
    //it will be easy to move, copy and delete then!
    //Global Arrays!
    let oGlobalLineArray = [];
    let oGlobalRectArray = [];
    let oGlobalCircleArray = [];
    let oGlobalBezierArray = [];
    let oGlobalBezierCArray = [];

    /**
     * @description Represents a Line
     * @constructor
     * @param {posX} posX - get the x mouse UP release position at canvas
     * @param {posY} posY - get the y mouse UP clicked position at canvas
     */

    class Line {
        constructor(posX, posY) {
            this.firstPosClickX = firstPosClickX;
            this.firstPosClickY = firstPosClickY;
            this.posX = posX;
            this.posY = posY;
            this.deltaX = 0;
            this.deltaY = 0;
            //global infos
            this.gradient = gradient;
            this.lineWidth = thickness;
            this.lineCap = lineCapString;
            this.activeColor = activeColor;
            this.dashIndex = dashIndex;
            this.globalAlpha = transparency;
            this.fillStyle = linearGradient;
            //flags
            this.clicked = false;

        };

        calcLineEqMatchClicked(clickedX, clickedY) {
            //basic math linear equation: y = mx + b; m=line inclination=dy/dx
            let m = (this.firstPosClickY - this.posY) / (this.firstPosClickX - this.posX);
            //calculate the b
            let b = this.posY - m * this.posX;
            //if the result is very small, it means that you have clicked the line!!
            let result = -clickedY + m * clickedX + b;
            return result;
        }

        drawStraightLine(posX = this.posX, posY = this.posY, translate) {
            this.deltaX = this.firstPosClickX - posX;
            this.deltaY = this.firstPosClickY - posY;
            ctx.beginPath();
            ctx.lineWidth = this.lineWidth;
            ctx.lineCap = this.lineCapString;
            console.log(this.lineCapString);
            ctx.setLineDash([this.lineWidth, this.dashIndex * this.lineWidth]); /*dashes are x and spaces are y*/
            if (this.gradient === "true") {
                if (translate === false) {
                    console.log(`The values are: X: ${this.firstPosClickX}, Y: ${this.firstPosClickY}, posX: ${this.posX}, posY: ${this.posY}`);
                    linearGradient = ctx.createLinearGradient(this.firstPosClickX, this.firstPosClickY, posX, posY);
                    linearGradient.addColorStop(1, 'white');
                    linearGradient.addColorStop(0, this.activeColor);
                } else {
                    linearGradient = ctx.createLinearGradient(this.firstPosClickX - this.deltaX, this.firstPosClickY - this.deltaY, this.posX - this.deltaX, this.posY - this.deltaY);
                    linearGradient.addColorStop(1, 'white');
                    linearGradient.addColorStop(0, this.activeColor);
                }
                ctx.strokeStyle = linearGradient;
            } else {
                ctx.strokeStyle = this.activeColor;
            }
            ctx.globalAlpha = this.globalAlpha;
            //check if you draw a new line or only translate it!
            if (translate === true) {

                ctx.moveTo(this.firstPosClickX - this.deltaX, this.firstPosClickY - this.deltaY);
                ctx.lineTo(this.posX - this.deltaX, this.posY - this.deltaY);
                ctx.stroke();
            } else {
                ctx.moveTo(this.firstPosClickX, this.firstPosClickY);
                ctx.lineTo(posX, posY);
                ctx.stroke();
            }

        }

        drawStraightLineGhost(posX, posY) {
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.lineCap = "round";
            ctx.strokeStyle = "rgba(255, 160, 122, 0.3)";
            ctx.moveTo(firstPosClickX, firstPosClickY);
            ctx.lineTo(posX, posY);
            ctx.stroke();

            setTimeout(() => {
                //ctx.clearRect(0,0, innerWidth, innerHeight);
                this.deleteStraightLineGhost(posX, posY);
            }, 100);
        }

        deleteStraightLineGhost(posX, posY) {
            ctx.beginPath();
            ctx.lineWidth = 6;
            ctx.lineCap = "round";
            ctx.strokeStyle = "white";
            ctx.moveTo(firstPosClickX, firstPosClickY);
            ctx.lineTo(posX, posY);
            ctx.stroke();
        }

        focusLine() {
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.lineCap = "round";
            ctx.strokeStyle = "rgba(255, 160, 122, 0.8)";
            ctx.setLineDash([this.lineWidth, 2 * this.lineWidth]);
            ctx.moveTo(this.firstPosClickX, this.firstPosClickY);
            ctx.lineTo(this.posX, this.posY);
            ctx.stroke();
            // $("#canvas").css("cursor", "pointer");
        }

        eraseLine() {
            ctx.beginPath();
            ctx.lineWidth = this.lineWidth + 4;
            ctx.lineCap = "round";
            ctx.strokeStyle = "white";
            ctx.setLineDash([]);
            ctx.moveTo(this.firstPosClickX, this.firstPosClickY);
            ctx.lineTo(this.posX, this.posY);
            ctx.stroke();
            // $("#canvas").css("cursor", "pointer");
        }

        updateLine(posX, posY) {
            this.firstPosClickX = this.firstPosClickX - this.deltaX;
            this.posX = this.posX - this.deltaX;

            this.firstPosClickY = this.firstPosClickY - this.deltaY;
            this.posY = this.posY - this.deltaY;
            this.clicked = false;
        }
    }

    /**
     * @description Represents a Rectangle
     * @constructor
     * @param {posClickX} posClickX - get the x mouse clicked position at canvas
     * @param {posClickY} posClickY - get the y mouse clicked position at canvas
     * @param {width} width - rectangle width = last x position - firstPosClickX
     * @param {height} height - rectangle width = last y position - firstPosClickY
     */
    class Rectangle {
        constructor(firstPosClickX = 0, firstPosClickY = 0, posX = 100, posY = 100) {
            this.firstPosClickX = firstPosClickX;
            this.firstPosClickY = firstPosClickY;
            this.width = posX - firstPosClickX;
            this.height = posY - firstPosClickY;
            //global infos
            this.gradient = gradient;
            this.lineWidth = thickness;
            this.lineCap = lineCapString;
            this.activeColor = activeColor;
            this.dashIndex = dashIndex;
            this.globalAlpha = transparency;
            this.fillStyle = linearGradient;
            //flags
            this.clicked = false;
        }

        eraseRect() {
            ctx.beginPath();
            ctx.lineWidth = this.lineWidth + 4;
            ctx.strokeStyle = "white";
            ctx.fillStyle = "white";
            //reset setLineDash
            ctx.setLineDash([]);
            ctx.fillRect(this.firstPosClickX, this.firstPosClickY, this.width, this.height);
            ctx.rect(this.firstPosClickX, this.firstPosClickY, this.width, this.height);
            ctx.stroke();
        }

        focusRect() {
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.strokeStyle = "rgba(255, 160, 122, 0.8)";
            ctx.setLineDash([this.lineWidth, 2 * this.lineWidth]);
            ctx.fillRect(this.firstPosClickX, this.firstPosClickY, this.width, this.height);
            ctx.rect(this.firstPosClickX - 2, this.firstPosClickY - 2, this.width + 4, this.height + 4);
            ctx.stroke();
            // $("#canvas").css("cursor", "pointer");
        }

        drawRect(newPosClickX = this.firstPosClickX, newPosClickY = this.firstPosClickY) {
            if (this.gradient === "true") {
                ctx.beginPath();
                //ctx.createLinearGradient(x0, y0, x1, y1);
                //it determines the start of the gradient (x0,y0) and the end of the gradient (x1,y1);
                linearGradient = ctx.createLinearGradient(newPosClickX, newPosClickY, newPosClickX + this.width, newPosClickY + this.height);
                console.log(`The values are: X: ${newPosClickX}, Y: ${newPosClickY}, W: ${this.width}, H: ${this.height}`);
                linearGradient.addColorStop(0, this.activeColor);
                linearGradient.addColorStop(1, 'white');
                console.log(linearGradient);
                ctx.fillStyle = linearGradient;
                ctx.fillRect(newPosClickX, newPosClickY, this.width, this.height);
                ctx.strokeStyle = "black";
                ctx.lineWidth = 2;
                ctx.rect(newPosClickX, newPosClickY, this.width, this.height);
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.lineWidth = this.lineWidth;
                ctx.fillStyle = "white";
                ctx.strokeStyle = this.activeColor;
                ctx.setLineDash([this.lineWidth, this.dashIndex * this.lineWidth]);
                // ctx.rect(newPosClickX,newPosClickY, this.height, this.width);
                ctx.rect(newPosClickX, newPosClickY, this.width, this.height);
                ctx.stroke();
            }
            // $("#canvas").css("cursor", "default");
        }
        updateRect(newPosClickX, newPosClickY) {
            this.firstPosClickX = newPosClickX;
            this.firstPosClickY = newPosClickY;
            this.clicked = false;
        }
        //to make a nice effect and let the program user friendly!
        drawRectGhost(posX, posY) {
            // $("#canvas").css("cursor", "nwse-resize");
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.lineCap = "round";
            ctx.strokeStyle = "rgba(255, 160, 122, 0.3)";

            ctx.rect(firstPosClickX, firstPosClickY, posX - firstPosClickX, posY - firstPosClickY);
            ctx.stroke();

            setTimeout(() => {
                this.deleteRectGhost(posX, posY);
            }, 50);
        }
        deleteRectGhost(posX, posY) {
            ctx.beginPath();
            ctx.lineWidth = 6;
            ctx.lineCap = "round";
            ctx.fillStyle = "white";
            /*clear and fill Rect have the same results*/
            ctx.fillRect(firstPosClickX - 3, firstPosClickY - 3, posX - firstPosClickX + 8, posY - firstPosClickY + 8);
        }
    }

    /**
     * @description Represents a Circle
     * @constructor
     * @param {posX} posX - the x center position of the circle get at mouseUp
     * @param {posY} posY - the y center position of the circle get at mouseUp
     */
    class Circle {
        constructor(posX, posY) {
            this.firstPosClickX = firstPosClickX;
            this.firstPosClickY = firstPosClickY;
            this.posX = posX;
            this.posY = posY;
            //global infos
            this.gradient = gradient;
            this.lineWidth = thickness;
            this.lineCap = lineCapString;
            this.activeColor = activeColor;
            this.dashIndex = dashIndex;
            this.globalAlpha = transparency;
            this.fillStyle = linearGradient;
            this.radius = Math.abs(((firstPosClickX - posX) + (firstPosClickY - posY)) / 2);
            //flags
            this.clicked = false;
        }

        drawCircle(posX = this.posX, posY = this.posY) {
            // $("#canvas").css("cursor", "default");
            // ctx.clearRect(0,0, innerWidth, innerHeight);
            ctx.beginPath();
            ctx.lineWidth = this.lineWidth;
            ctx.lineCap = this.lineCap;
            ctx.setLineDash([this.lineWidth, this.dashIndex * this.lineWidth]); /*dashes are x and spaces are y*/
            ctx.strokeStyle = this.activeColor;
            ctx.globalAlpha = this.globalAlpha;
            console.log(posArrayX, posArrayY);

            if (gradient === "true") {
                /*Let's use radial gradient: creates a radial gradient using the size and
                coordinates of two circles.
                ////:
                createRadialGradient(x1, y1, r1, x2, y2, r2)
                We have to circles with each having the center at x1,y1 and x2,y2 and with
                the respective radius: r1 and r2. Interesting that it seems to be given in
                grad and not radians. TO BE CHECKED!!!     */
                radialGradient = ctx.createRadialGradient(this.posX - this.radius, this.posY - this.radius, 360, this.posX, this.posY, 8);
                radialGradient.addColorStop(0.5, activeColor);
                radialGradient.addColorStop(0.7, "#ECF0F1");
                radialGradient.addColorStop(1, activeColor);
                // ctx.fillStyle = linearGradient;
                // ctx.strokeStyle = activeColor;
                console.log("inside");
                ctx.fillStyle = radialGradient;
                //ctx.arc(x, y, radius, startAngle, endAngle [, anticlockwise]);
                ctx.arc(posX, posY, this.radius, Math.PI * 2, false);
                ctx.fill();
            } else {
                ctx.arc(posX, posY, this.radius, Math.PI * 2, false);
                ctx.stroke();

            }
            console.log(`The radius is: ${this.radius}`);
            // $("#canvas").css("cursor", "default");
        }

        drawCircleGhost(posX, posY) {
            // $("#canvas").css("cursor", "nwse-resize");
            // ctx.clearRect(0,0, innerWidth, innerHeight);
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.strokeStyle = "rgba(255, 160, 122, 0.3)";
            console.log(posX, posY);
            ctx.arc(posX, posY, this.radius, Math.PI * 2, false);
            ctx.stroke();

            setTimeout(() => {
                this.deleteDrawCircleGhost(posX, posY);
            }, 50);

        }

        deleteDrawCircleGhost(posX, posY) {
            // ctx.clearRect(0,0, innerWidth, innerHeight);
            ctx.beginPath();
            ctx.lineWidth = 8;
            ctx.strokeStyle = "white";
            console.log(posX, posY);
            ctx.arc(posX, posY, this.radius, Math.PI * 2, false);
            ctx.stroke();
        }

        focusCircle() {
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.strokeStyle = "rgba(255, 160, 122, 0.8)";
            ctx.setLineDash([this.lineWidth, 2 * this.lineWidth]);
            console.log(this.posX, this.posY);
            ctx.arc(this.posX, this.posY, this.radius, Math.PI * 2, false);
            ctx.stroke();
            // $("#canvas").css("cursor", "pointer");
        }

        eraseCircle() {
            ctx.beginPath();
            ctx.fillStyle = "white";
            ctx.setLineDash([]);
            console.log(this.posX, this.posY);
            ctx.arc(this.posX, this.posY, this.radius + this.lineWidth, Math.PI * 2, false);
            ctx.fill();
        }

        updateCircle(posX, posY) {
            this.posX = posX;
            this.posY = posY;
        }

    }

    /**
     * @description Represents a Bezier
     * @constructor
     * @param {posX} posX - the x end/last position of the curve get at mouseUp
     * @param {posY} posY - the y end/last position of the curve get at mouseUp
     */
    class Bezier extends Line {
        constructor(posX, posY) {
            super(posX, posY);
            this.posArrayX = posArrayX;
            this.posArrayY = posArrayY;
            this.x = 0;
            this.y = 0;
            this.t = 0.5;

            this.middlePoint();
        }

        /*We calculate the middle point to be use here to move the line and to refine
        the computation for the select function.*/
        middlePoint() {
            //Given the bézier Curves as given in Wikipedia
            // B(t) = (1-t)**2 * P0 + 2(1-t)tP1 + t**2P2, t as [0,1];

            //Let's so find this point!
            /*P0x = posArrayX[0]; 364, 76
            P1x =  this.posX;   267, 129
            P2x = posArrayX[1]*/ //374,207
            //
            this.t = 0.5;
            //364,25 + 133,5 +    93,5 = 591,25
            this.x = (1 - this.t) ** 2 * this.posArrayX[0] + 2 * (1 - this.t) * this.t * this.posX + (this.t ** 2) * this.posArrayX[1];
            //76,25 + 64,5 + 51,75 = 192,51
            this.y = (1 - this.t) ** 2 * this.posArrayY[0] + 2 * (1 - this.t) * this.t * this.posY + (this.t ** 2) * this.posArrayY[1];

            console.log(`the NEW x and y values are: X: ${this.x}, Y: ${this.y}`);

        }

        drawBezier(posX, posY) {
            // ctx.clearRect(0,0, innerWidth, innerHeight);
            ctx.beginPath();
            ctx.lineWidth = this.lineWidth;
            ctx.lineCap = this.lineCap;
            ctx.setLineDash([this.lineWidth, this.dashIndex * this.lineWidth]); /*dashes are x and spaces are y*/
            ctx.strokeStyle = this.activeColor;
            ctx.globalAlpha = this.globalAlpha;

            if (gradient === "true") {
                linearGradient = ctx.createLinearGradient(this.posX, this.posY, this.posArrayX[1], this.posArrayY[1]);
                linearGradient.addColorStop(1, 'white');
                linearGradient.addColorStop(0, this.activeColor);
                // ctx.fillStyle = linearGradient;
                // ctx.strokeStyle = activeColor;
                ctx.strokeStyle = linearGradient;
                // console.log(posArrayX, posArrayY);
                //quadraticCurveTo(cp1x, cp1y, x, y)
                //x,y = coordinates of the end poionts of the curve
                //cp1x, cp1y = coordinates of the first control point
                //In this case I think we have to use the moveTo
                ctx.moveTo(this.posArrayX[0], this.posArrayY[0])
                // ctx.quadraticCurveTo(canvas.width/2, canvas.height/2, posX, posY);
                ctx.quadraticCurveTo(this.posX, this.posY, this.posArrayX[1], this.posArrayY[1]);
                ctx.stroke();
            } else {
                ctx.strokeStyle = this.activeColor;
                // console.log(posArrayX, posArrayY);
                //quadraticCurveTo(cp1x, cp1y, x, y)
                //x,y = coordinates of the end poionts of the curve
                //cp1x, cp1y = coordinates of the first control point
                //In this case I think we have to use the moveTo
                ctx.moveTo(this.posArrayX[0], this.posArrayY[0])
                // ctx.quadraticCurveTo(canvas.width/2, canvas.height/2, posX, posY);
                ctx.quadraticCurveTo(this.posX, this.posY, this.posArrayX[1], this.posArrayY[1]);
                ctx.stroke();
            }



        }

        drawBezierGhost(posX, posY) {
            // ctx.clearRect(0,0, innerWidth, innerHeight);

            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.lineCap = this.lineCap;
            ctx.strokeStyle = "rgba(255, 160, 122, 0.3)";
            ctx.globalAlpha = this.globalAlpha;
            // console.log(posArrayX, posArrayY);
            //quadraticCurveTo(cp1x, cp1y, x, y)
            //x,y = coordinates of the end poionts of the curve
            //cp1x, cp1y = coordinates of the first control point
            //In this case I think we have to use the moveTo
            ctx.moveTo(posArrayX[0], posArrayY[0]);
            ctx.quadraticCurveTo(posX, posY, posArrayX[1], posArrayY[1]);
            ctx.stroke();

            setTimeout(() => {
                this.deleteDrawBezierGhost(posX, posY);
            }, 50)
        }

        deleteDrawBezierGhost(posX, posY) {
            // ctx.clearRect(0,0, innerWidth, innerHeight);
            ctx.beginPath();
            ctx.lineWidth = 10;
            ctx.lineCap = this.lineCap;
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

        focusBezier() {
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.strokeStyle = "rgba(255, 160, 122, 0.8)";
            ctx.setLineDash([this.lineWidth, 2 * this.lineWidth]);

            ctx.moveTo(this.posArrayX[0], this.posArrayY[0])
            // ctx.quadraticCurveTo(canvas.width/2, canvas.height/2, posX, posY);
            ctx.quadraticCurveTo(this.posX, this.posY, this.posArrayX[1], this.posArrayY[1]);
            ctx.stroke();
            // $("#canvas").css("cursor", "pointer");
        }

        eraseBezier() {
            ctx.beginPath();
            ctx.lineWidth = this.lineWidth + 5;
            ctx.strokeStyle = "white";
            ctx.setLineDash([]);

            ctx.moveTo(this.posArrayX[0], this.posArrayY[0])
            // ctx.quadraticCurveTo(canvas.width/2, canvas.height/2, posX, posY);
            ctx.quadraticCurveTo(this.posX, this.posY, this.posArrayX[1], this.posArrayY[1]);
            ctx.stroke();
            this.clicked = false;
        }

        updateBezier(posX, posY) {

            //lösung 02: Finde the middle point and update from then!
            //we have to move the curve at same delta. So, I am using the
            //control point the position posArrayX[0] abd posArrayY[0] as reference.


            this.middlePoint();

            let DeltaYGap = this.y - posY;
            let DeltaXGap = this.x - posX;


            console.log(`the DeltaXGap and DeltaYGap values are: X: ${DeltaXGap}, Y: ${DeltaYGap}`);
            console.log(`the Array values are: X: ${this.posArrayX}, Y: ${this.posArrayY}`);
            console.log(`the this.posX and this.posY: X ${this.posX}, Y: ${this.posY}`);

            this.posArrayX[0] = this.posArrayX[0] - DeltaXGap;
            this.posArrayX[1] = this.posArrayX[1] - DeltaXGap;

            this.posArrayY[0] = this.posArrayY[0] - DeltaYGap;
            this.posArrayY[1] = this.posArrayY[1] - DeltaYGap;

            this.posX = this.posX - DeltaXGap;
            this.posY = this.posY - DeltaYGap;

            this.middlePoint();

        }

    };
    /**
     * @description Represents a Bezier Curve
     * @constructor
     * @param {posX} posX - the x end/last position of the curve get at mouseUp
     * @param {posY} posY - the y end/last position of the curve get at mouseUp
     */

    /////FOR Bezier Quadratic//////////////////////////////
    class BezierC extends Line {

        constructor(posX, posY) {
            super(posX, posY);
            this.posArrayX = posArrayX;
            this.posArrayY = posArrayY;
            this.t = 0;
            this.x = 0;
            this.y = 0;
            this.middlePointCurve();
        }

        /*We calculate the middle point to be use here to move the line and to refine
        the computation for the select function.*/
        middlePointCurve() {
            //Given the bézier Curves as given in Wikipedia
            // B(t) = (1-t)**3 * p0 + 3* (1 - t)**2 * t * P1 + 3*(1-t)*t**2 * P2 + t**3*P3, t as [0,1];

            this.t = 0.5;
            //364,25 + 133,5 +    93,5 = 591,25
            //35,625 + 127,125 + 127,875 + 35,75
            this.x = (1 - this.t) ** 3 * this.posArrayX[0] + 3 * (1 - this.t) ** 2 * this.t * this.posArrayX[1] +
                3 * (1 - this.t) * this.t ** 2 * this.posArrayX[2] + (this.t ** 3) * this.posX;

            this.y = (1 - this.t) ** 3 * this.posArrayY[0] + 3 * (1 - this.t) ** 2 * this.t * this.posArrayY[1] +
                3 * (1 - this.t) * this.t ** 2 * this.posArrayY[2] + (this.t ** 3) * this.posY;


            console.log(`posArrayX: ${this.posArrayX}, Y: ${this.posArrayX}`);
            console.log(`posX: ${this.posX}, Y: ${this.posY}`);
            console.log(`the NEW x and y values are: X: ${this.x}, Y: ${this.y}`);


        }


        drawBezierCurve(posX, posY) {
            // ctx.clearRect(0,0, innerWidth, innerHeight);
            ctx.beginPath();
            ctx.lineWidth = this.lineWidth;
            ctx.lineCap = this.lineCap;
            ctx.setLineDash([this.lineWidth, this.dashIndex * this.lineWidth]); /*dashes are x and spaces are y*/
            ctx.strokeStyle = this.activeColor;
            ctx.globalAlpha = this.globalAlpha;
            console.log(posArrayX, posArrayY);

            if (gradient === "true") {
                linearGradient = ctx.createLinearGradient(this.posArrayX[1], this.posArrayY[1], this.posX, this.posY);
                linearGradient.addColorStop(1, 'white');
                linearGradient.addColorStop(0, activeColor);
                // ctx.fillStyle = linearGradient;
                // ctx.strokeStyle = activeColor;
                ctx.strokeStyle = linearGradient;

                //quadraticCurveTo(cp1x, cp1y, x, y)
                //x,y = coordinates of the end poionts of the curve
                //cp1x, cp1y = coordinates of the first control point
                //In this case I think we have to use the moveTo
                ctx.moveTo(this.posArrayX[0], this.posArrayY[0]);
                // bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
                //ctx.quadraticCurveTo(posArrayX[1], posArrayY[1], posArrayX[2], posArrayY[2], posX, posY);
                ctx.quadraticCurveTo(this.posArrayX[1], this.posArrayY[1], this.posX, this.posY, this.posArrayX[2], this.posArrayY[2]);
                ctx.stroke();
            } else {
                ctx.strokeStyle = this.activeColor;
                //quadraticCurveTo(cp1x, cp1y, x, y)
                //x,y = coordinates of the end poionts of the curve
                //cp1x, cp1y = coordinates of the first control point
                //In this case I think we have to use the moveTo
                ctx.moveTo(this.posArrayX[0], this.posArrayY[0]);
                // bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
                //ctx.quadraticCurveTo(posArrayX[1], posArrayY[1], posArrayX[2], posArrayY[2], posX, posY);
                ctx.quadraticCurveTo(this.posArrayX[1], this.posArrayY[1], this.posX, this.posY, this.posArrayX[2], this.posArrayY[2]);
                ctx.stroke();
            }
        }

        drawBezierCurveGhost(posX, posY) {
            // ctx.clearRect(0,0, innerWidth, innerHeight);
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.lineCap = lineCapString;
            ctx.setLineDash([thickness, dashIndex * thickness]); /*dashes are x and spaces are y*/
            ctx.strokeStyle = "rgba(255, 160, 122, 0.3)";
            ctx.globalAlpha = transparency;
            console.log(posArrayX, posArrayY);
            //quadraticCurveTo(cp1x, cp1y, x, y)
            //x,y = coordinates of the end poionts of the curve
            //cp1x, cp1y = coordinates of the first control point
            //In this case I think we have to use the moveTo
            ctx.moveTo(this.posArrayX[0], this.posArrayY[0]);
            // ctx.quadraticCurveTo(canvas.width/2, canvas.height/2, posX, posY);
            //ctx.quadraticCurveTo(posArrayX[1], posArrayY[1], posArrayX[2], posArrayY[2], posX, posY);
            ctx.quadraticCurveTo(this.posArrayX[1], this.posArrayY[1], posX, posY, this.posArrayX[2], this.posArrayY[2]);
            ctx.stroke();

            setTimeout(() => {
                this.deleteDrawBezierCurveGhost(posX, posY);
            }, 50)
        }

        deleteDrawBezierCurveGhost(posX, posY) {
            // ctx.clearRect(0,0, innerWidth, innerHeight);
            ctx.beginPath();
            ctx.lineWidth = 10;
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

        focusBezierCurve() {
            ctx.beginPath();
            ctx.lineWidth = 5;
            ctx.strokeStyle = "rgba(255, 160, 122, 0.8)";
            ctx.setLineDash([this.lineWidth, 2 * this.lineWidth]);

            ctx.moveTo(this.posArrayX[0], this.posArrayY[0])
            ctx.quadraticCurveTo(this.posArrayX[1], this.posArrayY[1], this.posX, this.posY, this.posArrayX[2], this.posArrayY[2]);
            ctx.stroke();
            // $("#canvas").css("cursor", "pointer");
        }

        eraseBezierCurve() {
            ctx.beginPath();
            ctx.lineWidth = this.lineWidth + 5;
            ctx.strokeStyle = "white";
            ctx.setLineDash([]);

            ctx.moveTo(this.posArrayX[0], this.posArrayY[0])
            ctx.quadraticCurveTo(this.posArrayX[1], this.posArrayY[1], this.posX, this.posY, this.posArrayX[2], this.posArrayY[2]);
            ctx.stroke();
            this.clicked = false;

        }

        updateBezierCurve(posX, posY) {
            //lösung 02: Finde the middle point and update from then!
            //we have to move the curve at same delta. So, I am using the
            //control point the position posArrayX[0] abd posArrayY[0] as reference.

            this.middlePointCurve();

            //for better precision I will get the end point ! The middle point works not so
            //well as bezier quadratic because the middle point is not exactly in the curve.
            let DeltaYGap = this.posY - posY;
            let DeltaXGap = this.posX - posX;


            console.log(`the DeltaXGap and DeltaYGap values are: X: ${DeltaXGap}, Y: ${DeltaYGap}`);
            console.log(`the Array values are: X: ${this.posArrayX}, Y: ${this.posArrayY}`);
            console.log(`the this.posX and this.posY: X ${this.posX}, Y: ${this.posY}`);

            this.posArrayX[0] = this.posArrayX[0] - DeltaXGap;
            this.posArrayX[1] = this.posArrayX[1] - DeltaXGap;
            this.posArrayX[2] = this.posArrayX[2] - DeltaXGap;

            this.posArrayY[0] = this.posArrayY[0] - DeltaYGap;
            this.posArrayY[1] = this.posArrayY[1] - DeltaYGap;
            this.posArrayY[2] = this.posArrayY[2] - DeltaYGap;

            this.posX = this.posX - DeltaXGap;
            this.posY = this.posY - DeltaYGap;

            this.middlePointCurve();

        }
    }

    /*
     ***PART 2: INITIALIZE THE CANVAS & MAIN GLOBAL FUNCTIONS AS SELECT, REDO; UNDO; PRINT!
     */

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
        canvas[0].width = window.innerWidth;
        canvas[0].height = height;
        canvas.css("width", window.innerWidth);
        canvas.css("height", height);
    }
    /*You make sure that the attributes of canvas and css are the same!*/
    resizeCanvas(width, height);

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
        ctx.globalAlpha = transparency;
        ctx.lineCap = lineCapString;
        ctx.strokeStyle = "white";
        ctx.lineTo(posX, posY);
        ctx.stroke();
    }


    /*get active color*/
    $(".colorChart").click((e) => {
        // console.log(`clicked at: ${e.target.id}`);
        activeColor = e.target.id;
    });


    function elementLineClicked(posClickX, posClickY) {
        console.log(`You clicked at X: ${posClickX} and y: ${posClickY}`);
        let enlargeTarged = 3;
        //moving, second time clicked:
        //first time clicked:
        //Check The Rectangle

        oGlobalLineArray.forEach(function(line) {
            if (line.clicked === true) {
                console.log("it is true");
                line.clicked = false;
                console.log("flag setted to: " + line.clicked);
                if (!$(".bSelectPaste").hasClass("active")) {
                    line.eraseLine();
                } else {
                    line.drawStraightLine();
                }
                line.drawStraightLine(posClickX, posClickY, true);
                line.updateLine(posClickX, posClickY);

            } else {
                let result = line.calcLineEqMatchClicked(posClickX, posClickY);
                console.log(`The result is: ${result}`);

                if (Math.abs(result) < 8 && (posClickX + enlargeTarged) > line.firstPosClickX &&
                    (posClickX - enlargeTarged) < line.posX) {
                    console.log("MATCH");
                    line.clicked = true;
                    console.log("flag setted to: " + line.clicked);
                    line.focusLine();
                }
            }

        });

    }

    function elementRectClicked(posClickX, posClickY) {
        console.log(`You clicked at X: ${posClickX} and y: ${posClickY}`);
        let enlargeTarged = 5;
        //moving, second time clicked:
        //first time clicked:
        //Check The Rectangle
        oGlobalRectArray.forEach(function(rect) {
            if (rect.clicked === true) {
                console.log("true");
                if (!$(".bSelectPaste").hasClass("active")) {
                    rect.eraseRect();
                } else {
                    rect.drawRect();
                }
                rect.drawRect(posClickX, posClickY);
                rect.updateRect(posClickX, posClickY);
            } else {
                if (rect.firstPosClickX - enlargeTarged <= posClickX && posClickX <= (rect.firstPosClickX + rect.width + enlargeTarged)) {
                    if (rect.firstPosClickY <= posClickY && posClickY <= (rect.firstPosClickY + rect.height)) {
                        rect.focusRect();
                        rect.clicked = true;
                    }
                }
            }
        });
}

    function elementCircleClicked(posClickX, posClickY) {


          oGlobalCircleArray.forEach(function(circle) {


            //In all cases a point on the circle follows the rule x^2+y^2=radius^2
            //Most General Case:
            /* (x-a)^2+(y-b)^2=radius^2
            x = x-a;
            y = y-b;
            (a,b) are the point clicked at canvas
            (x,y) are the inicial point clicked at canvas firstPosClickX, firstPosClickY
            it represents the center of the circle.
            x-a, y-b we translate the center of the circle to another place.
            In this case, if radius is lower than initial radius, it means that we
            have clicked at the circle. Otherwise you clicked far away of it.

            In real case, our center will never be at 0,0. So, our a,b will be settle
            as soon as we create our rectangle. Let's say: firstPosClickX=3 and
            firstPosClickY=4. Radius = 6.
            So we have:
            (x-3)^2+(y-4)^2=6^2

            so, if (x,y) clicked is lower than 36 means that we have clicked at the
            circle!!
            */
            if (circle.clicked === false) {

                let radius = circle.radius;
                let centerXa = circle.posX;
                let centerYb = circle.posY;
                //circleEqResult should be less than 0, means that you have clicked at any pos.
                //inside the circle

                let circleEqResult = (posClickX - centerXa) ** 2 + (posClickY - centerYb) ** 2 - radius ** 2;

                if (circleEqResult <= 0) {
                    console.log("matched");
                    circle.clicked = true;
                    circle.focusCircle();
                }
            } else {
                circle.clicked = false;
                if (!$(".bSelectPaste").hasClass("active")) {
                    circle.eraseCircle();
                } else {

                    circle.drawCircle();
                }
                circle.updateCircle(posClickX, posClickY);
                circle.drawCircle(posClickX, posClickY);

            }

        });

      }



    function elementBezierClicked(posClickX, posClickY) {
        oGlobalBezierArray.forEach(function(bezier) {
            if (bezier.clicked === false) {

                //let's calculate as it was a small rectangle. It will be computational
                //faster to calculate all the t parameters that would be at least 8 towards
                //to infinite.
                //not so precise but as it is ok as proof of concept!
                //Now, instead of posX and posY we will use the middlePoint.
                //it will be preciser!!
                let xMax = Math.max(bezier.x,
                    bezier.posArrayX[0],
                    bezier.posArrayX[1]);
                let xMin = Math.min(bezier.x,
                    bezier.posArrayX[0],
                    bezier.posArrayX[1]);

                let yMax = Math.max(bezier.y,
                    bezier.posArrayY[0],
                    bezier.posArrayY[1]);
                let yMin = Math.min(bezier.y,
                    bezier.posArrayY[0],
                    bezier.posArrayY[1]);


                console.log(`X values: xMax: ${xMax}, xMin: ${xMin}`);
                console.log(`Y values: yMax: ${yMax}, yMin: ${yMin}`);
                console.log(`You clicked at: ${posClickX}, ${posClickY}`);

                if (xMin < posClickX && posClickX < xMax && yMin < posClickY && posClickY < yMax) {

                    console.log("MATCHED");
                    bezier.focusBezier();
                    bezier.clicked = true;

                }

            } else {
                if (!$(".bSelectPaste").hasClass("active")) {
                    bezier.eraseBezier();
                } else {
                    bezier.drawBezier();
                }
                bezier.updateBezier(posClickX, posClickY);
                bezier.clicked = false;
                bezier.drawBezier(posClickX, posClickY);
            }
        });
    }

    function elementBezierCClicked(posClickX, posClickY) {

        oGlobalBezierCArray.forEach( function (bezierC) {

            if (bezierC.clicked === false) {

                //let's calculate as it was a small rectangle. It will be computational
                //faster to calculate all the t parameters that would be at least 8 towards
                //to infinite.
                //not so precise but as it is ok as proof of concept!
                //Now, instead of posX and posY we will use the middlePoint.
                //it will be preciser!!
                let xMax = Math.max(bezierC.posX,
                    bezierC.posArrayX[0],
                    bezierC.x);
                let xMin = Math.min(bezierC.posX,
                    bezierC.posArrayX[0],
                    bezierC.x);

                let yMax = Math.max(bezierC.posY,
                    bezierC.posArrayY[0],
                    bezierC.y);
                let yMin = Math.min(bezierC.posY,
                    bezierC.posArrayY[0],
                    bezierC.y);


                console.log(`X values: xMax: ${xMax}, xMin: ${xMin}`);
                console.log(`Y values: yMax: ${yMax}, yMin: ${yMin}`);
                console.log(`You clicked at: ${posClickX}, ${posClickY}`);

                if (xMin < posClickX && posClickX < xMax && yMin < posClickY && posClickY < yMax) {

                    console.log("MATCHED");
                    bezierC.focusBezierCurve();
                    bezierC.clicked = true;

                }

            } else {
                console.log("SETTING CLICKED TO FALSE! Not matched!");
                if (!$(".bSelectPaste").hasClass("active")) {
                    bezierC.eraseBezierCurve();
                } else {
                    bezierC.drawBezierCurve();
                }
                bezierC.updateBezierCurve(posClickX, posClickY);
                bezierC.clicked = false;
                bezierC.drawBezierCurve(posClickX, posClickY);
            }



        });
    }


    //the flag is true as soon as we click to redo. It is necessary because
    //we need to remove one array from the globalArray. If not, after clicking in redo
    //and we click again in undo it will be necessary to click two times because it
    //stores two times the same array. So we make the flag to check it and if it
    //is true we pop it out.
    // let globalSavedNumbers = 0;

    // //Saving the last status of the canvas!
    globalPush();

    function globalPush() {
        // globalSavedNumbers++;
        //Saving Images. The HTMLCanvasElement provcides a toDataURL() method, which
        //is useful when saving images.
        //Create a PNG image with the default settings.
        globalArray.push(canvas[0].toDataURL());
        console.log(`we are at the global push, globalArray length: ${globalArray.length}`);
    }

    /*See, that we pop two times from the globalArray because we store the image when
    we click the mouse and when we release the mouse.*/
    function undo() {
        console.log(`we are at the undo, globalArray length: ${globalArray.length}`);
        if (globalArray.length > 0) {

            globalRedo.push(globalArray.pop());
            canvasImg.src = globalArray.length === 0 ? "" : globalArray[globalArray.length - 1]

            canvasImg.onload = function() {
                //drawImage(image, x, y); (x,y) are the canvas coordinates
                ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
                ctx.drawImage(canvasImg, 0, 0);
            }
        } else {
            console.log(`The Global Array has size: ${globalArray.length}`)
        }
    }

    function redo() {
        console.log(`we are at the redo, globalRedo length: ${globalArray.length}`);
        if (globalRedo.length > 0) {

            canvasImg.src = globalRedo.pop();
            /*These two lines below are important to undo&redo the process infinite!*/
            globalArray.push(canvasImg.src);
            // globalArray.push(canvasImg.src);
            canvasImg.onload = function() {
                //drawImage(image, x, y); (x,y) are the canvas coordinates
                ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
                ctx.drawImage(canvasImg, 0, 0);
            }
        } else {
            console.log(`The Redo Array is empty: ${globalRedo}`)
        }
    }


    function canvasScaling() {
        canvasImg.src = globalArray.length === 0 ? "" : globalArray[globalArray.length - 1]
        canvasImg.onload = function() {
            //drawImage(image, x, y); (x,y) are the canvas coordinates
            ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
            if ($(".canvasScaling")[0].value === "2") {
                ctx.drawImage(canvasImg, canvas[0].width / 4, canvas[0].height / 4,
                    canvas[0].width / $(".canvasScaling")[0].value, canvas[0].height / $(".canvasScaling")[0].value);
            } else {
                ctx.drawImage(canvasImg, 0, 0,
                    canvas[0].width, canvas[0].height);
            }
        }
    };

    function printCanvas() {
        const dataUrl = canvas[0].toDataURL();
        let windowContent = '<!DOCTYPE html>';
        windowContent += '<html>'
        windowContent += `<head><title>${$("h1").text()}</title></head>`;
        windowContent += '<body>'
        windowContent += '<img src="' + dataUrl + '">';
        windowContent += '</body>';
        windowContent += '</html>';
        let printWin = window.open('', '', `width=${canvas[0].width},height=${canvas[0].height}`);
        printWin.document.open();
        printWin.document.write(windowContent);

        //I am using ES6 here instead of jQuery. Do not work with on!
        printWin.document.addEventListener('load', function() {
            printWin.focus();
            printWin.print();
            printWin.document.close();
            printWin.close();
        }, true);
    }

    //Save Canvas: here we create a link to be able to download it
    //as image
    function saveCanvas() {
        /*setting*/
        let TYPE = "img/png";

        const imgURL = canvas[0].toDataURL(TYPE);

        let dlLink = document.createElement('a');
        dlLink.download = "Paint";
        dlLink.href = imgURL;
        dlLink.dataset.downloadurl = [TYPE, dlLink.download, dlLink.href].join(':');
        /*add, click and removing*/
        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
    }

    //Save Canvas in local storage!
    function saveLocalCanvas() {
        /*setting*/
        let TYPE = "img/png";
        const imgURL = canvas[0].toDataURL(TYPE);
        //easiest way to get the date
        const today = new Date();

        let images;
        if(localStorage.getItem("images") === null) {
          images = [];

        } else {
          //convert the localStorage JSON file to an array
          //the images array will be loaded with all the files
          //stored at localStorage
          images = JSON.parse(localStorage.getItem("images"));
        }
        //Now, let's add the actual element
        images.push(imgURL);
        images.push(today);

        //Now, let's save all the array in the memory

        localStorage.setItem("images", JSON.stringify(images));

        console.log(images);
    }
    //load Canvas from localStorage
    function loadLocalCanvas() {
      const items = localStorage.getItem("image");
      console.log(items);
      canvasImg.src = items;
      canvasImg.onload = function() {
          //drawImage(image, x, y); (x,y) are the canvas coordinates
          ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
          ctx.drawImage(canvasImg, 0, 0);
      }

      const fragment = document.createDocumentFragment();

      const itemsArray = JSON.parse(localStorage.getItem("images"));

      //easiest way to get the date
      const today = new Date();

      for(let i=0; i<itemsArray.length; i=i+2) {

        const newLine = document.createElement("tr");
        const newColumnDate = document.createElement("td");
        const newColumnTime = document.createElement("td");
        const newColumnImages = document.createElement("td");

        const newSpanDate = document.createElement("span");
        const newSpanTime = document.createElement("span");
        const newSpanImages = document.createElement("span");

        //convert the string date into a function Date
        const today = new Date(itemsArray[i+1]);

        newSpanDate.textContent = `${today.getDay()}/
          ${today.getMonth()}/${today.getFullYear()}`;
        newSpanTime.textContent = `${today.getHours()}:
          ${today.getMinutes()}:${today.getSeconds()}`;
        newSpanImages.textContent = `${i+1}`;

        fragment.appendChild(newLine);
        /*For the first column: Date*/
        newLine.appendChild(newColumnDate);
        newColumnDate.appendChild(newSpanDate);
        /*For the second column: Time*/
        newLine.appendChild(newColumnTime);
        newColumnTime.appendChild(newSpanTime);
        /*For the third column: Images*/
        newLine.appendChild(newColumnImages);
        newColumnImages.appendChild(newSpanImages);

      };

      /*reflow and repaint here!*/
      document.querySelector(".tableRow").appendChild(fragment);

      /**button to display the results*/
      document.querySelector(".sidenav").classList.toggle("open");
    };

    /**button to close the sidenav*/
    document.querySelector(".bClose").addEventListener("click", ()=> {
      document.querySelector(".sidenav").classList.toggle("open");
    });

    //Fill Background color
    function fillBackgroundColor() {
        ctx.fillStyle = activeColor;
        ctx.rect(0, 0, canvas[0].width, canvas[0].height);
        ctx.fill();
    }

    /*reset nav buttons function*/
    function resetButtons() {
        /*reseting other buttons*/
        if (activeButtons.length > 1) {
            $(activeButtons[0]).toggleClass("active");
            activeButtons.shift();
        }
        console.log(activeButtons);
    };


    /*
     ***PART 3: MOUSE EVENTS: MOUSE DOWN; MOVE & UP! It does the main engine!
     */
    ////////////////////////////////////////////////////
    //MOUSEEEEEEEEEEEEEEEEEEEEEEEE UP
    $("#canvas").mousedown(function(event) {

        if ($(".bStraightLine").hasClass("active")) {
            straightLine = true;
            let cursorPositions = getCursorPosition(canvas, event);
            firstPosClickX = cursorPositions[0];
            firstPosClickY = cursorPositions[1];
        };

        if ($(".bRect").hasClass("active")) {
            rectActive = true;
            //Storing the first mouse position clicked at canvas!
            let cursorPositions = getCursorPosition(canvas, event);
            firstPosClickX = cursorPositions[0];
            firstPosClickY = cursorPositions[1];
        };

        if ($(".bSelectMove").hasClass("active") || $(".bSelectPaste").hasClass("active")) {
            let cursorPositions = getCursorPosition(canvas, event);
            firstPosClickX = cursorPositions[0];
            firstPosClickY = cursorPositions[1];
            elementRectClicked(cursorPositions[0], cursorPositions[1]);
            elementLineClicked(cursorPositions[0], cursorPositions[1]);
            elementCircleClicked(cursorPositions[0], cursorPositions[1]);
            elementBezierClicked(cursorPositions[0], cursorPositions[1]);
            elementBezierCClicked(cursorPositions[0], cursorPositions[1]);
        };
        /*This is not beeing used more. I let here because is a nice source of
        example to be refine/used in the future*/
        if ($(".bCopyPaste").hasClass("active") || $(".bCutPaste").hasClass("active")) {

            if (paste === false) {
                let cursorPositions = getCursorPosition(canvas, event);
                console.log(cursorPositions[0], cursorPositions[1]);
                //retrieve the pixel under cursor
                //ctx.getImageData(sx, sy, sw, sh);
                //sx: The x-axis coordinate of the top-left corner of the rectangle from
                //which the ImageData will be extracted.
                //sy: same as above but y-axis
                //sw:The width of the rectangle from which the ImageData will be extracted.
                //Positive values are to the right, and negative to the left.
                //sy: same but is vertical
                console.log($("#canvasRegion")[0].value);
                //the imageData object represents the underlying pixel data of an area of a canvas object.
                pixel = ctx.getImageData(cursorPositions[0], cursorPositions[1], 1, 1).data;
                imageData = ctx.getImageData(cursorPositions[0], cursorPositions[1], $("#canvasRegion")[0].value, $("#canvasRegion")[0].value);

                if ($(".bCutPaste").hasClass("active")) {
                    ctx.clearRect(cursorPositions[0], cursorPositions[1], $("#canvasRegion")[0].value, $("#canvasRegion")[0].value);
                }

                //create a rgb color profile for that clicked pixel region
                color = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;

                console.log(`The color is: ${color}`);
                copy = true;
            }


        }

        if ($(".bStift").hasClass("active")) {
            stiftActive = true;
            let cursorPositions = getCursorPosition(canvas, event);
            draw(cursorPositions[0], cursorPositions[1]);

            //lineCap "butt do not work with Stift"
            $(".lineCap")[0].max = 1;

        } else {
            $(".lineCap")[0].max = 2;

        };
        if ($(".bErase").hasClass("active")) {
            eraseActive = true;
            let cursorPositions = getCursorPosition(canvas, event);
            erase(cursorPositions[0], cursorPositions[1]);
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
            switch (posArrayX.length) {
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

            switch (posArrayX.length) {
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

        if ($(".bText").hasClass("active")) {
            textDraw = true;
            console.log("textDraw is true");
            let cursorPositions = getCursorPosition(canvas, event);
            firstPosClickX = cursorPositions[0];
            firstPosClickY = cursorPositions[1];

            if ($(".textInput")[0].value === "") {
                alert("Write something in the inputBox first!");
            }

            // ctx.font = "64px serif";
            ctx.font = ($(".fontSize")[0].value) + "px" + " serif";
            ctx.fillStyle = activeColor;
            ctx.strokeStyle = activeColor;

            if ($(".textFill")[0].value === "0") {
                ctx.fillText($(".textInput")[0].value, firstPosClickX, firstPosClickY);
            } else {
                ctx.strokeText($(".textInput")[0].value, firstPosClickX, firstPosClickY);
            }
        };
    })
    //MOUSE MOVE//
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
            let oStraightLineGhost = new Line(cursorPositions[0], cursorPositions[1]);
            oStraightLineGhost.drawStraightLineGhost(cursorPositions[0], cursorPositions[1])
        }

        if (rectActive) {
            let cursorPositions = getCursorPosition(canvas, event);
            let oGhostRectangle = new Rectangle();
            oGhostRectangle.drawRectGhost(cursorPositions[0], cursorPositions[1]);
        }

        if (circleActive) {
            let cursorPositions = getCursorPosition(canvas, event);
            let oCircleGhost = new Circle(cursorPositions[0], cursorPositions[1]);
            oCircleGhost.drawCircleGhost(cursorPositions[0], cursorPositions[1]);
        }

        if (bezierQActive) {
            let cursorPositions = getCursorPosition(canvas, event);
            let oBezierQGhost = new Bezier(cursorPositions[0], cursorPositions[1]);
            oBezierQGhost.drawBezierGhost(cursorPositions[0], cursorPositions[1]);
        }

        if (bezierCActive) {
            let cursorPositions = getCursorPosition(canvas, event);
            let oBezierCurveGhost = new BezierC(cursorPositions[0], cursorPositions[1]);
            oBezierCurveGhost.drawBezierCurveGhost(cursorPositions[0], cursorPositions[1]);
        }

    });

    $("#canvas").mouseup(function(event) {
        /*reseting*/
        stiftActive = false;
        eraseActive = false;

        if (straightLine) {
            let cursorPositions = getCursorPosition(canvas, event);
            let oLine = new Line(cursorPositions[0], cursorPositions[1]);
            oGlobalLineArray.push(oLine);
            oLine.drawStraightLine(cursorPositions[0], cursorPositions[1], false);
            straightLine = false;
        }

        if (rectActive) {
            let cursorPositions = getCursorPosition(canvas, event);
            //creates a new rectangle with (x,y, width, height); -> (x,y) start pos.
            let oRectangle = new Rectangle(firstPosClickX, firstPosClickY, cursorPositions[0], cursorPositions[1]);
            //oGlobal Array to keep track of the rectangle drawed in canvas.
            oGlobalRectArray.push(oRectangle);
            oGlobalRectArray[oGlobalRectArray.length - 1].drawRect(firstPosClickX, firstPosClickY);
            rectActive = false;
        }

        if (circleActive) {
            let cursorPositions = getCursorPosition(canvas, event);
            let oCircle = new Circle(cursorPositions[0], cursorPositions[1]);
            //oGlobal Array to keep track of the circle drawed in canvas.
            oGlobalCircleArray.push(oCircle);
            oGlobalCircleArray[oGlobalCircleArray.length - 1].drawCircle(cursorPositions[0], cursorPositions[1]);
            circleActive = false;
        }

        if (posArrayY.length >= 3 && bezierQActive) {
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

            let oBezierQ = new Bezier(cursorPositions[0], cursorPositions[1]);
            oBezierQ.drawBezier(cursorPositions[0], cursorPositions[1]);
            oGlobalBezierArray.push(oBezierQ);

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
            let oBezierCurve = new BezierC(cursorPositions[0], cursorPositions[1]);
            oBezierCurve.drawBezierCurve(cursorPositions[0], cursorPositions[1]);
            oGlobalBezierCArray.push(oBezierCurve);
            posArrayX = [];
            posArrayY = [];
            bezierCActive = false;

        }

        // //Saving the last status of the canvas!
        globalPush();
    })




    ///////////////////////CONTROLS
    //undo
    $(".bUndo").click(() => {
        $(".bUndo").toggleClass("active");
        activeButtons.push(".bUndo");
        resetButtons();
        undo();
    });
    //redo
    $(".bRedo").click(() => {
        $(".bRedo").toggleClass("active");
        activeButtons.push(".bRedo");
        resetButtons();
        redo();
    });
    //Print
    $(".bPrint").click(() => {
        printCanvas();
        console.log("Printing");
    })
    //save
    $(".bSave").click(() => {
        saveCanvas();
        console.log("Saving");
    })
    //Select&Move
    $(".bSelectMove").click(() => {
      removeAddMouseCursor("true");
      $(".bSelectMove").toggleClass("active");
      activeButtons.push(".bSelectMove");
      resetButtons();
    })
    //Select&Paste
    $(".bSelectPaste").click(() => {
      removeAddMouseCursor("true");
      $(".bSelectPaste").toggleClass("active");
      activeButtons.push(".bSelectPaste");
      resetButtons();
    })
    ///////////////////////////TOOLS
    let cursorMouse = [];

    function removeAddMouseCursor(Removealles = false) {
        if (cursorMouse.length > 1) {
            $("#canvas").removeClass(cursorMouse[1]);
            cursorMouse.pop();
        }
        if (Removealles === "true") {
            $("#canvas").removeClass(cursorMouse[0]);
            cursorMouse.pop();
        }

    }
    //Stift
    $(".bStift").click(function() {
        cursorMouse.unshift("mPincel");
        removeAddMouseCursor();
        $("#canvas").addClass("mPincel");
        $(".bStift").toggleClass("active");
        activeButtons.push(".bStift");
        resetButtons();
    });
    //bErase
    $(".bErase").click(function() {
        cursorMouse.unshift("mErase");
        removeAddMouseCursor();
        $("#canvas").addClass("mErase");
        $(".bErase").toggleClass("active");
        /*reseting other buttons*/
        activeButtons.push(".bErase");
        resetButtons();
    });

    //bSet Background color
    $(".bBackColor").click(() => {
        removeAddMouseCursor("true");
        $(".bBackColor").toggleClass("active");
        fillBackgroundColor();
        /*reseting other buttons*/
        activeButtons.push(".bBackColor");
        resetButtons();
    });
    //bStraightLine
    $(".bStraightLine").click(() => {
        cursorMouse.unshift("mLine");
        removeAddMouseCursor();
        $("#canvas").addClass("mLine");
        $(".bStraightLine").toggleClass("active");
        activeButtons.push(".bStraightLine");
        resetButtons();
    });

    //bRectangle
    $(".bRect").click(() => {
        cursorMouse.unshift("mMove");
        removeAddMouseCursor();
        $("#canvas").addClass("mMove");
        $(".bRect").toggleClass("active");
        activeButtons.push(".bRect");
        resetButtons();
    });

    //bCircle
    $(".bCircle").click(() => {
        cursorMouse.unshift("mMove");
        removeAddMouseCursor();
        $("#canvas").addClass("mMove");
        $(".bCircle").toggleClass("active");
        activeButtons.push(".bCircle");
        resetButtons();
    });

    //bBezierQ
    $(".bBezierQ").click(() => {
        cursorMouse.unshift("mLine");
        removeAddMouseCursor();
        $("#canvas").addClass("mLine");
        $(".bBezierQ").toggleClass("active");
        activeButtons.push(".bBezierQ");
        resetButtons();
    });
    //bBezierC
    $(".bBezierC").click(() => {
        cursorMouse.unshift("mLine");
        removeAddMouseCursor();
        $("#canvas").addClass("mLine");
        $(".bBezierC").toggleClass("active");
        activeButtons.push(".bBezierC");
        resetButtons();
    });

    $(".bText").click(() => {
        cursorMouse.unshift("mText");
        removeAddMouseCursor();
        $("#canvas").addClass("mText");
        $(".bText").toggleClass("active");
        activeButtons.push(".bText");
        resetButtons();
    })

    //Reload
    $(".bReload").click(function() {
        resizeCanvas(width, height);
        $(".bReload").toggleClass("active");
        activeButtons.push(".bReload");
        resetButtons();
        // add temporary reload here!
        location.reload(true);
    });
    //Saving the image local
    $(".bSaveLocal").click(function() {
        // $(".bSaveLocal").toggleClass("active");
        activeButtons.push(".bSaveLocal");
        resetButtons();
        saveLocalCanvas();
        console.log("Saving local");
    });
    //Load local image
    $(".bLoad").click(function() {
        // $(".bSaveLocal").toggleClass("active");
        activeButtons.push(".bLoad");
        resetButtons();
        loadLocalCanvas();
        console.log("Load local Saving");
    });
    //Animation
    $(".bAnimation").click(function() {
        animation();
        $(".bAnimation").toggleClass("active");
        activeButtons.push(".bAnimation");
        resetButtons();

    });

    $(".transparency").change(() => {
        transparency = $(".transparency")[0].value;
        console.log($(".transparency")[0].value);
    });

    $(".thickness").change(() => {
        thickness = $(".thickness")[0].value;
        console.log($(".thickness")[0].value);
    })

    $(".lineCap").change(() => {
        lineCapString = lineCap[($(".lineCap")[0].value)];

        console.log(($(".lineCap")[0].value));
        console.log(lineCapString);
    })

    $(".lineDash").change(() => {
        dashIndex = $(".lineDash")[0].value;
        console.log(dashIndex);
    })

    $(".gradient").change(() => {
        gradient = $(".gradient")[0].value == 1 ? "true" : "false";
        console.log(gradient);
    })

    $(".canvasScaling").change(() => {
        canvasScaling();
        console.log("canvasScaling");
    })

    /*if you resize the window, then you have
    to click the .bZoom again or addAnEventListener*/
    /*jQuery equivalent of JavaScript's addEventListener method*/
    // window.addEventListener("resize", () => {
    //
    // });
    $(window).on("resize", function() {
        if ($(".bZoom").hasClass("active")) {
            resizeCanvas(window.innerWidth, 300);
        }
    });

    /*
    ANIMATION THAT CAN BE USE WHEN YOU START THE PROGRAM!
    */
    // smileFace();

    function smileFace() {
        ctx.beginPath();
        ctx.strokeStyle = "black";
        //Big Circle//////////////////
        //arc(x,y,radius,startAngle, endAngle, anticlockwise);
        //Draw an arc which is centerd at (x,y),
        //Angles in the arc function are measured in radians, not degress.
        ctx.arc(950, 285, 250, 0, Math.PI * 2, true); // Outer circle
        /*Another way to draw an arc is to type:
        arcTo(x1, y1, x2, y2, radius)
        It draws an arc with the given control poionts and radius, connected to the
        previous point by a straight line.*/

        //Mouth
        //MoveTo: moves the pen to the coordinates specified by x,y
        ctx.moveTo(1150, 285);
        // Mouth (clockwise) - outside part
        ctx.arc(950, 285, 200, 0, Math.PI, false);
        // Mouth (clockwise) - inside part
        ctx.moveTo(1150, 285);
        ctx.arc(950, 285, 220, 0, Math.PI, false); // Mouth (clockwise)
        ctx.moveTo(730, 285);
        // //draws a line from the current drawing position to the position specified x,y
        ctx.lineTo(750, 285)
        // ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        //eyes
        ctx.moveTo(910, 200);
        // //eye left
        ctx.arc(850, 200, 60, 0, Math.PI * 2, true); // Left eye
        ctx.moveTo(1110, 200);
        // //eye right
        ctx.arc(1050, 200, 60, 0, Math.PI * 2, true); // Right eye
        // //Sets the style for shapes outlines
        ctx.strokeStyle = "blue";
        ctx.stroke();
        //nose
        ctx.beginPath();
        ctx.moveTo(892, 350);
        //Sets the style used when filling shapes
        ctx.fillStyle = "red";
        ctx.arc(952, 350, 40, 0, Math.PI * 2, true); // Right eye
        ctx.fill();
        //Welcome text
        ctx.beginPath();
        ctx.font = "20px Arial";
        //fillText(text,x,y); - draws "filled" text on the canvas
        ctx.fillStyle = "red";
        ctx.fillText("!Welcome!", 900, 30);

        //Nice way to clear
        for(let index = 0; index <= 1150; index = index + 1) {
            setTimeout(function() {
                ctx.strokeStyle = "white";
                ctx.arc(920, 300, index, 0, Math.PI * 2, true); // Outer circle
                ctx.stroke();
            }.bind(index), 3000);
        }
    }

    $("html").keydown(function(event) {
        if (event.keyCode == 46) {

            oGlobalLineArray.forEach(function(line, index) {
                if (line.clicked === true) {
                    line.eraseLine();
                    oGlobalLineArray.splice(index, 1);
                }
            });

            oGlobalRectArray.forEach(function(rect, index) {
                if (rect.clicked === true) {
                    rect.eraseRect();
                    oGlobalRectArray.splice(index, 1);
                }
            });

            oGlobalCircleArray.forEach(function(circle, index) {
                if (circle.clicked === true) {
                    circle.eraseCircle();
                    oGlobalCircleArray.splice(index, 1);
                }
            });

            oGlobalBezierArray.forEach(function(bezier, index) {
                if (bezier.clicked === true) {
                    bezier.eraseBezier();
                    oGlobalBezierArray.splice(index, 1);
                }
            });

            oGlobalBezierCArray.forEach(function(bezierC, index) {
                if (bezierC.clicked === true) {
                    bezierC.eraseBezierCurve();
                    oGlobalBezierCArray.splice(index, 1);
                }
            });
        }
    });
});
