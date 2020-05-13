let board = document.querySelector(".board");
let width = 8;
//let basicCandies = ["url('/static/images/Adam.png')", "url('/static/images/Agi.png')", "url('/static/images/Bence.png')",
//    "url('/static/images/Gabor.png')", "url('/static/images/Laci.png')", "url('/static/images/Reka.png')" ]
let isGameStarted = false;
let basicCandies = ['Laci', 'Gabor', 'Agi', 'Bence', 'Reka', 'Adam'];
let allCandies = basicCandies;
let cells = [];
let scores = 0;
let startButton = document.querySelector('#start-button');
let startTime = 60;
let counter = undefined;
let setIntervalForBoard = undefined;

initGame();


function initGame() {
    startButton.addEventListener('click', startGame);
    createBoard();
    setIntervalForBoard = window.setInterval(updateBoard, 100);
    // Your game can start here, but define separate functions, don't write everything in here :)
}

function createBoard() {
    for (let i = 0; i < width * width; i++) {
        let cell = document.createElement('div');
        cell.className = 'cell';
        let row = Math.floor(i / width);
        let col = i - (row * width);
        cell.dataset.row = row;
        cell.dataset.col = col;
        let randomNumber = createRandomCandy();
        let candyType = basicCandies[randomNumber];
        cell.classList.add(candyType);
        board.appendChild(cell);
        cells.push(cell)
    }
}

function createRandomCandy() {
    let randomNumber = Math.floor(Math.random() * basicCandies.length);
    return randomNumber;
}

//Dragging a candy, swapping candies

let draggedCandy = undefined;
let candyToReplace = undefined;

function dragStart(event) {
    draggedCandy = this;
}

function dragEnd(event) {

}

function dragEnter(event) {
    event.preventDefault();
}

function dragOver(event) {
    event.preventDefault();
}

function dragLeave(event) {
    event.preventDefault();
}

function dragDrop(event) {
    event.preventDefault();
    candyToReplace = this;
    let draggedCandyType = findCandyType(draggedCandy);
    let draggedCandyRow = parseInt(draggedCandy.dataset.row);
    let draggedCandyCol = parseInt(draggedCandy.dataset.col);
    let validCoordinates = findValidMoves(draggedCandyRow, draggedCandyCol);
    let candyToReplaceType = findCandyType(candyToReplace);
    let candyToReplaceRow = parseInt(candyToReplace.dataset.row);
    let candyToReplaceCol = parseInt(candyToReplace.dataset.col);
    let isValidMove = false;
    for (let coordinates of validCoordinates) {
        if (JSON.stringify([candyToReplaceRow, candyToReplaceCol]) === JSON.stringify(coordinates)) {
            isValidMove = true;
        }
    }
    candyToReplaceClasses = candyToReplace.classList;
    if (!candyToReplaceClasses.contains(draggedCandyType) && !candyToReplaceClasses.contains('empty') && isValidMove) {
        candyToReplace.classList.remove(candyToReplaceType);
        candyToReplace.classList.add(draggedCandyType);
        draggedCandy.classList.remove(draggedCandyType);
        draggedCandy.classList.add(candyToReplaceType);

        if (checkRowsOfThree() || checkColsOfThree()){        //add the others!!
        } else {
            candyToReplace.classList.add(candyToReplaceType);
            candyToReplace.classList.remove(draggedCandyType);
            draggedCandy.classList.add(draggedCandyType);
            draggedCandy.classList.remove(candyToReplaceType);
        }
    }
}

function addDraggingFunctionForCells() {
    for (let cell of cells) {
        cell.addEventListener('dragstart', dragStart);
        cell.addEventListener('dragend', dragEnd);
        cell.addEventListener('dragenter', dragEnter);
        cell.addEventListener('dragover', dragOver);
        cell.addEventListener('dragleave', dragLeave);
        cell.addEventListener('drop', dragDrop);
    }
}

function findCandyType(candyElement) {
    let candyClasses = candyElement.classList;
    let candyType = undefined;
    for (let type of allCandies) {
        if (candyClasses.contains(type)) {
            candyType = type
        }
    }
    return candyType;
}

function findValidMoves(row, col) {
    let validIndexValues = [];
    for (let i = 0; i < width; i++) {
        validIndexValues.push(i)
    }

    let validCoordinates = [];
    //valid moves in same column
    for (let i = row - 1; i < row + 2; i += 2) {
        if (validIndexValues.includes(i) && validIndexValues.includes(col)) {
            let validCoordinate = [i, col];
            validCoordinates.push(validCoordinate);
        }
    }
    //valid moves in same row
    for (let j = col - 1; j < col + 2; j += 2) {
        if (validIndexValues.includes(j) && validIndexValues.includes(row)) {
            let validCoordinate = [row, j];
            validCoordinates.push(validCoordinate);
        }
    }
    return validCoordinates;
}

