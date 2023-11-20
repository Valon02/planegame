let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

let player;
let laser;
let enemiesGoRight;
let enemiesGoLeft;

let lastTime;

let spawnTimer;


function initGame() {
    player = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        width: 30,
        height: 30,
        color: 'blue',
        left: false,
        right: false,
        up: false,
        down: false,
    }

    laser = [];

    enemiesGoRight = [];
    enemiesGoLeft = [];

    lastTime = Date.now();
    spawnTimer = 1;

    requestAnimationFrame(tick);
}

let lastShot = 0;
// lägger in eventlisteners för knappar
window.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
        player.left = true;
    } else if (event.key === "ArrowRight") {
        player.right = true;
    } else if (event.key === "ArrowUp") {
        player.up = true;
    } else if (event.key === "ArrowDown") {
        player.down = true;
    }

    let now = Date.now();
    if (event.key === " " && (now - lastShot) > 100) {
        spawnLaser();
        lastShot = now;
    }
});


// hantera movement av planet
window.addEventListener("keyup", function (event) {
    if (event.key === "ArrowLeft") {
        player.left = false;
    } else if (event.key === "ArrowRight") {
        player.right = false;
    } else if (event.key === "ArrowUp") {
        player.up = false;
    } else if (event.key === "ArrowDown") {
        player.down = false;
    }
});

// spawn laser
function spawnLaser() {
    let playerLaser = {
        x: player.x + (player.width / 2) - (5 / 2),
        y: player.y - (player.height / 2),
        width: 5,
        height: 20,
    }

    laser.push(playerLaser)
}

// spawn enemies
function spawnEnemies() {
    let yRight = Math.random() * (canvas.width - 50) + 20;
    let yLeft = Math.random() * (canvas.width - 50) + 20;
    let spawnRight = {
        x: 0,
        y: yRight,
        width: 20,
        height: 20,
        color: "green"
    }

    enemiesGoRight.push(spawnRight)

    let spawnLeft = {
        x: canvas.width,
        y: yLeft,
        width: 20,
        height: 20,
        color: "orange"
    }

    enemiesGoLeft.push(spawnLeft)
}

// function tick
function tick() {
    // RÃ¤knar ut hur lÃ¥ng tid som har gÃ¥tt sedan fÃ¶rra 'tick' omgÃ¥ngen.
    let now = Date.now();
    let deltaTime = (now - lastTime) / 1000;
    lastTime = now;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // rita ut vår spelare
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height)

    // Hanterar sjÃ¤lva rÃ¶relsen pÃ¥ spelaren. Den fÃ¥r spelaren att Ã¥ka åt olika håll. Den lÃ¥ter inte spelaren Ã¥ka utanfÃ¶r spelplanen.
    if (player.left && player.x > 0) {
        player.x -= 150 * deltaTime;
    } else if (player.right && player.x < canvas.width - player.width) { //&& player.x + player.width < canvas.width) {
        player.x += 150 * deltaTime;
    } else if (player.up && player.y > 0) {
        player.y -= 150 * deltaTime;
    } else if (player.down && player.y < canvas.height - player.height) {
        player.y += 150 * deltaTime;
    }

    // ---  loopa ut laser
    for (let i = 0; i < laser.length; i++) {
        let playerLaser = laser[i];

        // Rita ut laser här
        ctx.fillStyle = 'red';
        ctx.fillRect(playerLaser.x, playerLaser.y, playerLaser.width, playerLaser.height)

        playerLaser.y -= 300 * deltaTime;
        if (playerLaser.y < 0) {
            laser.splice(i, 1);
            i--;
            continue;
        }

    }


    for (let i = 0; i < enemiesGoRight.length; i++) {
        let spawnRight = enemiesGoRight[i];

       // rita ut enemies här
        ctx.fillStyle = spawnRight.color;
        ctx.fillRect(spawnRight.x, spawnRight.y, spawnRight.width, spawnRight.height)

        spawnRight.x ++;
        if (spawnRight.x > canvas.width) {
            enemiesGoRight.splice(i, 1)
        }

    }

    for (let i = 0; i < enemiesGoLeft.length; i++) {
        let spawnLeft = enemiesGoLeft[i];

       // rita ut enemies här
        ctx.fillStyle = spawnLeft.color;
        ctx.fillRect(spawnLeft.x, spawnLeft.y, spawnLeft.width, spawnLeft.height)

        spawnLeft.x --;
        if (spawnLeft.x < -20) {
            enemiesGoLeft.splice(i, 1)
        }

    }
    
    // RÃ¤knar ned spawn timern. NÃ¤r den gÃ¥r till noll sÃ¥ vill vi "spawna" ett nytt Ã¤pple.
    spawnTimer -= deltaTime;
    if (spawnTimer <= 0) {
    spawnEnemies();

    // Spawna ett nytt Ã¤pple efter tvÃ¥ sekunder.
    spawnTimer = 3;
    }

    requestAnimationFrame(tick);
    
}

// starta spelet
initGame();

//score och speed i "function innitGame()