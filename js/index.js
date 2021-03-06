import "../css/style.css"

(function () {

    let canvas = document.getElementById("canvas"),
        context = canvas.getContext("2d"),
        paint;

    const { offsetLeft, offsetTop } = canvas;

    const PURPLE_COLOR = "#CB3594";
    const GREEN_COLOR =  "#659B41";
    const YELLOW_COLOR = "#FFCF33";
    const BROWN_COLOR = "#986928";

    const SMALL_LINE_WIDTH = 2;
    const NORMAL_LINE_WIDTH = 5;
    const LARGE_LINE_WIDTH = 10;
    const HUGE_LINE_WIDTH = 20;

    let clearBtn = document.getElementById("clear-btn"), 
        purpleColorBtn = document.getElementById("purple-color"), 
        yellowColorBtn = document.getElementById("yellow-color"), 
        greenColorBtn = document.getElementById("green-color"), 
        brownColorBtn = document.getElementById("brown-color"),
        smallSizeBtn = document.getElementById("small-size"),
        normalSizeBtn = document.getElementById("normal-size"),
        largeSizeBtn = document.getElementById("large-size"),
        hugeSizeBtn = document.getElementById("huge-size"),
        undoBtn = document.getElementById("undo"),
        redoBtn = document.getElementById("redo"),
        increaseImageSizeBtn = document.getElementById("increase-image-size"),
        decreaseImageSizeBtn = document.getElementById("decrease-image-size"),
        invertBtn = document.getElementById("invert-filter"),
        grayscaleBtn = document.getElementById("grayscale-filter");

    let state = JSON.parse(localStorage.getItem("current-state"));
    
    if (state) {

        var { steps, step, curStep, imageWidth, imageHeight } = state;
        canvas.width = imageWidth;
        canvas.height = imageHeight;
        redraw();
        
    }
    else {

        var steps = [];

        var step = {
            clickX : [],
            clickY : [],
            clickDrag : [],
            clickColor : [],
            clickSize : [],
            size: "normal",
            color: PURPLE_COLOR
        };

        var curStep = 0, imageWidth = canvas.offsetWidth, imageHeight = canvas.offsetHeight;
    }

    canvas.onmousedown = e => {

        paint = true;
        addClick(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop);
        redraw();

    }

    canvas.onmousemove = e => {
      
        if(paint) {
            addClick(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, true);
            redraw();
        }

    }

    function drawStep(step) {

        for(let i = 0 ; i < step.clickX.length; i++) {      
            
            context.beginPath();

            if(step.clickDrag[i] && i)
                context.moveTo(step.clickX[i-1], step.clickY[i-1]);
            else
                context.moveTo(step.clickX[i]-1, step.clickY[i]);

            let currentLineWidth = NORMAL_LINE_WIDTH;
            
            switch (step.clickSize[i]) {
                case "small":
                    currentLineWidth = SMALL_LINE_WIDTH;
                    break;
                case "normal":
                    currentLineWidth = NORMAL_LINE_WIDTH;
                    break;
                case "large":
                    currentLineWidth = LARGE_LINE_WIDTH;
                    break;
                case "huge":
                    currentLineWidth = HUGE_LINE_WIDTH;
                    break;
                default:
                    break;
            }
            
            context.lineTo(step.clickX[i], step.clickY[i]);
            context.closePath();
            context.strokeStyle = step.clickColor[i];
            context.lineWidth = currentLineWidth;
            context.stroke();
        }
    }

    function redraw() {

        clear();
        context.lineJoin = "round";
            
        for(let i = 0 ; i < curStep; i++) 
            drawStep(steps[i]);

        drawStep(step);

        localStorage.setItem("current-state", JSON.stringify({steps, step, 
            curStep, imageWidth, imageHeight}));
    }

    canvas.onmouseup = () => {
        paint = false;
        steps[curStep++] =  Object.assign({}, step); 
        clearStep();
    };

    function addClick(x, y, dragging) {
        step.clickX.push(x);
        step.clickY.push(y);
        step.clickDrag.push(dragging);
        step.clickColor.push(step.color);
        step.clickSize.push(step.curSize);
    }

    function clearStep() {
        step.clickX = []
        step.clickY = [];
        step.clickDrag = [];
        step.clickColor = [];
        step.clickSize = [];
    }

    function invertFilter() {
        
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          data[i]     = 255 - data[i]; 
          data[i + 1] = 255 - data[i + 1]; 
          data[i + 2] = 255 - data[i + 2];
        }

        context.putImageData(imageData, 0, 0);
    };

    function grayscaleFilter() {
        
        let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        let data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          let avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i]     = avg;
          data[i + 1] = avg;
          data[i + 2] = avg;
        }

        context.putImageData(imageData, 0, 0);
    };

    clearBtn.onclick = () => {

        clear();
        clearStep();

        curStep = 0;

        steps = [];
    }

    purpleColorBtn.onclick = () => step.color = PURPLE_COLOR;
    greenColorBtn.onclick = () => step.color = GREEN_COLOR;
    yellowColorBtn.onclick = () => step.color = YELLOW_COLOR;
    brownColorBtn.onclick = () => step.color = BROWN_COLOR;
   
    smallSizeBtn.onclick = () => step.curSize = "small";
    normalSizeBtn.onclick = () => step.curSize = "normal";
    largeSizeBtn.onclick = () => step.curSize = "large";
    hugeSizeBtn.onclick = () => step.curSize = "huge";

    undoBtn.onclick = () => {
        if (curStep > 0) {
            --curStep;
            redraw();
        }
    }

    redoBtn.onclick = () => {
        if (curStep < steps.length) {
            ++curStep;
            redraw();
        }
    }

    function clear() {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }

    increaseImageSizeBtn.onclick = () => {
        
        imageWidth = imageWidth + parseInt(imageWidth * 0.1);
        imageHeight = imageHeight + parseInt(imageHeight * 0.1);

        canvas.width = imageWidth;
        canvas.height = imageHeight;

        redraw();
    }

    decreaseImageSizeBtn.onclick = () => {

        imageWidth = imageWidth - parseInt(imageWidth * 0.1);
        imageHeight = imageHeight - parseInt(imageHeight * 0.1);

        canvas.width = imageWidth;
        canvas.height = imageHeight;
        
        redraw();
    }

    invertBtn.onclick = () => invertFilter();
    grayscaleBtn.onclick = () => grayscaleFilter();

}());