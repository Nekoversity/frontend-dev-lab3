const submitButton = document.getElementById('submit');
const intervalStart = document.getElementById('interval-start');
const intervalEnd = document.getElementById('interval-end');
const intervalStep = document.getElementById('interval-step');
const kindOfCycle = document.getElementById('cycle-kind');
const resultTable = document.getElementById('result-table');

submitButton.addEventListener('click', handleSubmitClick);

function handleSubmitClick() {
    clearResultTable();
    if (checkInput()) {
        cycleSwitcher();
    } else {
        alert('You made mistake in the input!\nCheck and try again');
    }
}

function cycleSwitcher() {
    const start = Number(intervalStart.value);
    const end = Number(intervalEnd.value);
    const step = Number(intervalStep.value);

    if (kindOfCycle.value === 'while') {
        let stepNum = 0;
        let current = start;

        while(current <= end) {
            drawResultTableRow(stepNum, getFunctionResult(current));
            current += step;
            ++stepNum;
        }
    } else if (kindOfCycle.value === 'do-while') {
        let stepNum = 0;
        let current = start;

        do {
            drawResultTableRow(stepNum, getFunctionResult(current));
            current += step;
            ++stepNum;
        } while(current <= end);
    } else if (kindOfCycle.value === 'for') {
        let stepNum = 0;
        for(let current = start; current <= end; current += step) {
            drawResultTableRow(stepNum, getFunctionResult(current));
            ++stepNum;
        }
    }
}

function getFunctionResult(x) {
    return 0.005 * Math.pow(0.2 * Math.pow(x, 2), 2);
}

function drawResultTableRow(stepNum, current) {
    resultTable.innerHTML += `<tr><td>${stepNum}</td><td>${current}</td></tr>`;
}

function clearResultTable() {
    resultTable.innerHTML = '';
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
