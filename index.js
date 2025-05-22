const gameBoard = document.querySelector('#gameBoard');
const ctx = gameBoard.getContext('2d');
const scoreText = document.querySelector('#scoreText');
const resetBtn = document.querySelector('#resetBtn');
const gameWrapper = document.querySelector('#gameWrapper');

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;

const boardBackground = '#0d1a26';
const snakeColor = '#00ff00';
const snakeBorder = '#32cd32';
const foodColor = '#ff0000';
const unitSize = 25;

let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
  {x:unitSize * 4, y:0},
  {x:unitSize * 3, y:0},
  {x:unitSize * 2, y:0},
  {x:unitSize, y:0},
  {x:0, y:0}
];

window.addEventListener('keydown', changeDirection);
resetBtn.addEventListener('click', resetGame);
window.addEventListener('resize', scaleGameWrapper);

window.addEventListener('load', () => {
    gameStart();
    scaleGameWrapper();
});

function gameStart(){
  running = true;
  scoreText.textContent = score;
  createFood();
  drawFood();
  nextTick();
};

function nextTick(){
  if(running){
    setTimeout(() => {
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    }, 75)
  }
  else{
    displayGameOver();
  }
};

function clearBoard(){
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
};

function createFood(){
  function randomFood(min, max){
    const randNum = Math.round((Math.random() * (max-min) + min) / unitSize)* unitSize;
    return randNum;
  }
  foodX = randomFood(0, gameWidth - unitSize);
  foodY = randomFood(0, gameHeight - unitSize);
};

function drawFood(){
  ctx.fillStyle = foodColor;
  ctx.fillRect(foodX, foodY, unitSize, unitSize);
};

function moveSnake(){
  const head = {
    x: snake[0].x + xVelocity,
    y: snake[0].y + yVelocity
  };
  snake.unshift(head);
  if(snake[0].x === foodX && snake[0].y === foodY){
    score += 1;
    scoreText.textContent = score;
    createFood();
  }
  else{
    snake.pop();
  }
};

function drawSnake(){
  ctx.fillStyle = snakeColor;
  ctx.strokeStyle = snakeBorder;
  snake.forEach((snakePart)=>{
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
  })
};

function changeDirection(event){
  const keyPressed = event.code;
  const LEFT = 'ArrowLeft';
  const UP = 'ArrowUp';
  const RIGHT = 'ArrowRight';
  const DOWN = 'ArrowDown';

  const goingUp = (yVelocity === -unitSize);
  const goingDown = (yVelocity === unitSize);
  const goingRight = (xVelocity === unitSize);
  const goingLeft = (xVelocity === -unitSize);

  switch(true){
    case(keyPressed === LEFT && !goingRight):
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case(keyPressed === UP && !goingDown):
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case(keyPressed === RIGHT && !goingLeft):
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case(keyPressed === DOWN && !goingUp):
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
};

function checkGameOver(){
  if(snake[0].x < 0 ||
     snake[0].x >= gameWidth ||
     snake[0].y < 0 ||
     snake[0].y >= gameHeight){
    running = false;
  }
  for(let i = 1; i < snake.length; i += 1){
    if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
      running = false;
      break;
    }
  }
};

function displayGameOver(){
  ctx.font = '50px "Press Start 2P"';
  ctx.fillStyle = '#ff0000';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER!', gameWidth / 2, gameHeight / 2 - 20);

  ctx.font = '30px "Press Start 2P"';
  ctx.fillStyle = '#f39c12';
  ctx.fillText('TRY AGAIN!', gameWidth / 2, gameHeight / 2 + 40);
};

function resetGame(){
  score = 0;
  xVelocity = unitSize;
  yVelocity = 0;
  snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
  ];
  clearBoard();
  gameStart();
};

function scaleGameWrapper() {
    const idealGameWidth = 600;
    const idealGameHeight = 850;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const margin = 60;

    const scaleX = (viewportWidth - margin) / idealGameWidth;
    const scaleY = (viewportHeight - margin) / idealGameHeight;

    let scaleFactor = Math.min(scaleX, scaleY);

    scaleFactor = Math.min(scaleFactor, 1);

    gameWrapper.style.transform = `scale(${scaleFactor})`;
    gameWrapper.style.transformOrigin = 'center center';
}
