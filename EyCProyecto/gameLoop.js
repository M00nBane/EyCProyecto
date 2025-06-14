import { FallingObject } from './fallingObject.js';
import { Explosion } from './explosion.js';
import { PowerUp } from './powerUp.js';

const explosionSound = new Audio('sound/explosion.mp3');
const hitSound = new Audio('sound/hit.mp3');
const invincibleSound = new Audio('sound/invincible.mp3');
invincibleSound.loop = true;

const backgroundImage = new Image();
backgroundImage.src = 'img/background.jpg';

export function gameLoop(game, ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    game.player.update(canvas);

    if (game.isInvincible && Math.floor(game.invincibilityTimer / 5) % 2 === 0) {
        ctx.globalAlpha = 0.4;
    }
    game.player.draw(ctx);
    ctx.globalAlpha = 1.0;

    if (Math.random() < 1 / game.spawnRate) {
        game.fallingObjects.push(new FallingObject(canvas.width));
    }

    if (Math.random() < 1 / 600) {
        game.powerUps.push(new PowerUp(canvas.width));
    }

    for (let i = game.powerUps.length - 1; i >= 0; i--) {
        const power = game.powerUps[i];
        power.update(game.objectSpeed);
        power.draw(ctx);

        if (game.checkCollision(game.player, power)) {
            game.enableInvincibility();
            invincibleSound.currentTime = 0;
            invincibleSound.play();
            game.powerUps.splice(i, 1);
        } else if (power.y > canvas.height) {
            game.powerUps.splice(i, 1);
        }
    }

    for (let i = game.bullets.length - 1; i >= 0; i--) {
        const bullet = game.bullets[i];
        bullet.update();
        bullet.draw(ctx);

        if (bullet.y < 0) {
            game.bullets.splice(i, 1);
            continue;
        }

        for (let j = game.fallingObjects.length - 1; j >= 0; j--) {
            const rock = game.fallingObjects[j];
            if (game.checkCollision(bullet, rock)) {
                game.explosions.push(new Explosion(rock.x, rock.y));
                explosionSound.play();
                game.fallingObjects.splice(j, 1);
                game.bullets.splice(i, 1);
                game.updateScore();
                break;
            }
        }
    }

    for (let i = game.fallingObjects.length - 1; i >= 0; i--) {
        const obj = game.fallingObjects[i];
        obj.update(game.objectSpeed);
        obj.draw(ctx);

        if (!game.isInvincible && game.checkCollision(game.player, obj)) {
            game.lives--;
            document.getElementById('lives').textContent = game.lives;
            hitSound.play();
            game.fallingObjects.splice(i, 1);
            if (game.lives === 0) {
                game.explosions.push(new Explosion(game.player.x, game.player.y));
                document.getElementById('finalScore').textContent = game.score;
                gameScreen.classList.add('hidden');
                gameOverScreen.classList.remove('hidden');
                return;
            }
        }

        if (obj.y > canvas.height) {
            game.fallingObjects.splice(i, 1);
        }
    }

    for (let i = game.explosions.length - 1; i >= 0; i--) {
        const explosion = game.explosions[i];
        explosion.update();
        explosion.draw(ctx);
        if (explosion.timer <= 0) {
            game.explosions.splice(i, 1);
        }
    }

    if (game.isInvincible) {
        game.invincibilityTimer--;
        if (game.invincibilityTimer <= 0) {
            game.isInvincible = false;
            invincibleSound.pause();
            invincibleSound.currentTime = 0;
        }
    }

    window.currentAnimation = requestAnimationFrame(() => gameLoop(game, ctx, canvas));
}
