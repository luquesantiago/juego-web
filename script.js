//////////////////////////////////////////
////////////variables/////////////////////
var player = document.getElementById('player');
var gameBoard = document.getElementById('game-board');
var direction = null;
var intervalId = null;
var coinCount = 0;
var restartButton = null; 
let puntuaciones = [];
var coinCounter = document.createElement('div');
coinCounter.innerHTML = 'Monedas: 0';
document.body.appendChild(coinCounter);




//////////////////////////
/////////movimiento///////
/////////////////////////

function isPlayerInGameBoard(top, left) 
{
    return top >= 0 && left >= 0 && 
           top <= gameBoard.offsetHeight - player.offsetHeight && 
           left <= gameBoard.offsetWidth - player.offsetWidth;
}
function movePlayer(e) 
{
    direction = e.key;
}
function updatePlayerPosition() 
{
    if (!direction) return;

    var playerStyle = window.getComputedStyle(player);
    var top = parseInt(playerStyle.top);
    var left = parseInt(playerStyle.left);
    //movimiento direccion
    switch(direction) 
    {
        case 'w':
            top -= 8;
            break;
        case 's':
            top += 8;
            break;
        case 'a':
            left -= 8;
            break;
        case 'd':
            left += 8;
            break;
    }
    if (isPlayerInGameBoard(top, left)) 
    {
        player.style.top = top + 'px';
        player.style.left = left + 'px';
        // Chequeo de colisiones con onedas
        var coins = document.getElementsByClassName('coin');
        
        for (var i = 0; i < coins.length; i++) 
        {
            var coin = coins[i];
            var coinRect = coin.getBoundingClientRect();
            var playerRect = player.getBoundingClientRect();

            if (rectsOverlap(playerRect, coinRect)) 
            {
                gameBoard.removeChild(coin);
                coinCount++;
                coinCounter.innerHTML = 'Monedas: ' + coinCount;

                addCoin();

                //aumento de dificultad
                if (coinCount % 10 === 0) 
                {
                    addEnemy();
                    addEnemy();
                }
                break;
            }
        }

        // chequeo de colisiones con enemigos
        var enemies = document.getElementsByClassName('enemy');

        for (var i = 0; i < enemies.length; i++) 
        {
            var enemy = enemies[i];
            var enemyRect = enemy.getBoundingClientRect();
            var playerRect = player.getBoundingClientRect();

            if (rectsOverlap(playerRect, enemyRect)) 
            {
                clearInterval(intervalId);
                player.style.display = 'none';
                showGameOverScreen();
                break;
            }
        }
    } 
    else 
    {
        clearInterval(intervalId);
        player.style.display = 'none';
        showGameOverScreen();
    }
}

////////////////////////////
////////entidades///////////
///////////////////////////
function addCoin() 
{
   var coin = document.createElement('div');
   coin.className = 'coin game-item';
   coin.style.top = Math.random() * (gameBoard.offsetHeight - 50) + 'px'; 
   coin.style.left = Math.random() * (gameBoard.offsetWidth - 50) + 'px'; 

   gameBoard.appendChild(coin);
}

function addEnemy() 
{
   var enemy = document.createElement('div');
   enemy.className = 'enemy game-item';
   enemy.style.top = Math.random() * (gameBoard.offsetHeight - 50) + 'px';
   enemy.style.left = Math.random() * (gameBoard.offsetWidth - 50) + 'px';
   gameBoard.appendChild(enemy);

   var dx = Math.random() < 0.5 ? -1 : 1; // Dirección horizontal inicial
   var dy = Math.random() < 0.5 ? -1 : 1; // Dirección vertical inicial

   // intervalo de movimiento de enemigos
   setInterval(function() {
       var enemyStyle = window.getComputedStyle(enemy);
       var top = parseInt(enemyStyle.top);
       var left = parseInt(enemyStyle.left);
       top += dy * 5; 
       left += dx * 5; 

       //para que no salga del board
       if (top < 0) 
       {
           top = 0;
           dy = -dy; // Cambia la dirección vertical
       }
       if (left < 0) 
       {
           left = 0;
           dx = -dx; // Cambia la dirección horizontal
       }
       if (top > gameBoard.offsetHeight - 50) 
       { 
           top = gameBoard.offsetHeight - 50;
           dy = -dy; // Cambia la dirección vertical
       }
       if (left > gameBoard.offsetWidth - 50) 
       { 
           left = gameBoard.offsetWidth - 50;
           dx = -dx; // Cambia la dirección horizontal
       }

       enemy.style.top = top + 'px';
       enemy.style.left = left + 'px';
   }, 100);
}


