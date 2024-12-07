let currentLevel = '';
let gameInterval;
let gamePaused = false;

const levels = {
    easy1: { speed: 2, obstacles: 5, difficulty: 'easy' },
    easy2: { speed: 3, obstacles: 7, difficulty: 'easy' },
    easy3: { speed: 3, obstacles: 8, difficulty: 'easy' },
    easy4: { speed: 4, obstacles: 6, difficulty: 'easy' },
    easy5: { speed: 5, obstacles: 10, difficulty: 'easy' },
    normal1: { speed: 4, obstacles: 12, difficulty: 'normal' },
    normal2: { speed: 5, obstacles: 15, difficulty: 'normal' },
    normal3: { speed: 6, obstacles: 18, difficulty: 'normal' },
    hard1: { speed: 6, obstacles: 25, difficulty: 'hard' },
    hard2: { speed: 7, obstacles: 30, difficulty: 'hard' },
    insane: { speed: 8, obstacles: 40, difficulty: 'insane' }
};

let player = { x: 50, y: 350, width: 50, height: 50, jump: false, velocity: 0, type: 'normal' };
let obstacles = [];
let safeBlocks = [];
let score = 0;

function startGame(level) {
    currentLevel = level;
    document.querySelector('.menu').style.display = 'none';
    document.querySelector('.game').style.display = 'block';
    initializeGame(level);
}

function initializeGame(level) {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = 400;

    player = { x: 50, y: 350, width: 50, height: 50, jump: false, velocity: 0, type: 'normal' };
    obstacles = [];
    safeBlocks = [];
    score = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update player position
        if (player.jump) {
            player.velocity = -10;
        } else {
            player.velocity += 0.5; // gravity
        }

        player.y += player.velocity;
        if (player.y > 350) {
            player.y = 350;
            player.velocity = 0;
        }

        // Draw player based on type
        ctx.fillStyle = getPlayerColor(player.type);
        ctx.fillRect(player.x, player.y, player.width, player.height);

        // Draw obstacles (spikes)
        obstacles.forEach((obstacle, index) => {
            obstacle.x -= levels[currentLevel].speed;
            if (obstacle.x + obstacle.width < 0) {
                obstacles.splice(index, 1);
                score++;
            }
            ctx.fillStyle = '#f00';
            ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });

        // Draw safe blocks
        safeBlocks.forEach((safeBlock) => {
            ctx.fillStyle = '#0f0';
            ctx.fillRect(safeBlock.x, safeBlock.y, safeBlock.width, safeBlock.height);
        });

        // Detect collisions with spikes
        obstacles.forEach(obstacle => {
            if (player.x < obstacle.x + obstacle.width && player.x + player.width > obstacle.x &&
                player.y < obstacle.y + obstacle.height && player.y + player.height > obstacle.y) {
                gameOver();
            }
        });

        // Detect landing on safe blocks
        safeBlocks.forEach(safeBlock => {
            if (player.x < safeBlock.x + safeBlock.width && player.x + player.width > safeBlock.x &&
                player.y < safeBlock.y + safeBlock.height && player.y + player.height > safeBlock.y) {
                player.jump = false;
                player.velocity = 0;
            }
        });

        // Add new obstacles and safe blocks
        if (Math.random() < 0.02) {
            obstacles.push({
                x: canvas.width,
                y: Math.random() * (canvas.height - 100),
                width: 50 + Math.random() * 50,
                height: 10 + Math.random() * 30
            });
        }

        if (Math.random() < 0.02) {
            safeBlocks.push({
                x: canvas.width,
                y: Math.random() * (canvas.height - 50),
                width: 50 + Math.random() * 50,
                height: 20
            });
        }

        // Display score
        ctx.fillStyle = '#fff';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 20, 30);
    }

    function jump() {
        if (player.y === 350) {
            player.jump = true;
            player.velocity = -10;
        }
    }

    function gameOver() {
        alert('Game Over');
        document.querySelector('.menu').style.display = 'block';
        document.querySelector('.game').style.display = 'none';
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'ArrowUp') {
            jump();
        }
    });

    function update() {
        draw();
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
            return '#ff0';  // Yellow block for normal
        case 'rocket':
            return '#0ff';  // Cyan for rocketship
        case 'ninjaStar':
            return '#f0f';  // Purple for ninja star
        default:
            return '#ff0';  // Default to yellow
    }
}
