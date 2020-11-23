let canvas = document.getElementById("canvas");
canvas.width = 500;
canvas.height = 500;
let c = canvas.getContext("2d");
c.lineWidth = 2;
c.textAlign = "center";
let board = [
    [0,0,0],
    [0,0,0],
    [0,0,0]
];

function drawO(row,column){
    c.font = "90px Arial"
    c.fillText("o",row*canvas.width/3+canvas.width/6,column*canvas.height/3+canvas.height/6+16);
}
function drawX(row,column){
    c.font = "90px Arial"
    c.fillText("x",row*canvas.width/3+canvas.width/6,column*canvas.height/3+canvas.height/6+16);
}
function drawBoard(){
    for(let i=0;i<board.length;i++){
        for(let j=0;j<board[i].length;j++){
            if(board[i][j]==1){
                drawX(j,i);
            }else if(board[i][j]==2){
                drawO(j,i);
            }
        }
    }
}
function checkWin(matrix){
    let winner = 0;
    let boardt = matrix;
    for(i=0;i<boardt.length;i++){
        if(boardt[i][0]!=0&& boardt[i][0]==boardt[i][1]&& boardt[i][1]==boardt[i][2]&& boardt[i][0]==boardt[i][2]){
            winner = boardt[i][0];
        }else if(boardt[0][i]!=0&& boardt[0][i]==boardt[1][i]&& boardt[1][i]==boardt[2][i]&& boardt[0][i]==boardt[2][i]){
            winner = boardt[0][i];
        }
    }
    if(boardt[0][0]!=0&& boardt[0][0]==boardt[1][1]&& boardt[0][0]==boardt[2][2]&& boardt[1][1]==boardt[2][2]){
        winner = boardt[0][0];
    }else if(boardt[2][0]!=0&& boardt[2][0]==boardt[1][1]&& boardt[2][0]==boardt[0][2]&& boardt[1][1]==boardt[0][2]){
        winner = boardt[2][0];
    } 
    if(winner!=0){
        return winner;
    }else if(numSpotsLeft(boardt)<=0){
        return 3;
    }
}
function background(){
    for(let i=1;i<board.length;i++){
        c.beginPath();
        c.moveTo(0,i*canvas.height/3);
        c.lineTo(canvas.width,i*canvas.height/3)
        c.stroke();
    }
    for(let i=1;i<board.length;i++){
        c.beginPath();
        c.moveTo(i*canvas.width/3,0);
        c.lineTo(i*canvas.width/3,canvas.height);
        c.stroke();
    }
}
function numSpotsLeft(teBoard){
    let testBoard = JSON.parse(JSON.stringify(teBoard));
    let count =0;
    for(let i=0;i<testBoard.length;i++){
        for(j=0;j<testBoard[i].length;j++){
            if(testBoard[i][j]==0) count++;
        }
    }
    return count;
}
function availabeSpots(){

}

let turn = "no";
let turnNum = 1;
//_____________________________________
canvas.addEventListener("mouseup",click);
function click(e){
    let outLoop = false;
    let coordinates = [];
    for(let i=0;i<board.length;i++){
        for(let j=0;j<board[i].length;j++){

            if(e.offsetX<=(j+1)*canvas.width/3 && e.offsetY<=(i+1)*canvas.height/3){
                coordinates = [j,i];
                outLoop = true;
                break;
            }
        }
        if(outLoop){
            break;
        }
    }

    if(turn=="player"){
        if(board[coordinates[1]][coordinates[0]] == 0){
            board[coordinates[1]][coordinates[0]] = 1;
            turnNum++;
            if(numSpotsLeft(board)>0&&checkWin(board)!=1){
                turn = "enemy"
            }
            drawBoard()
            turnNum++;
            console.log(numSpotsLeft(board))
        }
        
    }else if(turn=="enemy"){
        
        
    }
}
//_________________________________________
function enemyTurn(){
    let optimalCoord = [];
    let calculatedScore;
    let bestScore = -Infinity;
    let testBoard = JSON.parse(JSON.stringify(board));
    if(numSpotsLeft(board)==9){
        board[0][0] = 2;
        return;
    }
    for(let i=0;i<board.length;i++){
        for(let j=0;j<board[i].length;j++){
            if(board[i][j]==0){
                testBoard[i][j] = 2;
                calculatedScore = minimax(testBoard, 0, false);
                testBoard[i][j] = 0;

                if(bestScore<calculatedScore){
                    optimalCoord = [j,i];
                    bestScore = calculatedScore;
                }
            }
        }
    }
    console.log(optimalCoord)
    board[optimalCoord[1]][optimalCoord[0]] = 2;
    
}

function minimax(newBoard,depth,isMaximizing){
    if(checkWin(newBoard)==1){//if looses
        return -10;
    }else if(checkWin(newBoard)==2){//if wins
        return 10;
    }else if(checkWin(newBoard)==3){//if tie
        return 0;
    }
    

    if(isMaximizing){//Enemy's imaginary turn
        let bestScore = -Infinity;
        for(let i=0;i<board.length;i++){
            for(let j=0;j<board[i].length;j++){
                if(newBoard[i][j]==0){//for each avalaible spot 
                    newBoard[i][j] = 2;
                    let calculatedScore = minimax(newBoard,depth+1,false);
                    //Choose better possibility;
                    bestScore = Math.max(calculatedScore,bestScore);
                    newBoard[i][j] = 0;
                }

            }
        }
        return bestScore;
    }else{//Player possible outcome
        let bestScore = Infinity;
        for(let i=0;i<board.length;i++){
            for(let j=0;j<board[i].length;j++){
                if(newBoard[i][j]==0){//for each avalaible spot 
                    newBoard[i][j] = 1;
                    let calculatedScore = minimax(newBoard,depth+1,true);
                    //Choose better possibility;
                    bestScore = Math.min(calculatedScore,bestScore);
                    newBoard[i][j] = 0;
                }

            }
        }
        return bestScore;
    }
   
}
//______________________
let gameMode = "menu";
function startGame(first){
    let ee = document.getElementsByClassName("startButton");   
    for(let i=0;i<ee.length;i++){
        ee[i].style.display = "none";
    }

    gameMode = "play";
    turn = first;
}

function draw(){
    requestAnimationFrame(draw);
    c.clearRect(0,0,canvas.width,canvas.height);
    
    background();
    drawBoard();
    if(gameMode=="play"){
        
        if(turn == "enemy"){
            enemyTurn();
            turn = "player";
        }


        if(checkWin(board)==1) {
            turn="over";
            
        }else if(checkWin(board)==2){
            turn="over";
           
        }
        else if(checkWin(board)==3) turn = "over";
       
    }else if(turn = "over"){
        
    }
    
}
draw();