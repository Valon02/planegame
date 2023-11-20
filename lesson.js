let canvas = document.getElementById("canvas");
let restartBtn = document.getElementById("restart-btn");
let pointsTable = document.getElementById("points-table");

let appleImg = document.getElementById("apple-img");
let basketImg = document.getElementById("basket-img");
let bgImg = document.getElementById("bg-img");

let ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

// Denna variabel representerar spelaren (korgen) pÃ¥ spelplanen. Det Ã¤r ett objekt som innehÃ¥ller position, bredd, hÃ¶jd och mer.
let player;

// Denna variabel hÃ¥ller alla representationer av Ã¤pplen. Det Ã¤r en array som innehÃ¥ller en massa objekt, och varje objekt Ã¤r ett Ã¤pple.
let apples;

// Denna variabel hÃ¥ller koll pÃ¥ vad tiden var under den senaste 'tick' omgÃ¥ngen. Den Ã¤r till fÃ¶r att rÃ¤kna ut 'deltaTime'.
let lastTime;

// Denna variabel hÃ¥ller koll pÃ¥ nÃ¤r ett nytt Ã¤pple ska "spawna". Den rÃ¤knar i sekunder.
let spawnTimer;

// Denna variabel hÃ¥ller koll pÃ¥ hur mÃ¥nga Ã¤pplen spelaren har fÃ¥ngat.
let points;

// Denna variabel hÃ¥ller koll pÃ¥ hur lÃ¥ng tid det Ã¤r kvar i spelet (den rÃ¤knar frÃ¥n 60 sekunder).
let gameTimer;

// Denna funktion Ã¤r till fÃ¶r att starta spelet. Den initialiserar alla variabler och sÃ¤tter igÃ¥ng 'tick' funtionen.
function initGame() {
  player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 70,
    width: 50,
    height: 50,
    left: false,
    right: false,
  };

  apples = [];

  points = 0;

  lastTime = Date.now();
  spawnTimer = 1;
  gameTimer = 5;

  requestAnimationFrame(tick);
}

// Vi lÃ¤gger till en event listener fÃ¶r att kunna starta om spelet.
restartBtn.addEventListener("click", function () {
  restartBtn.style.display = "none";
  initGame();
});

// Vi lÃ¤gger till en event listener fÃ¶r att hantera spelarens rÃ¶relse. Denna event listener registrerar nÃ¤r man trycker pÃ¥ vÃ¤nster pil eller hÃ¶ger pil.
window.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    player.left = true;
  } else if (event.key === "ArrowRight") {
    player.right = true;
  }
});

// Vi lÃ¤gger till en event listener fÃ¶r att hantera spelarens rÃ¶relse. Denna event listener registrerar nÃ¤r man slÃ¤pper vÃ¤nster pil eller hÃ¶ger pil och gÃ¶r sÃ¥ att spelaren slutar rÃ¶ra pÃ¥ sig.
window.addEventListener("keyup", function (event) {
  if (event.key === "ArrowLeft") {
    player.left = false;
  } else if (event.key === "ArrowRight") {
    player.right = false;
  }
});

// Denna funktion sparar spelarens poÃ¤ng till local storage.
function saveToLocalStorage(name, points) {
  let data = localStorage.getItem("points");
  let allPoints = data ? JSON.parse(data) : [];

  allPoints.push({
    name,
    points,
  });

  localStorage.setItem("points", JSON.stringify(allPoints));
}

// Denna funktion renderar ut alla spelares poÃ¤ng.
function renderPointsTable() {
  // Ta bort alla rader i tabellen fÃ¶rutom den fÃ¶rsta (som innehÃ¥ller sjÃ¤lva kolumnerna)
  while (pointsTable.children.length > 1) {
    pointsTable.children[1].remove();
  }

  let data = localStorage.getItem("points");
  let allPoints = data ? JSON.parse(data) : [];

  // Sorterar sÃ¥ att de med hÃ¶gst poÃ¤ng visas hÃ¶gst upp i tabellen.
  allPoints.sort(function (a, b) {
    return b.points - a.points;
  });

  for (let i = 0; i < allPoints.length; i++) {
    let playerPoints = allPoints[i];

    let row = document.createElement("tr");
    let name = document.createElement("td");
    let points = document.createElement("td");

    name.innerText = playerPoints.name;
    points.innerText = playerPoints.points;

    row.append(name, points);
    pointsTable.append(row);
  }
}

