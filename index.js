const canvas = document.querySelector('canvas');

const cd = canvas.getContext('2d');

const finalscore = document.querySelector('#scoreel')
canvas.width = 1024
canvas.height = 576
class Player {
    constructor() {

        this.velocity = {
            x: 0,
            y: 0
        }
        this.rotation = 0;
        this.opacity = 1
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
        cd.globalAlpha = this.opacity
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

        this.radius = 4
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

class InvaderProjectile {
    constructor({ position, velocity }) {
        this.position = position
        this.velocity = velocity
        this.width = 3
        this.height = 10

    }

    draw() {
        cd.fillStyle = 'white'
        cd.fillRect(this.position.x, this.position.y, this.width,
            this.height)
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

    update({ velocity }) {
        if (this.image) {
            this.draw();
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }

    shoot(invaderProjectiles) {
        invaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }))
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
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        this.velocity.y = 0

        if (this.position.x + this.width >= canvas.width ||
            this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 30
        }
    }
}

class Particle {
    constructor({ position, velocity, radius, color, fades }) {
        this.position = position
        this.velocity = velocity

        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }

    draw() {
        cd.save()
        cd.globalAlpha = this.opacity
        cd.beginPath()
        cd.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        cd.fillStyle = this.color
        cd.fill()
        cd.closePath()
        cd.restore()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.fades)
            this.opacity -= 0.01
    }
}

const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles = []
const particles = []

for (let i = 0; i < 100; i++) {
    particles.push(new Particle({
        position: {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        },
        velocity: {
            x: 0,
            y: 0.3
        },
        radius: Math.random() * 2,
        color: 'white'
    })
    )
}


function createparticles({ object, color, fades }) {
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * 3,
            color: color || '#BAA0DE',
            fades
        })
        )
    }
}
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
let games = {
    over : false,
    active : true
}
let score = 0
function animate() {
    if(!games.active)   return
    requestAnimationFrame(animate);
    cd.fillStyle = 'black';
    cd.fillRect(0, 0, canvas.width, canvas.height)
    player.update();
    particles.forEach((particle, i) => {

        if (particle.position.y - particle.radius >= canvas.
            height) {
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }

        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(i, 1)
            }, 0);

        }
        else {
            particle.update()
        }
    })
    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (invaderProjectile.position.y + invaderProjectile.
            height >= canvas.height) {
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
            }, 0)

        }
        else {
            invaderProjectile.update()
        }

        if (invaderProjectile.position.y + invaderProjectile.
            height >= player.position.y && invaderProjectile.position.x +
            invaderProjectile.width >= player.position.x &&
            invaderProjectile.position.x <= player.position.x +
            player.width) {
            console.log('You lose')
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
                player.opacity = 0
                games.over = true
            }, 0)

            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
                player.opacity = 0
                games.active = false
            }, 2000)
            createparticles({
                object: player,
                color: 'white',
                fades: true
            });
        }
    })

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

    grids.forEach((grid, gridindex) => {
        grid.update()
        //spawn projectile
        if (frames % 100 === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.
                length)].shoot(
                    invaderProjectiles)
        }
        grid.invaders.forEach((invader, i) => {
            invader.update({ velocity: grid.velocity })

            //Projectiles hit enemy
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <=
                    invader.position.y + invader.height &&
                    projectile.position.x + projectile.radius >=
                    invader.position.x &&
                    projectile.position.x - projectile.radius <=
                    invader.position.x + invader.width &&
                    projectile.position.y + projectile.radius >= invader.position.y
                ) {


                    setTimeout(() => {
                        const invaderfound = grid.invaders.find(
                            invader2 => invader2 === invader)
                        const projectilefound = projectiles.find(
                            projectile2 => projectile2 === projectile)

                        // Remove invader & projectile here
                        if (invaderfound && projectilefound) {
                            score += 100
                            finalscore.innerHTML = score
                            createparticles({
                                object: invader,
                                fades: true
                            });

                            grid.invaders.splice(i, 1)
                            projectiles.splice(j, 1)

                            if (grid.invaders.length > 0) {
                                const firstInv = grid.invaders[0];
                                const lastInv = grid.invaders[grid.
                                    invaders.length - 1]

                                grid.width = lastInv.position.x -
                                    firstInv.position.x + lastInv.width
                                grid.position.x = firstInv.position.x
                            }
                            else {
                                grids.splice(gridindex, 1)
                            }
                        }

                    }, 0)
                }
            })
        })
    })

    if (keys.ArrowLeft.pressed && player.position.x >= 0) {
        player.velocity.x = -7
        player.rotation = -0.15
    }
    else if (keys.ArrowRight.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 7;
        player.rotation = 0.15
    }
    else {
        player.velocity.x = 0
        player.rotation = 0
    }

    // console.log(frames)
    if (frames % randomint === 0) {
        grids.push(new Grid())
        randomint = Math.floor((Math.random() * 500) + 500)
        frames = 0
    }

    frames++
}

animate();

addEventListener('keydown', ({ key }) => {
    // console.log(key);
    if(games.over)  return
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
