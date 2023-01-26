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
        cd.translate(player.position.x + player.width / 2 , player.position.y + player.height / 2)
        
        cd.rotate(this.rotation)
        cd.translate(-player.position.x - player.width / 2 , -player.position.y - player.height / 2)
        
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

class Projectile{
    constructor({position,velocity}){
        this.position = position
        this.velocity = velocity

        this.radius = 3
    }

    draw(){
        cd.beginPath()
        cd.arc()
    }
}

const player = new Player()
const keys = {
    ArrowDown: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
    space: {
        pressed: false
    }
}

function animate() {
    requestAnimationFrame(animate);
    cd.fillStyle = 'black';
    cd.fillRect(0, 0, canvas.width, canvas.height)
    player.update();

    if (keys.ArrowDown.pressed && player.position.x >= 0) {
        player.velocity.x = -5
        player.rotation = -0.15
    }
    else if (keys.ArrowUp.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 5;
        player.rotation = 0.15
    }
    else {
        player.velocity.x = 0
        player.rotation = 0
    }
}

animate();

addEventListener('keydown', ({ key }) => {
    // console.log(key);
    switch (key) {
        case 'ArrowDown':
            console.log('left');
            keys.ArrowDown.pressed = true;
            break;
        case 'ArrowUp':
            console.log('right');
            keys.ArrowUp.pressed = true
            break;
        case ' ':
            console.log('attack');

            break;
    }
})

addEventListener('keyup', ({ key }) => {
    // console.log(key);
    switch (key) {
        case 'ArrowDown':
            console.log('left');
            keys.ArrowDown.pressed = false;
            break;
        case 'ArrowUp':
            console.log('right');
            keys.ArrowUp.pressed = false;
            break;
        case ' ':
            console.log('attack');

            break;
    }
})
