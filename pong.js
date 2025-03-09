const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const SCREEN_WIDTH = canvas.width;
const SCREEN_HEIGHT = canvas.height;
const BALL_SIZE = 20;
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 100;

let playerScore = 0;
let aiScore = 0;

const playerPaddle = {
    x: 30,
    y: (SCREEN_HEIGHT - PADDLE_HEIGHT) / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    speed: 8,
    moveUp: false,
    moveDown: false
};

const aiPaddle = {
    x: SCREEN_WIDTH - 50,
    y: (SCREEN_HEIGHT - PADDLE_HEIGHT) / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    speed: 6
};

const ball = {
    x: SCREEN_WIDTH / 2,
    y: SCREEN_HEIGHT / 2,
    size: BALL_SIZE,
    speedX: 5,
    speedY: 5
};

document.addEventListener('keydown', (event) => {
    if (event.key === 'w') {
        playerPaddle.moveUp = true;
    } else if (event.key === 's') {
        playerPaddle.moveDown = true;
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'w') {
        playerPaddle.moveUp = false;
    } else if (event.key === 's') {
        playerPaddle.moveDown = false;
    }
});

function drawRect(x, y, width, height, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function drawBall(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = '40px Arial';
    ctx.fillText(text, x, y);
}

function movePaddle() {
    if (playerPaddle.moveUp && playerPaddle.y > 0) {
        playerPaddle.y -= playerPaddle.speed;
    } else if (playerPaddle.moveDown && playerPaddle.y < SCREEN_HEIGHT - PADDLE_HEIGHT) {
        playerPaddle.y += playerPaddle.speed;
    }
}

function moveAiPaddle() {
    if (aiPaddle.y + aiPaddle.height / 2 < ball.y) {
        aiPaddle.y += aiPaddle.speed;
    } else if (aiPaddle.y + aiPaddle.height / 2 > ball.y) {
        aiPaddle.y -= aiPaddle.speed;
    }
}

function moveBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    if (ball.y <= 0 || ball.y >= SCREEN_HEIGHT) {
        ball.speedY *= -1;
    }

    if (ball.x <= 0) {
        aiScore++;
        resetBall();
    } else if (ball.x >= SCREEN_WIDTH) {
        playerScore++;
        resetBall();
    }

    if (ball.x - ball.size <= playerPaddle.x + playerPaddle.width && 
        ball.y >= playerPaddle.y && 
        ball.y <= playerPaddle.y + playerPaddle.height) {
        ball.speedX *= -1.1; // Increase speed and change direction
    }

    if (ball.x + ball.size >= aiPaddle.x && 
        ball.y >= aiPaddle.y && 
        ball.y <= aiPaddle.y + aiPaddle.height) {
        ball.speedX *= -1.1; // Increase speed and change direction
    }
}

function resetBall() {
    ball.x = SCREEN_WIDTH / 2;
    ball.y = SCREEN_HEIGHT / 2;
    ball.speedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ball.speedY = 5 * (Math.random() > 0.5 ? 1 : -1);
}

function draw() {
    drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, '#000');
    drawRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height, '#FFF');
    drawRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height, '#FFF');
    drawBall(ball.x, ball.y, ball.size, '#FFF');
    drawText(playerScore, SCREEN_WIDTH / 4, 50, '#FFF');
    drawText(aiScore, SCREEN_WIDTH * 3 / 4, 50, '#FFF');
}

function update() {
    movePaddle();
    moveAiPaddle();
    moveBall();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
