// Canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;


let startTime;
let elapsedTime = 0;
let timerInterval;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Helvetica';

// Mouse Interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
  // x: canvas.width/2,
  x: 0,
  y: canvas.height/2,
  click: false
}
canvas.addEventListener('mousedown', function(event){
  mouse.click = true;
  mouse.x = event.x - canvasPosition.left;
  mouse.y = event.y - canvasPosition.top;
});
canvas.addEventListener('mouseup', function() {
  mouse.click = false;
})
// Player
const playerLeft = new Image();
playerLeft.src = '__cartoon_fish_06_blue_swim.png'; // Find the perfect character facing left for game
const playerRight = new Image();
playerRight.src = '__cartoon_fish_06_blue_swim.png'; // Find the perfect character facing right for game

class Player {
  constructor() {
    this.x = canvas.width;
    this.y = canvas.height/2;
    this.radius = 50;
    this.angle = 60;
    this.frameX = 0;
    this.frameY = 0;
    this.frame = 0;
    this.spriteWidth = 498;
    this.spriteHeight = 327;
  }
  update() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    let theta = Math.atan2(dy, dx);
    this.angle = theta;
    if (mouse.x != this.x) {
      this.x -= dx/20;
    }
    if(mouse.y != this.y) {
      this.y -= dy/20;
    }
  }
  draw() {
    if (mouse.click) {
      ctx.lineWidth = 0.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(mouse.x, mouse.y);
      ctx.stroke();
    }
    ctx.fillStyle = 'transparent'; // was red
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.fillRect(this.x, this.y, this.radius, 10);

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle)
    if (this.x >= mouse.x) {
      ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth/4, this.spriteHeight/4);
    } else {
      ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45, this.spriteWidth/4, this.spriteHeight/4);
    }
    ctx.restore();
  }
}
const player = new Player();
// Bubbles
const bubblesArray = [];
class Bubble {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 100;
    this.radius = 50;
    this.speed = Math.random() * 5 + 1;
    this.distance;
    this.counted = false;
    this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
  }
  update() {
    this.y -= this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx*dx + dy*dy);
  }
  draw() {
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
  }
}

const bubblePop1 = document.createElement('audio');
bubblePop1.src = 'pop.ogg';
const bubblePop2 = document.createElement('audio');
bubblePop2.src = 'shimmer_1.flac';

function handleBubbles() {
  if (gameFrame % 50 == 0) {
    bubblesArray.push(new Bubble());
  }
  for (let i = 0; i < bubblesArray.length; i++) {
    bubblesArray[i].update();
    bubblesArray[i].draw();
  }
  for (let i = 0; i < bubblesArray.length; i++) {
    if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2) {
      bubblesArray.splice(i, 1);
    }
    if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius) {
      if (!bubblesArray[i].counted) {
        if(!bubblesArray[i].sound == 'sound1'){
          bubblePop1.play();
        } else {
          bubblePop2.play();
        }
        score++;
        bubblesArray[i].counted = true;
        bubblesArray.splice(i, 1);
      }

    }
  }
}

// Animation Loop
function animate() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  handleBubbles();
  player.update();
  player.draw();
  ctx.fillStyle = 'white';
  ctx.fillText('score: ' + score, 10, 50);
  gameFrame++;
  requestAnimationFrame(animate);
}
animate();

// Update timer display
function updateTimer() {
  const timerElement = document.getElementById("timer");
  const seconds = Math.floor(elapsedTime / 1000);
  timerElement.textContent = "Time: " + seconds;
}