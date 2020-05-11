let board = document.querySelector(".board");
let width = 8;
//let basicCandies = ["url('/static/images/Adam.png')", "url('/static/images/Agi.png')", "url('/static/images/Bence.png')",
//    "url('/static/images/Gabor.png')", "url('/static/images/Laci.png')", "url('/static/images/Reka.png')" ]

//let horizontalCandies = ["url('/static/images/Adam.png')", "url('/static/images/Agi.png')", "url('/static/images/Bence.png')",
  //  "url('/static/images/Gabor.png')", "url('/static/images/Laci.png')", "url('/static/images/Reka.png')" ]

let basicCandies = ['Laci', 'Gabor', 'Agi', 'Bence', 'Reka', 'Adam'];

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
        let randomNumber = createRandomCandy();
        let candyType = basicCandies[randomNumber];
        cell.classList.add(candyType);
        board.appendChild(cell);


    }
}

function createRandomCandy() {
    let randomNumber = Math.floor(Math.random() * basicCandies.length);
    return randomNumber;
}

