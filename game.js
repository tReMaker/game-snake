const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const gridSize = 20;
const tileCount = canvas.width / gridSize;
const BONUS_DURATION = 15000; // 15 seconds
const BONUS_SPAWN_CHANCE = 0.2; // 20%
const ANTI_BONUS_CHANCE = 0.1; // 10% шанс антибонуса
const STONE_COLOR = '#8B4513'; // коричневый цвет камня
const ANTI_BONUS_COLOR = '#FFA500'; // оранжевый цвет антибонуса

// Загрузка спрайта яблока
const appleImage = new Image();
appleImage.src = 'sprite/apple.png';

// Загрузка спрайта лимона
const lemonImage = new Image();
lemonImage.src = 'sprite/lemon.png';

let score = 0;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let bonus = null; // { x, y, spawnTime }
let stones = []; // массив для хранения камней
let antiBonus = null; // { x, y, spawnTime } или null
let dx = 0;
let dy = 0;
let gameInterval;
let bonusTimeoutInterval;
let antiBonusTimeoutInterval;
let speed = 100;
let isPaused = false;
let isGameOver = false;

function initGame() {
    isGameOver = false;
    isPaused = false;
    score = 0;
    snake = [{ x: 10, y: 10 }];
    dx = 1;
    dy = 0;
    scoreElement.textContent = 'Счет: ' + score;
    spawnFood();
    bonus = null;
    stones = [];
    antiBonus = null;

    if (gameInterval) clearInterval(gameInterval);
    if (bonusTimeoutInterval) clearInterval(bonusTimeoutInterval);
    if (antiBonusTimeoutInterval) clearInterval(antiBonusTimeoutInterval);

    gameInterval = setInterval(gameLoop, speed);
    bonusTimeoutInterval = setInterval(checkBonusTimeout, 100);
    antiBonusTimeoutInterval = setInterval(checkAntiBonusTimeout, 100);
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };

    for (let part of snake) {
        if (part.x === food.x && part.y === food.y) {
            spawnFood();
            break;
        }
    }
}

function spawnBonus() {
    if (bonus !== null) return;

    bonus = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
        spawnTime: Date.now()
    };

    for (let part of snake) {
        if (part.x === bonus.x && part.y === bonus.y) {
            spawnBonus();
            break;
        }
    }
}

function spawnAntiBonus() {
    if (antiBonus !== null) return;

    antiBonus = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
        spawnTime: Date.now()
    };

    // Проверяем, не попал ли антибонус в змейку
    for (let part of snake) {
        if (part.x === antiBonus.x && part.y === antiBonus.y) {
            spawnAntiBonus();
            return;
        }
    }

    // Проверяем, не попал ли в камень
    for (let stone of stones) {
        if (stone.x === antiBonus.x && stone.y === antiBonus.y) {
            spawnAntiBonus();
            return;
        }
    }

    // Проверяем, не попал ли в еду
    if (antiBonus.x === food.x && antiBonus.y === food.y) {
        spawnAntiBonus();
        return;
    }
}

function spawnStone(x, y) {
    stones.push({ x, y });
}

function checkAntiBonusTimeout() {
    if (antiBonus !== null && Date.now() - antiBonus.spawnTime >= BONUS_DURATION) {
        spawnStone(antiBonus.x, antiBonus.y);
        antiBonus = null;
    }
}

function checkBonusTimeout() {
    if (bonus !== null && Date.now() - bonus.spawnTime >= BONUS_DURATION) {
        bonus = null;
    }
}

