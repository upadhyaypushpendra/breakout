let canvas = document.getElementById("myCanvas");
canvas.setAttribute('width', window.innerWidth);
canvas.setAttribute('height', window.innerHeight);


let context = canvas.getContext("2d");

let canvasWidth = canvas.width;
let canvasHeight = canvas.height;

let gameSounds = new Sound();
let isSoundLoaded = false;
const margin = 5;
let score =0;
let lives = 3;
let isStarted = false;
let isPaused = true;
let gameIntervalId;
// Ball Information
let ballX = canvasWidth / 2 ;
let ballY = canvasHeight - 30 ;
let ballDX = 2;
let ballDY = -2;
const ballColors =["red","green","blue","yellow","magenta","#34eb86","#34ebdb","#3d34eb"];
let ballFillStyle = 2 ;
const ballRadius = Math.max(canvasWidth/150,8);

// Paddle Information
const paddleHeight = 15;
const paddleWidth = ballRadius*15;
let paddleDX = 3;
let paddleX = (canvasWidth - paddleWidth) / 2;
let paddleY = (canvasHeight - paddleHeight-5);
const paddleColors =["red","green","blue","yellow","magenta","#34eb86","#34ebdb","#3d34eb"];
let paddleFillStyle = 0 ;

let leftPressed = false;
let rightPressed = false;

// Brick Information
const brickRowCount = 5;
const brickColumnCount = Math.floor(canvasWidth/100);
const brickOffset = canvasWidth/(2*brickColumnCount);
const brickPadding = 10;
const brickHeight = canvasHeight/20;
const brickWidth = ((canvasWidth-(2*brickOffset))/brickColumnCount)-brickPadding;
const brickOffsetTop = 100;
const brickColors=[
    "linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(0,0,0,1) 0%, rgba(9,9,121,1) 21%, rgba(66,66,175,1) 38%, rgba(66,66,175,1) 58%, rgba(9,9,119,1) 78%, rgba(0,0,0,1) 100%)",
    "linear-gradient(180deg, rgba(2,0,36,1) 0%, rgba(0,0,0,1) 0%, rgba(121,9,9,1) 21%, rgba(175,66,66,1) 38%, rgba(175,66,66,1) 58%, rgba(119,9,9,1) 78%, rgba(0,0,0,1) 100%)"
];
let brickColor = 1;
// Creating Bricks

let bricks = [];
const createBricks = () =>{
for(let c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(let r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0 , status : 1};
    }
}
};

const setup =() =>{
    canvas.setAttribute('width', window.innerWidth);
    canvas.setAttribute('height', window.innerHeight);
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
    drawGame();
};

// Drawing boundary
function redraw() {
    context.strokeStyle = 'black';
    context.fillStyle = "black";
    context.fillRect(0,0,canvasWidth,canvasHeight);
    //context.lineWidth = 10;
    //context.strokeRect(0, 0, window.innerWidth, window.innerHeight);
}

// Draw Ball
const drawBall=()=>{
    context.beginPath();
    context.arc(ballX,ballY,ballRadius,0,Math.PI*2);

    let gradient = context.createRadialGradient(ballX,ballY,ballRadius-1,ballX,ballY,1);
    gradient.addColorStop(0, ballColors[ballFillStyle%ballColors.length]);
    gradient.addColorStop(0.95, "white");

    //context.fillStyle=ballColors[ballFillStyle%ballColors.length];
    context.fillStyle = gradient;
    context.fill();
    context.closePath();
};

// Draw Paddle
const drawPaddle = () =>{
    context.beginPath();
    context.rect(paddleX,paddleY,paddleWidth,paddleHeight);
    //context.fillStyle = paddleColors[paddleFillStyle%paddleColors.length];
    let gradient = context.createLinearGradient(paddleX,paddleY,paddleX,paddleY+paddleHeight);

    gradient.addColorStop(0, paddleColors[paddleFillStyle%paddleColors.length]);
    gradient.addColorStop(0.5, "white");
    gradient.addColorStop(1, paddleColors[paddleFillStyle%paddleColors.length]);
    context.fillStyle = gradient;
    context.fill();
    context.closePath();
};

