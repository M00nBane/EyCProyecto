import { GameManager } from './gameManager.js';
import { InputManager } from './inputManager.js';
import { gameLoop } from './gameLoop.js';

export let lives = 5;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const game = new GameManager(canvas, ctx);
new InputManager(game.player, game);

// Botones UI
const startButton = document.getElementById('startButton');
const retryButton = document.getElementById('retryButton');
const restartButton = document.getElementById('restartButton');
const continueButton = document.getElementById('continueButton');
const mainMenu = document.getElementById('mainMenu');
const gameScreen = document.getElementById('gameScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const congratsScreen = document.getElementById('congratsScreen');
const levelUpScreen = document.getElementById('levelUpScreen');

startButton.addEventListener('click', () => {
    mainMenu.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    startGame();
    game.reset();
    gameLoop(game, ctx, canvas);
});

retryButton.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    startGame();
    game.reset();
    gameLoop(game, ctx, canvas);
});

restartButton.addEventListener('click', () => {
    congratsScreen.classList.add('hidden');
    mainMenu.classList.remove('hidden');
});

continueButton.addEventListener('click', () => {
    levelUpScreen.classList.add('hidden');
    gameLoop(game, ctx, canvas);
});

export function actualizarVidas() {
    const livesContainer = document.getElementById('lives');
    livesContainer.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const heart = document.createElement('img');
        heart.src = 'heart.png'; // asegúrate de tener esta imagen en la misma carpeta
        heart.alt = '❤️';
        heart.style.width = '24px';
        heart.style.height = '24px';
        heart.style.marginRight = '4px';
        livesContainer.appendChild(heart);
    }
}

export function recibirDanio() {
    if (lives > 0) {
        lives--;
        actualizarVidas();
    }
    if (lives <= 0) {
        terminarJuego();
    }
}

function terminarJuego() {
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    document.getElementById('finalScore').textContent = game.score || 0;
}

export function startGame() {
    lives = 5;
    actualizarVidas();
}
