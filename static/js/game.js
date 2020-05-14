//Initialization, game-flow
let board = document.querySelector(".board");
let width = 8;
let isGameStarted = false;
let basicCandies = ['Laci', 'Gabor', 'Agi', 'Bence', 'Reka', 'Adam'];
let allCandies = ['Laci', 'Gabor', 'Agi', 'Bence', 'Reka', 'Adam', 'Codecool'];
let cells = [];
let scores = 0;
let startButton = document.querySelector('#start-button');
let startTime = 3000;
let counter = undefined;
let setIntervalForBoard = undefined;

initGame();


function initGame() {
    startButton.addEventListener('click', startGame);
    createBoard();
    setIntervalForBoard = window.setInterval(updateBoard, 2000);
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
        /*subtype values:
        basic candy = 0
        horizontally striped candy = 1
        vertically striped candy = 2
        Codecool logo = 3
         */
        cell.dataset.subtype = 0;
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
        alert(`Your final score is: ${scores}`);
    }
}


function updateBoard() {
    checkForMatchingRow(5);
    checkForMatchingCol(5);
    checkForMatchingRow(4);
    checkForMatchingCol(4);
    checkForMatchingRow(3);
    checkForMatchingCol(3);
    moveDownCandies();
    generateNewCandies();
}


//Dragging a candy, swapping candies

let draggedCandy = undefined;
let candyToReplace = undefined;

function dragStart(event) {
    draggedCandy = this;
}