// Draw Bricks
const drawBrick = (brickX,brickY)=> {
        context.beginPath();
        let radius = 5;

        context.moveTo(brickX + radius, brickY);
        context.lineTo(brickX + brickWidth - radius, brickY);
        context.quadraticCurveTo(brickX + brickWidth, brickY, brickX + brickWidth, brickY + radius);
        context.lineTo(brickX + brickWidth, brickY + brickHeight - radius);
        context.quadraticCurveTo(brickX + brickWidth, brickY + brickHeight, brickX + brickWidth - radius, brickY + brickHeight);
        context.lineTo(brickX + radius, brickY + brickHeight);
        context.quadraticCurveTo(brickX, brickY + brickHeight, brickX, brickY + brickHeight - radius);
        context.lineTo(brickX, brickY + radius);
        context.quadraticCurveTo(brickX, brickY, brickX + radius, brickY);
        context.closePath();
        let gradient = context.createLinearGradient(brickX,brickY,brickX,brickY+brickHeight);
        gradient.addColorStop(0, "lightgreen");
        gradient.addColorStop(0.1, "green");
        gradient.addColorStop(0.4, "darkgreen");
        gradient.addColorStop(0.6, "darkgreen");
        gradient.addColorStop(0.9, "green");
        gradient.addColorStop(1, "lightgreen");
        context.fillStyle = gradient;
        //context.fillStyle = brickColors[brickColor%brickColors.length];
        context.fill();

    };
const drawBricks = () => {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status === 1) {
                let brickX = (c*(brickWidth+brickPadding))+brickOffset;
                let brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                b.x = brickX;
                b.y = brickY;
                drawBrick(brickX,brickY);
            }
        }
    }
}

// Draw Game Info
const drawGameInfo = () => {
    context.font = "max(3vw,3vh) Arial bold";
    context.fillStyle = "#0095DD";
    context.textAlign = "left";
    context.fillText(`Score: ${score}`, canvasWidth*(1/4), 50);
    context.textAlign = "right";
    context.fillText(`Lives : ${lives}`,canvasWidth*(3/4) , 50);
}
// Draw Welcome Screen
const drawWelcomeScreen = () => {
    context.clearRect(0,0,canvasWidth,canvasHeight);
    context.beginPath();
    context.fillStyle = "black";
    context.fillRect(0,0,canvasWidth,canvasHeight);
    context.fillStyle = "green";
    context.font = "max(8vw,8vh) Arial bold";
    context.textAlign = "center";
    context.fillText("BREAKOUT",(canvasWidth/2),200);
    context.font = "max(2vw,2vh) Arial bold";
    context.textAlign = "center";
    context.fillStyle = "red";
    context.fillText("PRESS SPACE TO START",canvasWidth/2,canvasHeight/2+50);
    context.closePath();
};

// Draw Game Paused
const drawGamePaused = () => {
    context.beginPath();
    context.textAlign = "center";
    context.font = "max(6vw,6vh) Arial bold";
    context.fillStyle = "#0095DD";
    context.fillText("PAUSED",canvasWidth/2,Math.min(canvasHeight/2,canvasWidth/2));
    context.font = "max(2vw,2vh) Arial bold";
    context.fillStyle = "red";
    context.fillText("PRESS SPACE TO START",canvasWidth/2,Math.min(canvasHeight/2+100,canvasWidth/2+100));
    context.closePath();
};

