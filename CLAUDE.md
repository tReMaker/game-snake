# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a classic Snake game built with vanilla HTML, CSS, and JavaScript. The game is contained entirely in `index.html` and runs in a web browser.

## Features

- **Red food**: Increases snake length and score
- **Blue bonus**: Appears with 20% chance when eating food, reduces snake length by 1 if eaten
- Bonus disappears after 15 seconds if not eaten
- **Оранжевый квадрат (антибонус)** появляется с ~10% вероятностью при съедании красной еды
- Через 15 секунд антибонус исчезает и на его месте появляется коричневый камень
- **Камень** - препятствие: при столкновении с ним змейки Game Over
- Если съесть **оранжевый антибонус** до превращения в **камень** - он просто исчезает, змейка не растет

## Architecture

The game uses a simple canvas-based rendering system with:
- A 20x20 grid on a 400x400 canvas
- Snake movement controlled by keyboard input (arrow keys or WASD + Russian keyboard support)
- Score tracking displayed on the page
- Game loop running at 100ms intervals

## Key Components

- `gameLoop()`: Main game logic - moves snake, checks collisions, handles food and bonus
- `draw()`: Renders the game state to the canvas
- `spawnFood()`: Generates random food position not on the snake
- `spawnBonus()`: Generates blue bonus that reduces snake length (20% chance on eating food)
- `checkBonusTimeout()`: Removes bonus after 15 seconds if uneaten
- `resetGame()`: Handles game over state with "Press space to restart"
- `spawnAntiBonus()`: генерирует оранжевый антибонус с проверкой, чтобы он не попал в змейку, камень или еду
- `spawnStone(x, y)`: добавляет камень в массив
- `checkAntiBonusTimeout()` проверяет 15 секунд и превращает антибонус в камень

## Running the Game

Open `index.html` in a web browser. No build tools or dependencies are required.

## Controls

- Arrow keys or WASD (including Russian layout: ц,ы,ф,в) to move
- Spacebar to restart after game over