function dragEnd(event) {
    draggedCandy = undefined;
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
    let draggedCandySubtype = parseInt(draggedCandy.dataset.subtype);

    let validCoordinates = findValidMoves(draggedCandyRow, draggedCandyCol);

    let candyToReplaceType = findCandyType(candyToReplace);
    let candyToReplaceRow = parseInt(candyToReplace.dataset.row);
    let candyToReplaceCol = parseInt(candyToReplace.dataset.col);
    let candyToReplaceSubtype = parseInt(candyToReplace.dataset.subtype);

    let isValidMove = false;
    for (let coordinates of validCoordinates) {
        if (JSON.stringify([candyToReplaceRow, candyToReplaceCol]) === JSON.stringify(coordinates)) {
            isValidMove = true;
        }
    }

    candyToReplaceClasses = candyToReplace.classList;



    if (!candyToReplaceClasses.contains(draggedCandyType) && !candyToReplaceClasses.contains('empty') && isValidMove) {
        candyToReplace.className = `cell ${draggedCandyType}`;
        candyToReplace.dataset.subtype = draggedCandySubtype;
        draggedCandy.className = `cell ${candyToReplaceType}`;
        draggedCandy.dataset.subtype = candyToReplaceSubtype;
        if (draggedCandyType === 'Codecool') {
            draggedCandy.className = 'cell empty';
            draggedCandy.dataset.subtype = 0;
            handleCodecoolCandy(candyToReplaceType);
            candyToReplace = undefined
            return
        }
        if (candyToReplaceType === 'Codecool') {
            candyToReplace.className = 'cell empty';
            candyToReplace.dataset.subtype = 0;
            handleCodecoolCandy(draggedCandyType);
            candyToReplace = undefined
            return
            }
        if (checkForMatchingCol(5) || checkForMatchingRow(5) ||checkForMatchingCol(4)
            || checkForMatchingRow(4) || checkForMatchingRow(3) || checkForMatchingCol(3)){
            //if match is found then swapping takes place, else switch back candies to original position
        } else {
            candyToReplace.className = `cell ${candyToReplaceType}`;
            candyToReplace.dataset.subtype = candyToReplaceSubtype;
            draggedCandy.className = `cell ${draggedCandyType}`;
            draggedCandy.dataset.subtype = draggedCandySubtype;
        }
    }
    candyToReplace = undefined;
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

//Supporting functions
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

function calculateIndexNumber(row, col) {
    return row * width + col
}

//Clear matching candies
function clearRows(startIndex, length) {
    for (let i = startIndex; i < startIndex + length; i++) {
        cells[i].className = "cell empty";
        cells[i].dataset.subtype = 0;
        if (isGameStarted) {
            scores = scores + 10;
            document.getElementById('score-counter').innerText = scores;
        }
    }
}

function clearCols(startIndex, length) {
    for (let i = startIndex; i <= startIndex + width * (length - 1); i = i + width) {
        cells[i].className = "cell empty";
        cells[i].dataset.subtype = 0;
        if (isGameStarted) {
            scores = scores + 10;
            document.getElementById('score-counter').innerText = scores;
        }
    }
}

//Check for matching rows/cols
function checkForMatchingRow(numberOfMatchingCandies) {
    //check for match
    let matchWasFound = false;
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < width - numberOfMatchingCandies + 1; j++) {
            let indexNumber = calculateIndexNumber(i, j);
            if (!cells[indexNumber].classList.contains('empty')) {
                let currentCandyType = findCandyType(cells[indexNumber]);
                let matchingRow = [];
                for (let k = 0; k < numberOfMatchingCandies; k++) {
                    matchingRow.push(cells[indexNumber + k])
                }

                function tester(cell) {
                    let whichCandyType = findCandyType(cell);
                    if (whichCandyType === currentCandyType) {
                        return true
                    }
                }

                let isMatch = matchingRow.every(tester);
                //if match was found
                if (isMatch) {
                    //check for striped candies in match
                    matchWasFound = true;
                    let rowClear = false;
                    let colClear = false;
                    let rowToDelete = undefined;
                    let colToDelete = undefined;


                    for (let matchingCandy of matchingRow){
                        let matchingCandySubtype = parseInt(matchingCandy.dataset.subtype);
                        if (matchingCandySubtype == 0){
                            //do nothing if basic candy
                        } else if (matchingCandySubtype == 1){
                            rowClear = true;
                            rowToDelete = parseInt(matchingCandy.dataset.row);
                        } else if (matchingCandySubtype == 2){
                            colClear = true;
                            colToDelete = parseInt(matchingCandy.dataset.col);
                        }
                    }

                    if (isGameStarted && numberOfMatchingCandies === 5) {
                        clearRows(indexNumber,5)
                        if (!candyToReplace){
                            cells[indexNumber].className = 'cell Codecool';
                            cells[indexNumber].dataset.subtype = 3;
                        } else {
                            if (parseInt(candyToReplace.dataset.row) == i){
                                let codecoolCandyRow = parseInt(candyToReplace.dataset.row);
                                let codecoolCandyCol = parseInt(candyToReplace.dataset.col);
                                let codecoolCandyIndexNumber = calculateIndexNumber(codecoolCandyRow, codecoolCandyCol);
                                cells[codecoolCandyIndexNumber].className = 'cell Codecool';
                                cells[codecoolCandyIndexNumber].dataset.subtype = 3;
                            } else {
                                let codecoolCandyRow = parseInt(draggedCandy.dataset.row);
                                let codecoolCandyCol = parseInt(draggedCandy.dataset.col);
                                let codecoolCandyIndexNumber = calculateIndexNumber(codecoolCandyRow, codecoolCandyCol);
                                cells[codecoolCandyIndexNumber].className = 'cell Codecool';
                                cells[codecoolCandyIndexNumber].dataset.subtype = 3;
                            }
                        }
                    }






                    if (rowClear){
                        let startIndexDeleteRow = calculateIndexNumber(rowToDelete, 0);
                        clearRows(startIndexDeleteRow, 8);
                    }
                    if (colClear){
                        let startIndexDeleteCol = calculateIndexNumber(0, colToDelete);
                        clearCols(startIndexDeleteCol, 8);
                        if (!rowClear){
                            clearRows(indexNumber, numberOfMatchingCandies);
                        }
                    }
                    // no striped candies in match
                    if (!rowClear && !colClear){
                        clearRows(indexNumber, numberOfMatchingCandies);
                        if (isGameStarted && numberOfMatchingCandies==4){
                            if (!candyToReplace){
                                cells[indexNumber].className = `cell ${currentCandyType}`;
                                cells[indexNumber].dataset.subtype = 1;
                            } else {
                                if (parseInt(candyToReplace.dataset.row) == i){
                                    let stripedCandyRow = parseInt(candyToReplace.dataset.row);
                                    let stripedCandyCol = parseInt(candyToReplace.dataset.col);
                                    let stripedCandyIndexNumber = calculateIndexNumber(stripedCandyRow, stripedCandyCol);
                                    cells[stripedCandyIndexNumber].className = `cell ${currentCandyType}`;
                                    cells[stripedCandyIndexNumber].dataset.subtype = 1;
                                } else {
                                    let stripedCandyRow = parseInt(draggedCandy.dataset.row);
                                    let stripedCandyCol = parseInt(draggedCandy.dataset.col);
                                    let stripedCandyIndexNumber = calculateIndexNumber(stripedCandyRow, stripedCandyCol);
                                    cells[stripedCandyIndexNumber].className = `cell ${currentCandyType}`;
                                    cells[stripedCandyIndexNumber].dataset.subtype = 1;
                                }
                            }
                        } else {
                            //in case of matches of three nothing else happens
                        }
                    }
                }
            }
        }
    }
    return matchWasFound;
}

