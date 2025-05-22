const gameBoard = document.querySelector('#gameBoard');
const ctx = gameBoard.getContext('2d');
const scoreText = document.querySelector('#scoreText');
const resetBtn = document.querySelector('#resetBtn');
const gameWrapper = document.querySelector('#gameWrapper'); // Seleziona il nuovo wrapper

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;

// Colori aggiornati per abbinarsi al nuovo tema arcade
const boardBackground = '#0d1a26'; // Blu scuro quasi nero
const snakeColor = '#00ff00';     // Verde neon
const snakeBorder = '#32cd32';    // Verde più scuro per il bordo
const foodColor = '#ff0000';      // Rosso vivo per il cibo
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

// Event listeners per il controllo del gioco e il ridimensionamento
window.addEventListener('keydown', changeDirection);
resetBtn.addEventListener('click', resetGame);
window.addEventListener('resize', scaleGameWrapper);

// Avvia il gioco e imposta la scala quando la pagina è completamente caricata
window.addEventListener('load', () => {
    gameStart();
    scaleGameWrapper(); // Applica la scala all'avvio
});

/**
 * Avvia o riavvia il ciclo di gioco.
 */
function gameStart(){
  running = true;
  scoreText.textContent = score; // Aggiorna il punteggio visualizzato
  createFood(); // Crea una nuova posizione per il cibo
  drawFood();   // Disegna il cibo sul canvas
  nextTick();   // Inizia il ciclo di gioco
};

/**
 * Controlla il flusso del gioco, aggiornando lo stato a ogni "tick".
 */
function nextTick(){
  if(running){
    setTimeout(() => {
      clearBoard();     // Pulisce il canvas
      drawFood();       // Ridiscende il cibo
      moveSnake();      // Muove il serpente
      drawSnake();      // Ridiscende il serpente
      checkGameOver();  // Controlla se il gioco è finito
      nextTick();       // Richiama se stesso per il prossimo tick
    }, 75) // Ritardo di 75ms tra ogni tick per controllare la velocità
  }
  else{
    displayGameOver(); // Mostra la schermata di Game Over se il gioco non è in esecuzione
  }
};

/**
 * Pulisce l'intero canvas riempiendolo con il colore di sfondo.
 */
function clearBoard(){
  ctx.fillStyle = boardBackground; // Imposta il colore di sfondo
  ctx.fillRect(0, 0, gameWidth, gameHeight); // Disegna un rettangolo che copre l'intero canvas
};

/**
 * Genera una nuova posizione casuale per il cibo.
 */
function createFood(){
  function randomFood(min, max){
    // Genera un numero casuale all'interno del range e lo arrotonda alla griglia unitSize
    const randNum = Math.round((Math.random() * (max-min) + min) / unitSize)* unitSize;
    return randNum;
  }
  foodX = randomFood(0, gameWidth - unitSize);  // Posizione X del cibo
  foodY = randomFood(0, gameHeight - unitSize); // Posizione Y del cibo (usa gameHeight)
};

/**
 * Disegna il cibo sul canvas.
 */
function drawFood(){
  ctx.fillStyle = foodColor; // Imposta il colore del cibo
  ctx.fillRect(foodX, foodY, unitSize, unitSize); // Disegna il cibo come un quadrato
};

/**
 * Aggiorna la posizione del serpente e gestisce la collisione con il cibo.
 */
function moveSnake(){
  // Crea la nuova testa del serpente in base alla direzione corrente
  const head = {
    x: snake[0].x + xVelocity,
    y: snake[0].y + yVelocity
  };
  snake.unshift(head); // Aggiunge la nuova testa all'inizio dell'array

  // Controlla se il serpente ha mangiato il cibo
  if(snake[0].x === foodX && snake[0].y === foodY){ // Confronto rigoroso con ===
    score += 1; // Incrementa il punteggio
    scoreText.textContent = score; // Aggiorna il punteggio visualizzato
    createFood(); // Crea nuovo cibo
  }
  else{
    snake.pop(); // Rimuove l'ultima parte del serpente se il cibo non è stato mangiato
  }
};

/**
 * Disegna il serpente sul canvas.
 */
function drawSnake(){
  ctx.fillStyle = snakeColor;   // Imposta il colore del corpo del serpente
  ctx.strokeStyle = snakeBorder; // Imposta il colore del bordo del serpente
  snake.forEach((snakePart)=>{
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);   // Disegna il corpo
    ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize); // Disegna il bordo
  })
};

/**
 * Cambia la direzione del serpente in base al tasto premuto.
 * Evita di far girare il serpente su se stesso (es. andare a sinistra se sta già andando a destra).
 * @param {KeyboardEvent} event L'evento della tastiera.
 */
