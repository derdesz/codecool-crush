let board = document.querySelector(".board");
let width = 8;



initGame();

function initGame() {
    createBoard();
    // Your game can start here, but define separate functions, don't write everything in here :)
}

function createBoard() {
    for (let i=0; i < width*width; i++) {
        cell = document.createElement('div');
        cell.className = 'cell';
        cell.setAttribute('id', `c${i}`);
        board.appendChild(cell);
    }
}