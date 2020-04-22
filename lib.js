let game = {
    lib: {},
    ctx: null,
    audio: null,
    interval: null,
    resources: {
        loaded: 0,
        total: 4,
        sounds: {
            bullet: './sources/bullet.mp3',
            explosion: './sources/explosion.mp3'
        },
        images: {
            plane: './sources/plane.png',
            explosion: './sources/explosion.png'
        },
    },
    data: {
        frame: 0,
        plane: null,
        particles: [],
        keydowns: {
            left: false,
            top: false,
            right: false,
            bottom: false,
            space: false,
        }
    },
}

game.lib.BulletSystem = class {
    constructor() {
        this.bullets = [];
    }

    update() {
        // if (this.bullets.length === 0)
        if (game.data.frame % 20 == 0)
            this.bullets.push(new game.lib.Bullet());

        for (let i = 0; i < this.bullets.length; i++) {
            let die = this.bullets[i].update();
            if (die) {
                this.bullets.splice(i, 1);
                i--;
            }
        }
    }

    render() {
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].render();
        }
    }
}

game.lib.Bullet = class {
    constructor() {
        let type = Math.floor(Math.random() * 4);
        this.r = 5;

        if (type === 0) { // top
            this.x = Math.floor(Math.random() * (game.ctx.canvas.width + 1));
            this.y = 0;
            // if (this.x > game.data.plane.x) { // left top 

            // } else { // right top

            // }
        } else if (type === 1) { // bottom
            this.x = Math.floor(Math.random() * (game.ctx.canvas.width + 1));
            this.y = game.ctx.canvas.height;
            // if (this.x > game.data.plane.x) { // left bottom 

            // } else { // right bottom 

            // }
        } else if (type === 2) { // left
            this.x = 0;
            this.y = Math.floor(Math.random() * (game.ctx.canvas.height + 1));
            // if (this.y < game.data.plane.y) { // left top

            // } else { // left bottom

            // }
        } else if (type === 3) { // right
            this.x = game.ctx.canvas.width;
            this.y = Math.floor(Math.random() * (game.ctx.canvas.height + 1));
            // if (this.y < game.data.plane.y) { // right top

            // } else { // right bottom

            // }
        }

        let dx = game.data.plane.x - this.x;
        let dy = game.data.plane.y - this.y;

        this.vx = dx / 100;
        this.vy = dy / 100;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        return this.x < 0 || this.x > game.ctx.canvas.width || this.y < 0 || this.y > game.ctx.canvas.height;
    }

    render() {
        game.ctx.save();
        game.ctx.beginPath();
        game.ctx.fillStyle = '#fff';
        game.ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        game.ctx.fill();
        game.ctx.restore();
    }
}

game.lib.Plane = class {
    constructor() {
        this.image = game.resources.images.plane;
        this.width = 20;
        this.height = 20;
        this.speed = 2;

        this.x = game.ctx.canvas.width / 2;
        this.y = game.ctx.canvas.height / 2;

        this.angle = 0;
    }

    update() {
        let speed = this.speed;
        if (game.data.keydowns.space)
            speed *= 2;

        if (game.data.keydowns.left) {
            game.data.plane.x += -speed;
            this.angle = -90;
        }
        if (game.data.keydowns.top) {
            game.data.plane.y += -speed;
            this.angle = 0;
        }
        if (game.data.keydowns.right) {
            game.data.plane.x += speed;
            this.angle = 90;
        }
        if (game.data.keydowns.bottom) {
            game.data.plane.y += speed;
            this.angle = 180;
        }

        if (this.x >= game.ctx.canvas.width - this.width)
            this.x = game.ctx.canvas.width - this.width;

        if (this.x - this.width <= 0)
            this.x = this.width;

        if (this.y - this.height <= 0)
            this.y = this.height;

        if (this.y + this.height >= game.ctx.canvas.height) {
            this.y = game.ctx.canvas.height - this.height;
        }
        return false;
    }

    render() {
        game.ctx.save();
        game.ctx.drawImage(
            game.resources.images.plane,
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
        if (game.data.keydowns.space)
            game.ctx.drawImage(
                game.resources.images.explosion,
                this.x - this.width / 4,
                this.y + this.height / 2,
                this.width / 2,
                this.height / 2
            );

        game.ctx.restore();
    }
}