function changeDirection(event){
  // Usa event.code per identificare i tasti freccia in modo più robusto
  const keyPressed = event.code;
  const LEFT = 'ArrowLeft';
  const UP = 'ArrowUp';
  const RIGHT = 'ArrowRight';
  const DOWN = 'ArrowDown';

  // Controlla la direzione corrente del serpente
  const goingUp = (yVelocity === -unitSize);
  const goingDown = (yVelocity === unitSize);
  const goingRight = (xVelocity === unitSize);
  const goingLeft = (xVelocity === -unitSize);

  switch(true){
    case(keyPressed === LEFT && !goingRight): // Se si preme sinistra e non si va già a destra
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case(keyPressed === UP && !goingDown):    // Se si preme su e non si va già in basso
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case(keyPressed === RIGHT && !goingLeft): // Se si preme destra e non si va già a sinistra
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case(keyPressed === DOWN && !goingUp):    // Se si preme giù e non si va già in alto
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
};

/**
 * Controlla se il gioco è finito (collisione con i bordi o con se stesso).
 */
function checkGameOver(){
  // Collisione con i bordi del gioco
  if(snake[0].x < 0 ||
     snake[0].x >= gameWidth ||
     snake[0].y < 0 ||
     snake[0].y >= gameHeight){ // Usa gameHeight per il bordo inferiore
    running = false;
  }
  // Collisione con se stesso
  for(let i = 1; i < snake.length; i += 1){
    if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
      running = false; // Il gioco finisce
      break; // Esci subito dal ciclo
    }
  }
};

/**
 * Mostra il messaggio "GAME OVER!" sul canvas.
 */
function displayGameOver(){
  // Stile per "GAME OVER!"
  ctx.font = '50px "Press Start 2P"'; // Utilizza il font arcade importato
  ctx.fillStyle = '#ff0000';         // Rosso vivo per il testo
  ctx.textAlign = 'center';           // Centra il testo orizzontalmente
  ctx.fillText('GAME OVER!', gameWidth / 2, gameHeight / 2 - 20); // Posizione leggermente sopra il centro

  // Stile per "TRY AGAIN!"
  ctx.font = '30px "Press Start 2P"'; // Stesso font, dimensione leggermente più piccola
  ctx.fillStyle = '#f39c12';         // Arancione brillante
  ctx.fillText('TRY AGAIN!', gameWidth / 2, gameHeight / 2 + 40); // Posizione sotto il centro

  // running = false; // Questa riga è ridondante perché è già impostata in checkGameOver
};

/**
 * Resetta lo stato del gioco per iniziare una nuova partita.
 */
function resetGame(){
  score = 0;
  xVelocity = unitSize;
  yVelocity = 0;
  // Resetta la posizione iniziale del serpente
  snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0}
  ];
  clearBoard(); // Pulisce il tabellone per rimuovere eventuali messaggi di Game Over
  gameStart(); // Avvia una nuova partita
};

/**
 * Scala l'intero wrapper del gioco per adattarlo alle dimensioni della finestra del browser.
 * Si assicura che il gioco non superi mai la sua dimensione "ideale" (100% di zoom)
 * e che rimanga sempre visibile per intero.
 */
function scaleGameWrapper() {
    // Definisci la dimensione "ideale" (non scalata) del tuo gameWrapper.
    // Questi valori DEVONO corrispondere circa alla dimensione massima che il tuo gioco dovrebbe avere
    // prima che la scala diventi 1 (cioè, il 100% di zoom ideale).
    // Puoi trovarli ispezionando l'elemento #gameWrapper nel browser su una finestra grande.
    const idealGameWidth = 600;  // Larghezza stimata (es. canvas + padding/margini)
    const idealGameHeight = 850; // Altezza stimata (es. titolo + canvas + punteggio + bottone + padding/margini)

    const viewportWidth = window.innerWidth;  // Larghezza corrente della finestra
    const viewportHeight = window.innerHeight; // Altezza corrente della finestra

    const margin = 60; // Un margine di sicurezza (es. 30px per lato) per non "incollare" il gioco ai bordi

    // Calcola il fattore di scala necessario per adattarsi alla larghezza disponibile
    const scaleX = (viewportWidth - margin) / idealGameWidth;
    // Calcola il fattore di scala necessario per adattarsi all'altezza disponibile
    const scaleY = (viewportHeight - margin) / idealGameHeight;

    let scaleFactor = Math.min(scaleX, scaleY);

    // IMPEDISCI CHE IL GIOCO SI INGRANDISCA OLTRE LA SUA DIMENSIONE ORIGINALE (ZOOM 100%)
    // Questo assicura che il gioco non diventi mai più grande della sua dimensione "ideale".
    scaleFactor = Math.min(scaleFactor, 1); 

    // Applica la trasformazione di scala al wrapper del gioco
    gameWrapper.style.transform = `scale(${scaleFactor})`;
    // Imposta il punto di origine della trasformazione al centro, per mantenere il gioco centrato
    gameWrapper.style.transformOrigin = 'center center'; 
}
