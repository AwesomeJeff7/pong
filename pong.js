// Game constants
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 10;
const BALL_SPEED = 5;
const AI_SPEED = 4;

// Game variables
let canvas, ctx;
let ballX, ballY, ballSpeedX, ballSpeedY;
let playerY, aiY;
let playerScore = 0;
let aiScore = 0;

// Initialize the game
function init() {
    canvas = document.getElementById('pongCanvas');
    ctx = canvas.getContext('2d');
    
    // Set initial positions
    playerY = (canvas.height - PADDLE_HEIGHT) / 2;
    aiY = (canvas.height - PADDLE_HEIGHT) / 2;
    resetBall();

    // Add mouse movement listener
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseY = e.clientY - rect.top;
        playerY = Math.min(Math.max(mouseY - PADDLE_HEIGHT / 2, 0), canvas.height - PADDLE_HEIGHT);
    });

    // Start the game loop
    window.requestAnimationFrame(gameLoop);
}

// Reset ball to center
function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = BALL_SPEED * (Math.random() * 2 - 1);
}

// Update AI paddle position
function updateAI() {
    const aiCenter = aiY + PADDLE_HEIGHT / 2;
    const ballCenter = ballY;
    
    if (aiCenter < ballCenter - 35) {
        aiY += AI_SPEED;
    } else if (aiCenter > ballCenter + 35) {
        aiY -= AI_SPEED;
    }
    
    aiY = Math.min(Math.max(aiY, 0), canvas.height - PADDLE_HEIGHT);
}

// Check for collisions
function handleCollisions() {
    // Ball collision with top and bottom walls
    if (ballY <= 0 || ballY >= canvas.height - BALL_SIZE) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    if (ballX <= PADDLE_WIDTH && 
        ballY + BALL_SIZE >= playerY && 
        ballY <= playerY + PADDLE_HEIGHT) {
        ballSpeedX = -ballSpeedX;
        const relativeIntersectY = (playerY + (PADDLE_HEIGHT / 2)) - ballY;
        ballSpeedY = -relativeIntersectY * 0.1;
    }

    if (ballX >= canvas.width - PADDLE_WIDTH - BALL_SIZE && 
        ballY + BALL_SIZE >= aiY && 
        ballY <= aiY + PADDLE_HEIGHT) {
        ballSpeedX = -ballSpeedX;
        const relativeIntersectY = (aiY + (PADDLE_HEIGHT / 2)) - ballY;
        ballSpeedY = -relativeIntersectY * 0.1;
    }

    // Score points
    if (ballX <= 0) {
        aiScore++;
        document.getElementById('aiScore').textContent = aiScore;
        resetBall();
    } else if (ballX >= canvas.width) {
        playerScore++;
        document.getElementById('playerScore').textContent = playerScore;
        resetBall();
    }
}

// Update game state
function update() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    updateAI();
    handleCollisions();
}

// Draw game objects
function draw() {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(0, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(canvas.width - PADDLE_WIDTH, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.fillRect(ballX - BALL_SIZE/2, ballY - BALL_SIZE/2, BALL_SIZE, BALL_SIZE);
}

// Game loop
function gameLoop() {
    update();
    draw();
    window.requestAnimationFrame(gameLoop);
}

// Start the game when the page loads
window.onload = init;
