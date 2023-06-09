// Game Constants & Variables
let inputDir = {x: 0, y: 0}; 
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
musicSound.currentTime = 11;
let speed = 4.5;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    {x: 13, y: 15}
];

food = {x: 10, y: 10};

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if((ctime - lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If you bump into yourself 
    for (let i = 1; i < snakeArr.length; i++) {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    // If you bump into the wall
    if(snake[0].x >= 30 || snake[0].x <=0 || snake[0].y >= 30 || snake[0].y <=0 ){
        return true;
    }
        
    return false;
}

function gameEngine(){
    // Part 1: Updating the snake array & Food
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        inputDir = { x: 0, y: 0 };
        alert("what a loser dubmass");
        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        speed = 4.5;
        // Pause the music if it is playing
        if (!musicSound.paused) {
          musicSound.pause();
        }
        else
        {
            musicSound.play();
        }
        // Reset the music to the beginning
        musicSound.currentTime = 11;
        // Play the music if the toggle button is in the "on" state
        if (!musicButton.classList.contains("off")) {
          musicSound.play();
        }
      }

    // If you have eaten the food, increment the score and regenerate the food
    if(snakeArr[0].y === food.y && snakeArr[0].x ===food.x){
        foodSound.play();
        score += 1;
        speed+=0.5;
        if(score>hiscore){
            hiscore = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscore));
            hiscore.innerHTML = "HiScore: " + hiscore;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
        let a = 1;
        let b = 29;
        food = {x: Math.round(a + (b-a)* Math.random()), y: Math.round(a + (b-a)* Math.random())}
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i>=0; i--) { 
        snakeArr[i+1] = {...snakeArr[i]};
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and Food
    // Display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index)=>{
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if(index === 0){
            snakeElement.classList.add('head');
        }
        else{
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });
    // Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food')
    board.appendChild(foodElement);
}

// Sound off button
const musicButton = document.getElementById("musicButton");
musicButton.addEventListener("click", toggleMusic);

function toggleMusic() {
    if (musicSound.paused) {
      musicSound.play();
      musicButton.classList.remove("off");
    } else {
      musicSound.pause();
      musicButton.classList.add("off");
    }
  }
  

// Main logic starts here

let hiscore = localStorage.getItem("hiscore");
if(hiscore === null){
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else{
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscore;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', handleKeyPress);

function handleKeyPress(e) {
    switch (e.key) {
        case 'ArrowUp':
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case 'ArrowDown':
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case 'ArrowLeft':
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case 'ArrowRight':
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
}
let touchStartX = 0;
let touchStartY = 0;

window.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

window.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    // Determine the primary direction of the swipe
    if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 0) {
            // Swipe right
            inputDir.x = 1;
            inputDir.y = 0;
        } else {
            // Swipe left
            inputDir.x = -1;
            inputDir.y = 0;
        }
    } else {
        // Vertical swipe
        if (dy > 0) {
            // Swipe down
            inputDir.x = 0;
            inputDir.y = 1;
        } else {
            // Swipe up
            inputDir.x = 0;
            inputDir.y = -1;
        }
    }
});
