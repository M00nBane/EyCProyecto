export class PowerUp {
    constructor(canvasWidth) {
        this.x = Math.random() * (canvasWidth - 24);
        this.y = 0;
        this.width = 24;
        this.height = 24;
        this.image = new Image();
        this.image.src = 'img/power.png';
    }

    update(speed) {
        this.y += speed;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}
