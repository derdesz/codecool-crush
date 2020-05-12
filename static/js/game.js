let board = document.querySelector(".board");
let width = 8;
//let basicCandies = ["url('/static/images/Adam.png')", "url('/static/images/Agi.png')", "url('/static/images/Bence.png')",
//    "url('/static/images/Gabor.png')", "url('/static/images/Laci.png')", "url('/static/images/Reka.png')" ]

let basicCandies = ['Laci', 'Gabor', 'Agi', 'Bence', 'Reka', 'Adam'];
let cells = []
initGame();


function initGame() {
    createBoard();
    addDraggingFunctionForCells();
    // Your game can start here, but define separate functions, don't write everything in here :)
}

function createBoard() {
    for (let i = 0; i < width * width; i++) {
        cell = document.createElement('div');
        cell.className = 'cell';
        // cell.setAttribute('id', `c${i}`);
        cell.dataset.indexNumber = i;
        row = Math.floor(i / width);
        col = i - (row * width);
        cell.dataset.row = row;
        cell.dataset.col = col;
        cell.setAttribute('draggable', true);
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

function dragStart(event) {
    console.log('dragStart');
}

function dragEnd(event) {
    console.log('dragEnd');
}

function dragEnter(event) {
    event.preventDefault();
    console.log('dragEnter');
}

function dragOver(event) {
    event.preventDefault();
    console.log('dragOver');
}

function dragLeave(event) {
    event.preventDefault();
    console.log('dragLeave');
}

function dragDrop(event) {
    event.preventDefault();
    console.log('dragDrop');
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

function movingCandies() {

}