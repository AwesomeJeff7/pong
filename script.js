const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 10;

let playerScore = 0;
let aiScore = 0;

let playerPaddle = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0
};

let aiPaddle = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 2 // Reduced AI speed to make it easier
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    speed: 4,
    dx: 4,
    dy: 4
};

function drawPaddle(paddle) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

function movePaddles() {
    playerPaddle.y += playerPaddle.dy;

    // AI paddle movement
    if (aiPaddle.y + aiPaddle.height / 2 < ball.y) {
        aiPaddle.y += aiPaddle.dy;
    } else {
        aiPaddle.y -= aiPaddle.dy;
    }

    // Prevent paddles from going out of canvas
    playerPaddle.y = Math.max(Math.min(playerPaddle.y, canvas.height - playerPaddle.height), 0);
    aiPaddle.y = Math.max(Math.min(aiPaddle.y, canvas.height - aiPaddle.height), 0);
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Ball collision with player paddle
    if (ball.x - ball.radius < playerPaddle.x + playerPaddle.width &&
        ball.y > playerPaddle.y && ball.y < playerPaddle.y + playerPaddle.height) {
        ball.dx *= -1;
        ball.speed += 0.5;
    }

    // Ball collision with AI paddle
    if (ball.x + ball.radius > aiPaddle.x &&
        ball.y > aiPaddle.y && ball.y < aiPaddle.y + aiPaddle.height) {
        ball.dx *= -1;
        ball.speed += 0.5;
    }

    // Ball goes out of bounds
    if (ball.x + ball.radius < 0) {
        aiScore++;
        resetBall();
    } else if (ball.x - ball.radius > canvas.width) {
        playerScore++;
        resetBall();
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 4;
    ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = 4 * (Math.random() > 0.5 ? 1 : -1);
    updateScoreboard();
}

function updateScoreboard() {
    document.getElementById('scoreboard').textContent = `Player: ${playerScore} | AI: ${aiScore}`;
}

function update() {
    movePaddles();
    moveBall();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle(playerPaddle);
    drawPaddle(aiPaddle);
    drawBall();

    requestAnimationFrame(update);
}

function keyDownHandler(e) {
    if (e.key === 'ArrowUp') {
        playerPaddle.dy = -8;
    } else if (e.key === 'ArrowDown') {
        playerPaddle.dy = 8;
    }
}

function keyUpHandler(e) {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        playerPaddle.dy = 0;
    }
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

update();
