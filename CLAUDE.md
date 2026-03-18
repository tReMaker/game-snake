# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a classic Snake game built with vanilla HTML, CSS, and JavaScript. The game is contained entirely in `index.html` and runs in a web browser.

## Features

- **Red food**: Increases snake length and score

- **Blue bonus**: Appears with 20% chance when eating food
- Bonus disappears after 15 seconds if not eaten
- Ценность бонуса: вычисляется от 1 до 9 в зависимости от времени, проведенного бонусом на экране
- Формула: value = floor(timeAlive / (15000 / 9)), ограниченная min=1, max=9
- Ценность отображается белым текстом внутри синего квадрата

- **Оранжевый квадрат (антибонус)** появляется с ~10% вероятностью при съедании красной еды
- Через 15 секунд антибонус исчезает и на его месте появляется коричневый камень
- **Камень** - препятствие: при столкновении с ним змейки Game Over
- Если съесть **оранжевый антибонус** до превращения в **камень** - он просто исчезает, змейка не растет

- Ограничение змейки: используется Math.min(snake.length - 1, value), чтобы змейка не стала меньше 1 клетки

## Architecture

The game uses a simple canvas-based rendering system with:
- A 20x20 grid on a 400x400 canvas
- Snake movement controlled by keyboard input (arrow keys or WASD + Russian keyboard support)
- Score tracking displayed on the page
- Game loop running at 100ms intervals
- Separate interval for bonus/anti-bonus timeout checks (100ms)

### File Structure
- `index.html`: Main HTML file with canvas, score display, and controls hint
- `style.css`: Minimal CSS for centering and basic styling
- `game.js`: All game logic, rendering, and event handling

## Key Components

- `gameLoop()`: Main game logic - moves snake, checks collisions, handles food and bonus
- `draw()`: Renders the game state to the canvas
- `drawPause()`: Renders pause overlay with "Пауза" text (calls draw() first)
- `spawnFood()`: Generates random food position not on the snake
- `spawnBonus()`: Generates blue bonus with spawn timestamp (20% chance on eating food)
- `checkBonusTimeout()`: Removes bonus after 15 seconds if uneaten
- `resetGame()`: Handles game over state with "Press space to restart"
- `spawnAntiBonus()`: Generates orange anti-bonus with checks to avoid snake, stones, or food
- `spawnStone(x, y)`: Adds a stone to the stones array
- `checkAntiBonusTimeout()`: Checks 15 seconds and converts anti-bonus to stone

## State Management

- `isPaused`: Boolean flag to control pause state (prevents game logic execution when true)
- Game loop returns early if `isPaused` is true or movement vectors are zero

## Running the Game

Open `index.html` in a web browser. No build tools or dependencies are required.

## Current Features (as of latest update)
- White text drawn inside the blue bonus square
- **Pause**: Press spacebar during gameplay to pause (shows "Пауза" overlay)
- **Resume**: Press spacebar again to continue from pause
- **Restart**: Press spacebar at Game Over to restart

## Controls

- Arrow keys or WASD (including Russian layout: ц,ы,ф,в) to move
- Spacebar: pause/resume during game, or restart after Game Over