function calculateIndexNumber(row, col) {
    return row * width + col
}

//Check for matching candies
function checkRowsOfThree() {
    let matchWasFound = false;
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < width - 2; j++) {
            let indexNumber = calculateIndexNumber(i, j);
            if (!cells[indexNumber].classList.contains('empty')) {
                let currentCandyType = findCandyType(cells[indexNumber]);
                let rowOfThree = [cells[indexNumber], cells[indexNumber + 1], cells[indexNumber + 2]];

                function tester(cell) {
                    let whichCandyType = findCandyType(cell);
                    if (whichCandyType === currentCandyType) {
                        return true
                    }
                }

                let isMatch = rowOfThree.every(tester);

                if (isMatch) {
                    clearRows(indexNumber, 3, currentCandyType);
                    matchWasFound = true;
                }
            }
        }
    }
    return matchWasFound;
}

function clearRows(startIndex, length, candyTypeToClear) {
    for (let i = startIndex; i < startIndex + length; i++) {
        cells[i].classList.add('empty');
        cells[i].classList.remove(candyTypeToClear);
        if (isGameStarted) {
            scores = scores + 10;
            document.getElementById('score-counter').innerText = scores;
        }
    }
}

function clearCols(startIndex, length, candyTypeToClear) {
for (let i = startIndex; i <= startIndex + width * (length - 1); i = i + width) {
        cells[i].classList.add('empty');
        cells[i].classList.remove(candyTypeToClear);
        if (isGameStarted) {
            scores = scores + 10;
            document.getElementById('score-counter').innerText = scores;
        }
    }
}


    function checkColsOfThree() {
    let matchWasFound = false;
        for (let i = 0; i < width - 2; i++) {
            for (let j = 0; j < width; j++) {
                let indexNumber = calculateIndexNumber(i, j);
                if (!cells[indexNumber].classList.contains('empty')) {
                    let currentCandyType = findCandyType(cells[indexNumber]);
                    let colOfThree = [cells[indexNumber], cells[indexNumber + width], cells[indexNumber + width * 2]];

                    function tester(cell) {
                        let whichCandyType = findCandyType(cell);
                        if (whichCandyType === currentCandyType) {
                            return true;
                        }
                    }

                    let isMatch = colOfThree.every(tester);
                    if (isMatch) {
                        clearCols(indexNumber, 3, currentCandyType);
                        matchWasFound = true;
                    }
                }
            }
        }
        return matchWasFound;
    }

// Move down candies
    function moveDownCandies() {
        for (let i = width - 1; i > 0; i--) {
            for (let j = 0; j < width; j++) {
                let indexNumber = calculateIndexNumber(i, j);
                if (cells[indexNumber].classList.contains('empty')) {
                    for (let k = i - 1; k >= 0; k--) {
                        let aboveCandyIndexNumber = calculateIndexNumber(k, j);
                        if (!cells[aboveCandyIndexNumber].classList.contains('empty')) {
                            cells[indexNumber].classList.remove('empty');
                            let aboveCandyType = findCandyType(cells[aboveCandyIndexNumber]);
                            cells[indexNumber].classList.add(aboveCandyType);

                            cells[aboveCandyIndexNumber].classList.add('empty');
                            cells[aboveCandyIndexNumber].classList.remove(aboveCandyType);
                            break
                        }
                    }
                }
            }
        }
    }

    function generateNewCandies() {
        for (let i = cells.length - 1; i >= 0; i--) {
            if (cells[i].classList.contains('empty')) {
                let randomCandy = createRandomCandy();
                let randomCandyType = basicCandies[randomCandy];
                cells[i].classList.remove('empty');
                cells[i].classList.add(randomCandyType)
            }
        }
    }

    function startGame() {
        isGameStarted = true;
        addDraggingFunctionForCells();
        for (let cell of cells) {
            cell.setAttribute('draggable', true);
        }
        counter = window.setInterval(countDown, 1000)
    }

    function countDown() {
        if (startTime > 0) {
            startTime--;
            document.querySelector('.count-down').innerHTML = startTime
        } else {
            document.querySelector('.count-down').innerHTML = startTime;
            for (let cell of cells) {
                cell.setAttribute('draggable', false);
            }
            clearInterval(counter);
            clearInterval(setIntervalForBoard);
            alert(scores);
        }
    }


    function updateBoard() {
        checkRowsOfThree();
        checkColsOfThree();
        moveDownCandies();
        generateNewCandies();
    }