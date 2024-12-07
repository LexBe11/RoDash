let currentLevel = '';
let gamePaused = false;

const levels = {
    easy1: { speed: 3, obstacles: 5, difficulty: 'easy' },
    easy2: { speed: 4, obstacles: 7, difficulty: 'easy' },
    normal1: { speed: 5, obstacles: 10, difficulty: 'normal' },
    hard1: { speed: 6, obstacles: 15, difficulty: 'hard' },
    insane: { speed: 7, obstacles: 20, difficulty: 'insane' },
};

let player = { x: 50, y: 350, width: 50, height: 50, jump: false, velocity: 0, type: 'normal' };
let obstacles = [];
let score = 0;
let safeBlocks = [];
let canvas, ctx;

function startGame(level) {
    currentLevel = level;
    document.querySelector('.menu').style.display = 'none';
    document.querySelector('.game').style.display = 'block';
    initializeGame(level);
}

function initializeGame(level) {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = 400;

    player = { x: 50, y: 350, width: 50, height: 50, jump: false, velocity: 0, type: 'normal' };
    obstacles = [];
    score = 0;
    safeBlocks = [];

    // Reset canvas on each start
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update player position
        if (player.jump) {
            player.velocity = -8; // Apply jump force
        } else {
            player.velocity += 0.5; // gravity (controlled for smooth landing)
        }

        player.y += player.velocity;
        if (player.y > 350) { // Prevent the player from going below the floor
            player.y = 350;
            player.velocity = 0;
        }

        // Draw player based on type (normal, rocket, ninjaStar)
        ctx.fillStyle = getPlayerColor(player.type);
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Draw obstacles (spikes)
        obstacles.forEach((obstacle, index) => {
            obstacle.x -= levels[currentLevel].speed;
            if (obstacle.x + obstacle.width < 0) {
                obstacles.splice(index, 1);
                score++;
            }
            drawSpike(obstacle); // Draw different types of spikes
        });

        // Draw safe blocks
        safeBlocks.forEach(safeBlock => {
            ctx.fillStyle = '#0f0';
            ctx.fillRect(safeBlock.x, safeBlock.y, safeBlock.width, safeBlock.height);
        });

        // Check for collision
        obstacles.forEach(obstacle => {
            if (player.x < obstacle.x + obstacle.width && player.x + player.width > obstacle.x &&
                player.y < obstacle.y + obstacle.height && player.y + player.height > obstacle.y) {
                gameOver();
            }
        });

        // Display score
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 20, 30);
    }

    function drawSpike(obstacle) {
        switch (obstacle.type) {
            case 'floor':
                ctx.beginPath();
                ctx.moveTo(obstacle.x, obstacle.y);
                ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y - obstacle.height);
                ctx.lineTo(obstacle.x + obstacle.width, obstacle.y);
                ctx.closePath();
                ctx.fillStyle = '#f00';
                ctx.fill();
                break;
            case 'sky':
                ctx.beginPath();
                ctx.moveTo(obstacle.x, obstacle.y);
                ctx.lineTo(obstacle.x + obstacle.width / 2, obstacle.y + obstacle.height);
                ctx.lineTo(obstacle.x + obstacle.width, obstacle.y);
                ctx.closePath();
                ctx.fillStyle = '#f00';
                ctx.fill();
                break;
            case 'vertical':
                ctx.fillStyle = '#f00';
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                break;
            case 'horizontal':
                ctx.fillStyle = '#f00';
                ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
                break;
        }
    }

    function jump() {
        if (player.y === 350) {
            player.jump = true;
            player.velocity = -8; // Force for the jump
        }
    }

    function gameOver() {
        alert('Game Over');
        document.querySelector('.menu').style.display = 'block';
        document.querySelector('.game').style.display = 'none';
    }

    // Generate random spikes and safe blocks
    function generateObstacles() {
        if (Math.random() < 0.02) {
            let type = ['floor', 'sky', 'vertical', 'horizontal'][Math.floor(Math.random() * 4)];
            let width = 30 + Math.random() * 50;
            let height = 20 + Math.random() * 30;
            let x = canvas.width;
            let y = Math.random() * (canvas.height - 50);
            obstacles.push({ x, y, width, height, type });
        }

        if (Math.random() < 0.02) {
            let width = 50 + Math.random() * 50;
            let height = 20;
            let x = canvas.width;
            let y = Math.random() * (canvas.height - 50);
            safeBlocks.push({ x, y, width, height });
        }
    }

    // Update the game
    function update() {
        draw();
        generateObstacles();
        if (!gamePaused) {
            requestAnimationFrame(update);
        }
    }

    update();
}

function pauseGame() {
    gamePaused = !gamePaused;
    if (!gamePaused) {
        update();
    }
}

function getPlayerColor(type) {
    switch (type) {
        case 'normal':
            return '#ff0'; // Normal block
        case 'rocket':
            return '#0ff'; // Rocket block
        case 'ninjaStar':
            return '#f0f'; // Ninja Star block
        default:
            return '#ff0'; // Default to yellow
    }
}

// Listen for user input (space bar or arrow keys)
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'ArrowUp') {
        jump();
    }
});