//////////////////////////////
//////////colisiones//////////
//////////////////////////////
function rectsOverlap(rect1, rect2) {
    return !(rect1.right < rect2.left || 
             rect1.left > rect2.right || 
             rect1.bottom < rect2.top || 
             rect1.top > rect2.bottom);
}


//////////////////////////////////
///////////// Inicio//////////////
/////////////////////////////////
window.addEventListener('keydown', movePlayer);
intervalId = setInterval(updatePlayerPosition, 100);
for (var i = 0; i < 5; i++) {
    addCoin();
    addEnemy();
}


///////////////////////////////
////tablero de puntuaciones////
///////////////////////////////
function actualizarTablero() 
{
    var scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = ''; // Limpiar el tablero

    // Crear una nueva lista ordenada
    var ol = document.createElement('ol');

    // Agregar cada puntuación a la lista
    for (var i = 0; i < puntuaciones.length; i++) {
        var li = document.createElement('li');
        li.innerHTML = puntuaciones[i].nombre + ': ' + puntuaciones[i].puntaje;
        ol.appendChild(li);
    }

    // Agregar la lista al tablero
    scoreboard.appendChild(ol);
}

function agregarPuntuacion(puntaje) 
{
    let nombre = prompt("Por favor ingresa tu nombre");
    puntuaciones.push({nombre: nombre, puntaje: puntaje});

    // Ordenar la lista de puntuaciones de mayor a menor
    puntuaciones.sort((a, b) => b.puntaje - a.puntaje);

    // Actualizar el tablero de puntuaciones
    actualizarTablero();
}


//////////////////////////////////////
//////////////reinicio////////////////
//////////////////////////////////////
function showGameOverScreen() 
{

    agregarPuntuacion(coinCount);
    var gameOverScreen = document.createElement('div');
    gameOverScreen.innerHTML = "¡Has perdido!";
    gameOverScreen.style.position = 'absolute';
    gameOverScreen.style.top = '60%';
    gameOverScreen.style.left = '50%';
    gameOverScreen.style.transform = 'translate(-50%, -50%)';

    restartButton = document.createElement('button');
    restartButton.innerHTML = 'Reiniciar';
    restartButton.style.position = 'absolute';
    restartButton.style.top = '50%';
    restartButton.style.left = '32%';
    restartButton.style.transform = 'translate(-50%, -50%)';
    restartButton.onclick = restartGame;
    document.body.appendChild(restartButton); // Agrega el botón de reinicio al cuerpo del documento
    
    gameBoard.appendChild(gameOverScreen);
}
function restartGame() 
{
    while (gameBoard.firstChild) {
        gameBoard.removeChild(gameBoard.firstChild);
    }

    player.style.top = '50%';
    player.style.left = '50%';
    player.style.display = 'block';
 
    gameBoard.appendChild(player);
 
    direction = null;
    intervalId = setInterval(updatePlayerPosition, 100);
 
    coinCount = 0;
    coinCounter.innerHTML = 'Monedas: 0';
 
    for (var i = 0; i < 5; i++) {
        addCoin();
        addEnemy();
    }
 
    if (document.body.contains(restartButton)) {
        document.body.removeChild(restartButton);
    }
}

