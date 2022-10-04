const submitButton = document.getElementById('submit');
const intervalStart = document.getElementById('interval-start');
const intervalEnd = document.getElementById('interval-end');
const intervalStep = document.getElementById('interval-step');
const resultCanvas = document.getElementById('result-canvas');
const canvasContext = resultCanvas.getContext('2d');

submitButton.addEventListener('click', handleSubmitClick);

function handleSubmitClick() {
    clearCanvas();
    if (checkInput()) {
        startDrawing();
    } else {
        alert('You made mistake in the input!\nCheck and try again');
    }
}

function startDrawing() {
    const start = Number(intervalStart.value);
    const end = Number(intervalEnd.value);
    const step = Number(intervalStep.value);

    const [minY, maxY] = getDimensionEdgesFromFunctionResult(start, end, step);

    const xMod = resultCanvas.width / end - start;
    const yMod = resultCanvas.height / maxY - minY;

    styleDrawing();
    fixBlurry();

    canvasContext.beginPath();
    canvasContext.moveTo(0, resultCanvas.height);

    let stepNum = 1;
    for (let current = start; current <= end; current += step) {
        drawNewPoint(current, getFunctionResult(current), xMod, yMod);
        ++stepNum;
    }
    canvasContext.stroke();
}

function getDimensionEdgesFromFunctionResult(start, end, step) {
    let max, min, stepNum = 1;

    max = min = getFunctionResult(start);
    for (let current = start; current <= end; current += step) {
        let tmp = getFunctionResult(current);
        if (tmp > max) max = tmp;
        if (tmp < min) min = tmp;
        ++stepNum;
    }

    return [min, max];
}

function styleDrawing() {
    canvasContext.strokeStyle = 'red';
    canvasContext.lineWidth = 1;
}

function fixBlurry() {
    const originalHeight = resultCanvas.height;
    const originalWidth = resultCanvas.width;

    let dimensions = getObjectFitSize(
        true,
        resultCanvas.clientWidth,
        resultCanvas.clientHeight,
        resultCanvas.width,
        resultCanvas.height
    );

    const dpr = window.devicePixelRatio || 1;
    resultCanvas.width = dimensions.width * dpr;
    resultCanvas.height = dimensions.height * dpr;

    let ratio = Math.min(
        resultCanvas.clientWidth / originalWidth,
        resultCanvas.clientHeight / originalHeight
    );

    canvasContext.scale(ratio * dpr, ratio * dpr);
}

function getObjectFitSize(
    contains /* true = contain, false = cover */,
    containerWidth,
    containerHeight,
    width,
    height
) {
    let doRatio = width / height;
    let cRatio = containerWidth / containerHeight;
    let targetWidth = 0;
    let targetHeight = 0;
    let test = contains ? doRatio > cRatio : doRatio < cRatio;

    if (test) {
        targetWidth = containerWidth;
        targetHeight = targetWidth / doRatio;
    } else {
        targetHeight = containerHeight;
        targetWidth = targetHeight * doRatio;
    }

    return {
        width: targetWidth,
        height: targetHeight,
        x: (containerWidth - targetWidth) / 2,
        y: (containerHeight - targetHeight) / 2
    };
}

function drawNewPoint(x, y, xmod = 1, ymod = 1) {
    canvasContext.lineTo(x * xmod, resultCanvas.height - (y * ymod));
}

function getFunctionResult(x) {
    return 0.005 * Math.pow(0.2 * Math.pow(x, 2), 2);
}

function clearCanvas() {
    canvasContext.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
}

function checkInput() {
    let start = Number(intervalStart.value);
    let end = Number(intervalEnd.value);
    let step = Number(intervalStep.value);

    const isAllValid = !(isNaN(start) || isNaN(end) || isNaN(step));
    const isStartLessThanEnd = start < end;
    const atLeastOneAvailableStep = (start + step) <= end;

    return !!(isAllValid && isStartLessThanEnd && atLeastOneAvailableStep);
}