function checkForMatchingCol(numberOfMatchingCandies){
    let matchWasFound = false;
    for (let i = 0; i < width - numberOfMatchingCandies + 1; i++) {
        for (let j = 0; j < width; j++) {
            let indexNumber = calculateIndexNumber(i, j);
            if (!cells[indexNumber].classList.contains('empty')) {
                let currentCandyType = findCandyType(cells[indexNumber]);
                let matchingCol = [];
                for (let k = 0; k < numberOfMatchingCandies; k++){
                    matchingCol.push(cells[indexNumber + k * width]);
                }

                function tester(cell) {
                    let whichCandyType = findCandyType(cell);
                    if (whichCandyType === currentCandyType) {
                        return true;
                    }
                }

                let isMatch = matchingCol.every(tester);
                //if match was found
                if (isMatch) {
                    //check for striped candies in match
                    matchWasFound = true;
                    let rowClear = false;
                    let colClear = false;
                    let rowToDelete = undefined;
                    let colToDelete = undefined;

                    for (let matchingCandy of matchingCol){
                        let matchingCandySubtype = parseInt(matchingCandy.dataset.subtype);
                        if (matchingCandySubtype == 0){
                            //do nothing if basic candy
                        } else if (matchingCandySubtype == 1){
                            rowClear = true;
                            rowToDelete = parseInt(matchingCandy.dataset.row)
                        } else if (matchingCandySubtype == 2){
                            colClear = true;
                            colToDelete = parseInt(matchingCandy.dataset.col)
                        }
                    }

                    if (isGameStarted && numberOfMatchingCandies === 5) {
                        clearCols(indexNumber,5)
                        if (!candyToReplace){
                            cells[indexNumber].className = 'cell Codecool';
                            cells[indexNumber].dataset.subtype = 3;
                        } else {
                            if (parseInt(candyToReplace.dataset.col) == j){
                                let codecoolCandyRow = parseInt(candyToReplace.dataset.row);
                                let codecoolCandyCol = parseInt(candyToReplace.dataset.col);
                                let codecoolCandyIndexNumber = calculateIndexNumber(codecoolCandyRow, codecoolCandyCol);
                                cells[codecoolCandyIndexNumber].className = 'cell Codecool';
                                cells[codecoolCandyIndexNumber].dataset.subtype = 3;
                            } else {
                                let codecoolCandyRow = parseInt(draggedCandy.dataset.row);
                                let codecoolCandyCol = parseInt(draggedCandy.dataset.col);
                                let codecoolCandyIndexNumber = calculateIndexNumber(codecoolCandyRow, codecoolCandyCol);
                                cells[codecoolCandyIndexNumber].className = 'cell Codecool';
                                cells[codecoolCandyIndexNumber].dataset.subtype = 3;
                            }
                        }
                    }

                    if (rowClear){
                        let startIndexDeleteRow = calculateIndexNumber(rowToDelete, 0);
                        clearRows(startIndexDeleteRow, 8);
                        if (!colClear){
                            clearCols(indexNumber, numberOfMatchingCandies);
                        }
                    }
                    if (colClear){
                        let startIndexDeleteCol = calculateIndexNumber(0, colToDelete);
                        clearCols(startIndexDeleteCol, 8);
                    }
                    if (!rowClear && !colClear){
                        clearCols(indexNumber, numberOfMatchingCandies);
                        if (isGameStarted && numberOfMatchingCandies==4){
                            if (!candyToReplace){
                                cells[indexNumber].className = `cell ${currentCandyType}`;
                                cells[indexNumber].dataset.subtype = 2;
                                } else {
                                    if (parseInt(candyToReplace.dataset.col) == j){
                                        let stripedCandyRow = parseInt(candyToReplace.dataset.row);
                                        let stripedCandyCol = parseInt(candyToReplace.dataset.col);
                                        let stripedCandyIndexNumber = calculateIndexNumber(stripedCandyRow, stripedCandyCol);
                                        cells[stripedCandyIndexNumber].className = `cell ${currentCandyType}`;
                                        cells[stripedCandyIndexNumber].dataset.subtype = 2;
                                    } else {
                                        let stripedCandyRow = parseInt(draggedCandy.dataset.row);
                                        let stripedCandyCol = parseInt(draggedCandy.dataset.col);
                                        let stripedCandyIndexNumber = calculateIndexNumber(stripedCandyRow, stripedCandyCol);
                                        cells[stripedCandyIndexNumber].className = `cell ${currentCandyType}`;
                                        cells[stripedCandyIndexNumber].dataset.subtype = 2;
                                    }
                                }
                            } else {
                            //in case of matches of three nothing else happens
                            }
                    }



                }
            }
        }
    }
    return matchWasFound;
}