// Draw Ready State
const drawReadyState = () => {
    removeListeners();
    let countDown= 3;
    let countDownIntervalId = setInterval(()=>{
        redraw();
        drawGameInfo();
        drawBricks();
        drawPaddle();
        drawBall();
        context.beginPath();
        context.textAlign = "center";
        context.font = "max(6vw,6vh) Arial bold";
        context.fillText("READY",canvasWidth/2,Math.min(canvasHeight/2,canvasWidth/2));
        context.font = "max(3vw,3vh) Arial bold";
        context.fillStyle = "red";
        if(countDown===0){        
            context.fillText("START",canvasWidth/2,Math.min(canvasHeight/2+100,canvasWidth/2+100));
           	clearInterval(countDownIntervalId);
        } else {
            context.fillText(`${countDown}`,canvasWidth/2,Math.min(canvasHeight/2+100,canvasWidth/2+100));
        }
        context.closePath();
        --countDown;
    },900);
    let countDownTimeoutId = setTimeout(()=>{
        gameIntervalId = setInterval(drawGame,10);
        addListeners();
    },4000);
};

// Draw Game Over State
const drawGameOverState = () =>{
    removeListeners();
    context.clearRect(0,0,canvasWidth,canvasHeight);
    context.beginPath();
    context.fillStyle = "black";
    context.fillRect(0,0,canvasWidth,canvasHeight);
    context.fillStyle = "green";
    context.font = "max(8vw,8vh) Arial bold";
    context.textAlign = "center";
    context.fillText("GAMEOVER",(canvasWidth/2),200);
    context.font = "max(2vw,2vh) Arial bold";
    context.textAlign = "center";
    context.fillStyle = "red";
    context.fillText("PRESS ANY KEY TO RESTART",canvasWidth/2,canvasHeight/2+50);
    context.closePath();
    document.addEventListener("keydown",restarter=()=>{
        startGame();
        document.removeEventListener("keydown",restarter);
    },false);
};
// Draw game
const drawGame =()=>{
    context.clearRect(0,0,canvasWidth,canvasHeight);
    redraw();
    drawGameInfo();
    drawBricks();
    drawBall();
    drawPaddle();
    collisionDetectionWithBricks();
    collisionDetectionWithPaddle();
    collisionDetectionWithWalls();
    if(rightPressed) {
        paddleX += paddleDX;
        if(paddleX + paddleWidth > canvasWidth){
            paddleX =  canvasWidth - paddleWidth;
        }
    }
    else if(leftPressed) {
        paddleX -= paddleDX;
        if(paddleX < 0 ) {
            paddleX=0;
        }
    }
    ballX += ballDX;
    ballY += ballDY;
};
const loadGameSounds = () => {
    gameSounds.add("wall_hit","sounds/wall_hit.wav");
    gameSounds.add("score","sounds/score.wav");
    gameSounds.add("paddle_hit","sounds/paddle_hit.wav");
    gameSounds.setState(true);
    isSoundLoaded = true;
};
const startGame = () => {
    if(!isSoundLoaded) loadGameSounds();
    isStarted=true;
    isPaused = false;
    gameIntervalId = setInterval(drawGame,10);
};
const toggleGameState = () => {
    isPaused = !isPaused;
    if(isPaused) {
        clearInterval(gameIntervalId);
        drawGamePaused();
    } else {
        gameIntervalId = setInterval(drawGame,10);
    }
};
const keyDownHandler = (e) =>{
    if(!isPaused) {
        if (e.key === "Right" || e.key === "ArrowRight") {
            if (paddleDX === 0) paddleDX = 6;
            paddleDX += 0.2;
            if (paddleDX >= 8) paddleDX = 6;
            rightPressed = true;
        } else if (e.key === "Left" || e.key === "ArrowLeft") {
            if (paddleDX === 0) paddleDX = 6;
            paddleDX += 0.2;
            if (paddleDX >= 8) paddleDX = 6;
            leftPressed = true;
        }
    }
    if(e.code === "Space") {
        if(isStarted) {
            toggleGameState();
        } else {
            startGame();
        }

    }
};