// Denna funktion fÃ¥r hela spelet att fungera. Den ritar ut alla objekt (spelare, Ã¤pplen), hanterar rÃ¶relse pÃ¥ alla objekt och rÃ¤knar poÃ¤ng.
function tick() {
  // RÃ¤knar ut hur lÃ¥ng tid som har gÃ¥tt sedan fÃ¶rra 'tick' omgÃ¥ngen.
  let now = Date.now();
  let deltaTime = (now - lastTime) / 1000;
  lastTime = now;

  // TÃ¶mmer skÃ¤rmen sÃ¥ att vi kan rita ut allt pÃ¥ nytt.
  // Vi kan ocksÃ¥ rita en bakgrund och dÃ¥ behÃ¶vs inte "clearRect".
  //ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  // RÃ¤knar ned spelets timer. NÃ¤r den gÃ¥r ned till noll sÃ¥ Ã¤r spelet Ã¶ver.
  gameTimer -= deltaTime;
  if (gameTimer <= 0) {
    gameTimer = 0.0;

    // Spara till local storage sÃ¥ att vi kommer ihÃ¥g hur mÃ¥nga poÃ¤ng vi fick.
    let name = prompt("Write your name:");
    saveToLocalStorage(name, points);
    renderPointsTable();

    restartBtn.style.display = "block";
  } else {
    // EfterfrÃ¥gar en ny tick.
    requestAnimationFrame(tick);
  }

  // RÃ¤knar ned spawn timern. NÃ¤r den gÃ¥r till noll sÃ¥ vill vi "spawna" ett nytt Ã¤pple.
  spawnTimer -= deltaTime;
  if (spawnTimer <= 0) {
    spawnApple();

    // Spawna ett nytt Ã¤pple efter tvÃ¥ sekunder.
    spawnTimer = 2;
  }

  // Hanterar sjÃ¤lva rÃ¶relsen pÃ¥ spelaren. Den fÃ¥r spelaren att Ã¥ka Ã¥t vÃ¤nster eller hÃ¶ger baserat pÃ¥ 'left' och 'right' variablerna. Den lÃ¥ter inte spelaren Ã¥ka utanfÃ¶r spelplanen.
  if (player.left && player.x > 0) {
    player.x -= 300 * deltaTime;
  } else if (player.right && player.x + player.width < canvas.width) {
    player.x += 300 * deltaTime;
  } 

  // Ritar ut spelaren med en bild.
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(basketImg, player.x, player.y, player.width, player.height);

  for (let i = 0; i < apples.length; i++) {
    let apple = apples[i];

    // GÃ¶r sÃ¥ att ett (alla) Ã¤pple faller nedÃ¥t.
    apple.y += 150 * deltaTime;
    // Tar bort ett Ã¤pple om det hamnar utanfÃ¶r spelplanen.
    if (apple.y - apple.radius >= canvas.height) {
      apples.splice(i, 1);
      i--;
      continue;
    }

    // Hanterar kollision mellan spelare och Ã¤pple. Vi lÃ¥tsas att varje Ã¤pple Ã¤r en rektangel fÃ¶r att gÃ¶ra saken lÃ¤ttare. Om en spelare nuddar ett Ã¤pple sÃ¥ fÃ¥r vi poÃ¤ng (eftersom vi har "fÃ¥ngat" Ã¤pplet).
    if (isColliding(player, apple)) {
      points++;
      apples.splice(i, 1);
      i--;
      continue;
    }

    // Ritar ut ett (alla) Ã¤pple.
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(appleImg, apple.x, apple.y, apple.width, apple.height);
  }

  // Ritar ut poÃ¤ng.
  ctx.font = "25px serif";
  ctx.fillStyle = "black";
  ctx.fillText("Points: " + points, 500, 30);

  // Ritar ut spelets timer.
  ctx.font = "25px serif";
  ctx.fillStyle = "black";
  ctx.fillText("Timer: " + gameTimer.toFixed(1), 20, 30);
}

// Denna funktion "spawnar" in Ã¤pplen i spelet. Den ansvarar inte fÃ¶r nÃ¥gon timer utan lÃ¤gger endast in objekt i 'apples' arrayen.
function spawnApple() {
  let x = Math.random() * (canvas.width - 60) + 30;
  let apple = {
    x: x,
    y: -20,
    width: 30,
    height: 30,
  };

  apples.push(apple);
}

function isColliding(rect1, rect2) {
  if (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  ) {
    return true;
  } else {
    return false;
  }
}

// Ritar ut tabellen med poÃ¤ng.
renderPointsTable();

// Startar igÃ¥ng spelet.
initGame();