//extra feature for Codecool candy
function handleCodecoolCandy(candyType) {
    for (let i = 0; i < 8; i++) {
        for ( let j = 0; j < 8; j++) {
            let indexNumber = calculateIndexNumber(i, j)
            let currentCandyType = findCandyType(cells[indexNumber])
            if (currentCandyType === candyType) {
                clearRows(indexNumber, 1)
            }
        }
    }
}



// Move down candies
function moveDownCandies() {
    for (let i = width - 1; i > 0; i--) {

        for (let j = 0; j < width; j++) {
            let indexNumber = calculateIndexNumber(i, j);
            if (cells[indexNumber].classList.contains('empty')) {
                for (let k = i - 1; k >= 0; k--) {
                    // setTimeout(function(){console.log('0') }, 2000);
                    let aboveCandyIndexNumber = calculateIndexNumber(k, j);
                    if (!cells[aboveCandyIndexNumber].classList.contains('empty')) {
                        cells[indexNumber].classList.remove('empty');
                        let aboveCandyType = findCandyType(cells[aboveCandyIndexNumber]);
                        let aboveCandySubtype = parseInt(cells[aboveCandyIndexNumber].dataset.subtype);
                        cells[indexNumber].classList.add(aboveCandyType);
                        cells[indexNumber].dataset.subtype = aboveCandySubtype;

                        cells[aboveCandyIndexNumber].classList.add('empty');
                        cells[aboveCandyIndexNumber].classList.remove(aboveCandyType);
                        cells[aboveCandyIndexNumber].dataset.subtype = 0;
                        break
                    }
                }
            }
        }

    }
}

//Generate new candies
function generateNewCandies() {
    for (let i = cells.length - 1; i >= 0; i--) {
        if (cells[i].classList.contains('empty')) {
            let randomCandy = createRandomCandy();
            let randomCandyType = basicCandies[randomCandy];
            cells[i].classList.remove('empty');
            cells[i].classList.add(randomCandyType);
            cells[i].dataset.subtype = 0;
        }
    }
}

