const canvas = document.querySelector('canvas');

const cd = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
class Player {
    constructor() {

        this.velocity = {
            x: 0,
            y: 0
        }
        this.rotation = 0;
        const image = new Image();

        image.src = './img/spaceship.png'
        image.onload = () => {
            const scale = 0.15;
            this.image = image;
            this.width = (image.width * scale);
            this.height = (image.height * scale);
            this.position = {
                x: canvas.width / 2 - this.width,
                y: canvas.height - this.height - 20
            }
        }

    }

    draw() {
        cd.save();
        cd.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)

        cd.rotate(this.rotation)
        cd.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2)

        cd.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);

        cd.restore();

    }

    update() {
        if (this.image) {
            this.draw();
            this.position.x += this.velocity.x
        }
    }

}

class Projectile {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity

        this.radius = 3
    }

    draw() {
        cd.beginPath()
        cd.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        cd.fillStyle = 'red'
        cd.fill()
        cd.closePath()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}


class Invader {
    constructor({ position }) {

        this.velocity = {
            x: 0,
            y: 0
        }

        const image = new Image();

        image.src = './img/invader.png'
        image.onload = () => {
            const scale = 1;
            this.image = image;
            this.width = (image.width * scale);
            this.height = (image.height * scale);
            this.position = {
                x: position.x,
                y: position.y
            }
        }

    }

    draw() {

        cd.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);

    }

    update({velocity}) {
        if (this.image) {
            this.draw();
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }

}

class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 3,
            y: 0
        }
        this.invaders = []
        
        const row = Math.floor(Math.random() * 5 + 2)
        const col = Math.floor(Math.random() * 10 + 5)

        this.width = col * 30
        for (let x = 0; x < col; x++) {

        for (let y = 0; y < row; y++) {
            this.invaders.push(
                new Invader({
                    position: {
                        x: x * 30,
                        y: y * 30
                    }

                }))
        }
    }
        console.log(this.invaders)
    }
    update() { 
        this.position.x +=this.velocity.x
        this.position.y +=this.velocity.y

        this.velocity.y = 0

        if(this.position.x + this.width >= canvas.width ||
            this.position.x <=0){
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }
    }
}

const player = new Player()
const projectiles = []
const grids = []
const keys = {
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

let frames = 0
let randomint = Math.floor((Math.random() * 500) + 500)
function animate() {
    requestAnimationFrame(animate);
    cd.fillStyle = 'black';
    cd.fillRect(0, 0, canvas.width, canvas.height)
    player.update();

    projectiles.forEach((projectile, index) => {

        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)

        }
        else {

            projectile.update()
        }

    })

    grids.forEach((grid) => {
        grid.update()
        grid.invaders.forEach(invader => {
            invader.update({velocity:grid.velocity})
        })
    })

    if (keys.ArrowLeft.pressed && player.position.x >= 0) {
        player.velocity.x = -5
        player.rotation = -0.15
    }
    else if (keys.ArrowRight.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 5;
        player.rotation = 0.15
    }
    else {
        player.velocity.x = 0
        player.rotation = 0
    }

    // console.log(frames)
    if(frames % randomint === 0){
        grids.push(new Grid())
        randomint = Math.floor((Math.random() * 500) + 500)
        frames = 0
    }
    frames ++
}

animate();

addEventListener('keydown', ({ key }) => {
    console.log(key);
    switch (key) {
        case 'ArrowLeft':
            console.log('left');
            keys.ArrowLeft.pressed = true;
            break;
        case 'ArrowRight':
            console.log('right');
            keys.ArrowRight.pressed = true
            break;
        case ' ':
            console.log('attack');

            break;
    }
})

addEventListener('keyup', ({ key }) => {
    // console.log(key);
    switch (key) {
        case 'ArrowLeft':
            console.log('left');
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowRight':
            console.log('right');
            keys.ArrowRight.pressed = false;
            break;
        case ' ':
            console.log('attack');
            projectiles.push(new Projectile({

                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -10
                }
            })
            )
            // console.log(projectiles)
            break;
    }
})