const keyUpHandler = (e) =>{
        if(!isPaused) {
            if(e.key === "Right" || e.key === "ArrowRight") {
                paddleDX = 0;
                rightPressed = false;
            } else if(e.key === "Left" || e.key === "ArrowLeft") {
                paddleDX = 0;
                leftPressed = false;
            }
        }
};
const mouseMoveHandler = (e) =>{
    if(!isPaused) {
        let relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }
};
const isBallCollideWithBrick = (brick) =>{
      return (ballX +ballRadius > brick.x && ballX - ballRadius < brick.x+brickWidth && ballY + ballRadius > brick.y && ballY - ballRadius < brick.y + brickHeight);
};
const collisionDetectionWithBricks = () => {
    for(let c=0; c<brickColumnCount; c++) {
        for(let r=0; r<brickRowCount; r++) {
            let b = bricks[c][r];
            if(b.status === 1 && isBallCollideWithBrick(b)) {
                gameSounds.play("score");
                if( (ballX > b.x && ballX > b.x+brickWidth) || (ballX < b.x+brickWidth && ballX < b.x) ) ballDX = -ballDX;
                if( (ballY > b.y && ballY > b.y+brickHeight) || (ballY < b.y+brickHeight && ballY < b.y) ) ballDY = -ballDY;
                b.status = 0;
                score++;
                if(score === brickColumnCount*brickRowCount){
                    alert("YOU WIN");
                    document.location.reload();
                    clearInterval(gameIntervalId);
                }
            }
        }
    }
}
const collisionDetectionWithPaddle = () => {
    if(ballX+ballRadius > paddleX && ballX-ballRadius < paddleX + paddleWidth && ballY+ballRadius > paddleY ){
        gameSounds.play("paddle_hit");
        let halfPaddle = paddleWidth/2;
        let paddleMid = paddleX + halfPaddle;
        if(ballDX < 0) {
            if(leftPressed) {
                ballDX -= Math.abs((paddleMid-ballX)/halfPaddle)+1;
            } else if(rightPressed) {
                ballDX += Math.abs((paddleMid-ballX)/halfPaddle)+1 ;
            } else {}
        } else if(ballDX > 0) {
            if(leftPressed) {
                ballDX -= Math.abs((ballX-paddleMid)/halfPaddle)+1;
            } else if(rightPressed) {
                ballDX += Math.abs((ballX-paddleMid)/halfPaddle)+1;
            } else {}
        } else ballDX +=Math.floor(Math.random()*4-2);
        ballDY = -ballDY;
        ballY -=1;
        return true;
    } else {
        return false;
    }
};
const collisionDetectionWithWalls = () =>{
    if(ballY+ballDY < ballRadius){
        ballDY=-ballDY;
        gameSounds.play("wall_hit");
    }
    if( ballY+ballDY > canvas.height-ballRadius) {
        if(!collisionDetectionWithPaddle()){
            --lives;
            if(!lives) {
                //alert("Game Over");
                clearInterval(gameIntervalId);
                drawGameOverState();
            } else {
                ballX = canvas.width/2;
                ballY = canvas.height-30;
                paddleX = (canvasWidth-paddleWidth) / 2;
                ballDX = 2;
                ballDY = -2;
                clearInterval(gameIntervalId);
                drawReadyState();
            }
        }
    }
    if(ballX+ballDX < ballRadius || ballX+ballDX > canvas.width-ballRadius) {
        ballDX=-ballDX;
        gameSounds.play("wall_hit");
    }
};
const addListeners = () => {
    document.addEventListener("keydown",keyDownHandler,false);
    document.addEventListener("keyup",keyUpHandler,false);
    document.addEventListener("mousemove",mouseMoveHandler,false);

};
const removeListeners = () => {
    document.removeEventListener("keydown",keyDownHandler);
    document.removeEventListener("keyup",keyUpHandler);
    document.removeEventListener("mousemove",mouseMoveHandler);
};
window.onresize = setup;
drawWelcomeScreen();
addListeners();