function gameLoop() {
    if (isGameOver) return;

    if (isPaused) {
        drawPause();
        return;
    }

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        resetGame();
        return;
    }

    for (let part of snake) {
        if (head.x === part.x && head.y === part.y) {
            resetGame();
            return;
        }
    }

    // Проверка столкновения с камнями
    for (let stone of stones) {
        if (head.x === stone.x && head.y === stone.y) {
            resetGame();
            return;
        }
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreElement.textContent = 'Счет: ' + score;
        spawnFood();

        if (Math.random() < BONUS_SPAWN_CHANCE) {
            spawnBonus();
        }
        if (Math.random() < ANTI_BONUS_CHANCE) {
            spawnAntiBonus();
        }
    } else if (antiBonus !== null && head.x === antiBonus.x && head.y === antiBonus.y) {
        antiBonus = null;
    } else if (bonus !== null && head.x === bonus.x && head.y === bonus.y) {
        // Вычисляем ценность на основе времени (1-9)
        const timeAlive = Date.now() - bonus.spawnTime;
        const value = Math.min(9, Math.max(1, Math.floor(timeAlive / (BONUS_DURATION / 9))));

        // Удаляем голову + value сегментов (змейка уменьшается)
        const segmentsToRemove = Math.min(snake.length - 1, value + 1);
        for (let i = 0; i < segmentsToRemove; i++) {
            snake.pop();
        }

        bonus = null;
    } else {
        snake.pop();
    }

    draw();
}

function drawPause() {
    draw();

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Пауза', canvas.width / 2, canvas.height / 2);
}

function draw() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем камни
    ctx.fillStyle = STONE_COLOR;
    for (let stone of stones) {
        ctx.fillRect(stone.x * gridSize, stone.y * gridSize, gridSize - 2, gridSize - 2);
    }

    // Рисуем антибонус
    if (antiBonus !== null) {
        ctx.fillStyle = ANTI_BONUS_COLOR;
        ctx.fillRect(antiBonus.x * gridSize, antiBonus.y * gridSize, gridSize - 2, gridSize - 2);
    }

    // Рисуем бонус (лимон)
    if (bonus !== null) {
        // Масштабируем лимон до размера клетки (20x20)
        ctx.drawImage(lemonImage, bonus.x * gridSize, bonus.y * gridSize, gridSize, gridSize);

        // Рисуем ценность поверх лимона
        const timeAlive = Date.now() - bonus.spawnTime;
        const value = Math.min(9, Math.max(1, Math.floor(timeAlive / (BONUS_DURATION / 9))));
        ctx.fillStyle = '#00f';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(value, bonus.x * gridSize + gridSize / 2, bonus.y * gridSize + gridSize / 2);
    }

    ctx.drawImage(appleImage, food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Рисуем голову змейки светло-зеленым цветом
    ctx.fillStyle = '#0f0';
    ctx.fillRect(snake[0].x * gridSize, snake[0].y * gridSize, gridSize - 2, gridSize - 2);

    // Рисуем тело змейки темно-зеленым цветом
    ctx.fillStyle = '#006600';
    for (let i = 1; i < snake.length; i++) {
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize - 2, gridSize - 2);
    }
}

function resetGame() {
    isGameOver = true;
    clearInterval(gameInterval);
    if (bonusTimeoutInterval) clearInterval(bonusTimeoutInterval);
    if (antiBonusTimeoutInterval) clearInterval(antiBonusTimeoutInterval);
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Игра окончена!', canvas.width / 2, canvas.height / 2 - 15);
    ctx.font = '20px Arial';
    ctx.fillText('Нажмите пробел для рестарта', canvas.width / 2, canvas.height / 2 + 20);
}

document.addEventListener('keydown', (e) => {
    // Если игра окончена - только пробел
    if (isGameOver) {
        if (e.key === ' ') {
            initGame();
        }
        return;
    }

    switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
        case 'ц':
        case 'Ц':
            if (dy === 0) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
        case 's':
        case 'S':
        case 'ы':
        case 'Ы':
            if (dy === 0) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
        case 'ф':
        case 'Ф':
            if (dx === 0) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
        case 'd':
        case 'D':
        case 'в':
        case 'В':
            if (dx === 0) { dx = 1; dy = 0; }
            break;
        case ' ':
            if (isPaused) {
                // Продолжить игру
                isPaused = false;
            } else {
                // Поставить на паузу
                isPaused = true;
            }
            break;
    }
});

initGame();