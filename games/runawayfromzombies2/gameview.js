
var thestage;
var theimg;
var mapblocks = new Array(TOTAL);
var thegame;
var player;
var zombies = new Array(NUMZOMBIE);
var gamestatus = 0;
var playerpowerbar;
var messagelabel;

function drawShape(shape,img,xsize,ysize) { 
    
    // var shape = new createjs.Shape();
    // thestage.addChild(shape);
    
    shape.graphics.clear()
        .beginBitmapFill(img,"no-repeat")//, "repeat", matrix)
        .drawRect(0,0,xsize,ysize);

    thestage.update();
}

function blockcolor(x,y){
    var value = thegame.getblock(x,y);
    if(x == WIDTH && y == HGIHT){
        return "#afff85";
    }
    if(value == PATH){
        return "white";
    }
    if(value == WALL){
        return "gray";
    }

}
function blockborder(x,y){
    var value = thegame.getblock(x,y);
    if(value == PATH){
        return true;
    }
    if(value == WALL){
        return false;
    }
}

function updatemap(){
    var x,y;
    for(y=1;y<=HGIHT;y++){
        for(x=1;x<=WIDTH;x++){
            mapblocks[calind(x,y)].graphics.clear();
            mapblocks[calind(x,y)].graphics.beginFill(blockcolor(x,y)).drawRect(calpix(x,y)[0],calpix(x,y)[1],BLOCKSIZE,BLOCKSIZE);
            if(blockborder(x,y)){
                mapblocks[calind(x,y)].graphics.beginStroke("#000000");
            }
        }
    }
}

function moveObjTo(obj, x, y){
    obj.x = x;
    obj.y = y;
}

function keyPressed(event) {
    // console.log(event.which);
    switch(event.keyCode) {
        case KEYUP:	
            thegame.player.move[UP] = true;
            break;
        case KEYDOWN: 
            thegame.player.move[DOWN] = true;
            break;
        case KEYLEFT: 
            thegame.player.move[LEFT] = true;
            break;
        case KEYRIGHT: 
            thegame.player.move[RIGHT] = true;
            break;
        case KEYSHIFT:	
            thegame.player.slow = true;
            thegame.player.run = false;
            break;
        case KEYSPACE:
            thegame.player.run = true;
            thegame.player.slow = false;
            break;
    }
}
function keyReleased(event) {
    switch(event.keyCode) {
        case KEYUP:	
            thegame.player.move[UP] = false;
            break;
        case KEYDOWN: 
            thegame.player.move[DOWN] = false;
            break;
        case KEYLEFT: 
            thegame.player.move[LEFT] = false;
            break;
        case KEYRIGHT: 
            thegame.player.move[RIGHT] = false;
            break;
        case KEYSHIFT:	
            thegame.player.slow = false;
            break;
        case KEYSPACE:
            thegame.player.run = false;
            break;
    }
}

function frameupdate(){
    if(gamestatus == 2){
        // console.log("frameupdate")
        thegame.update();
        // console.log("gameupdate")
        var i=0;
        moveObjTo(player,thegame.player.px,thegame.player.py);
        // console.log("playerupdate")
        for(;i<NUMZOMBIE;i++){
            moveObjTo(zombies[i],thegame.zombies[i].px,thegame.zombies[i].py);
        }
        playerpowerbar.graphics.clear().beginFill("blue").drawRect(INFOBASEX+100,INFOBASEY+12,(120/PLAYER_POWER_FULL)*thegame.player.power,10);
        // console.log("zombieupdate")
        messagelabel.text = thegame.message;
        
    }
}

function setupinfobox(){
    var playerpowerbarlabel = new createjs.Text("Your power:","15px Arial", "#000000");
    playerpowerbarlabel.x = INFOBASEX+10;
    playerpowerbarlabel.y = INFOBASEY+10;
    thestage.addChild(playerpowerbarlabel);

    playerpowerbar = new createjs.Shape();
    thestage.addChild(playerpowerbar);

    messagelabel = new createjs.Text(thegame.message,"15px Arial", "#000000");
    messagelabel.x = INFOBASEX+10;
    messagelabel.y = INFOBASEY+30;
    thestage.addChild(messagelabel);
}

function init(){
    // Setup the page
    var stage = new createjs.Stage("myCanvas");
    thestage = stage

    // Setup the Game
    var onegame = new Game();
    thegame = onegame;

    var title = new createjs.Text("Runaway from Zombies!","30px Arial", "Red");
    title.x = BASEX;title.y=BASEY-140;
    stage.addChild(title);

    var instra = new createjs.Text("You needs to reach the safty exit (green block) to escape!\nHowever, there are many zombies moving around!\nControl: 'W' up, 'S' down, 'A' left, 'D' right, 'Shift' slow walk, 'Space' run","20px Arial", "black");
    instra.x = BASEX;instra.y=BASEY-100;
    stage.addChild(instra);

    // Setup the page border
    var background = new createjs.Shape();
    background.graphics.beginStroke("red").drawRect(0,0,1200,900);
    stage.addChild(background);

    // Setup the info box
    var infobox = new createjs.Shape();
    infobox.graphics.beginStroke("red").drawRect(INFOBASEX,INFOBASEY,6*BLOCKSIZE,(HGIHT-2)*BLOCKSIZE);
    stage.addChild(infobox);

    setupinfobox();

    // Setup the map border
    var mapborder = new createjs.Shape();
    mapborder.graphics.beginStroke("black").drawRect(BASEX,BASEY,WIDTH*BLOCKSIZE,HGIHT*BLOCKSIZE);    
    stage.addChild(mapborder);    

    // Add map blocks to the page
    for(y=1;y<=HGIHT;y++){
        for(x=1;x<=WIDTH;x++){
            mapblocks[calind(x,y)] = new createjs.Shape();
            stage.addChild(mapblocks[calind(x,y)]);
        }
    }

    updatemap();

    // Add X Y axil to the map, will delete later
    for(y=1;y<13;y++){
        var temp = new createjs.Text(y.toString(),"20px Arial", "#000000");
        temp.x = BASEX-25;
        temp.y = BASEY+(y-1)*BLOCKSIZE;
        stage.addChild(temp);
    }
    for(x=1;x<13;x++){
        var temp = new createjs.Text(x.toString(),"20px Arial", "#000000");
        temp.y = BASEY-25;
        temp.x = BASEX+(x-1)*BLOCKSIZE;
        stage.addChild(temp);
    }

    // Add player to the map
    player = new createjs.Shape();
    var playerimg = new Image();
    playerimg.onload = function (){
        drawShape(player,playerimg,HEROW,HEROL);
        gamestatus+=1;
    }
    playerimg.src = "../assests/hero.png"
    moveObjTo(player, thegame.player.px, thegame.player.py);
    stage.addChild(player);

    // Add zombies to the map
    var zombieimg = new Image();
    zombieimg.onload = function (){
        var i=0;
        for(;i<NUMZOMBIE;i++){
            zombies[i] = new createjs.Shape();
            drawShape(zombies[i],zombieimg,ZOMBIEW,ZOMBIEL);
            moveObjTo(zombies[i], thegame.zombies[i].px, thegame.zombies[i].py);
            stage.addChild(zombies[i]);
        }
        gamestatus+=1;
    }
    zombieimg.src = "../assests/zombie.png"

    createjs.Ticker.addEventListener("tick", stage);
    createjs.Ticker.addEventListener("tick", frameupdate);
    createjs.Ticker.setFPS(30);

    this.document.onkeydown = keyPressed;		
	this.document.onkeyup = keyReleased;
}