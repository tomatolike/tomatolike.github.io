
var thestage;
var theimg;
var mapblocks = new Array(TOTAL);
var thegame;
var player;
var zombies = new Array(NUMZOMBIE);
var gamestatus = 0;
var playerpowerbar;
var messagelabel;
var playerimgs = new Array(12);
var zombieimgs = new Array(12);
var test;

function drawShape(shape,img,xsize,ysize) { 
    
    // var shape = new createjs.Shape();
    // thestage.addChild(shape);
    
    shape.graphics.clear().beginBitmapFill(img,"no-repeat").drawRect(0,0,xsize,ysize);

    thestage.update();
}

function blockcolor(x,y){
    var value = thegame.getblock(x,y);
    if(x == WIDTH && y == HGIHT){
        return "#afff85";
    }
    if(value == PATH){
        return "gray";
    }
    if(value == WALL){
        return "black";
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

function updatemap(ppx,ppy){
    var x,y;
    var pbxy = pixtoblock(ppx,ppy);
    for(y=1;y<=HGIHT;y++){
        for(x=1;x<=WIDTH;x++){
            mapblocks[calind(x,y)].graphics.clear();
            if(inseenrange(pbxy[0],pbxy[1],x,y)){
                // console.log("show block",x,y);
                mapblocks[calind(x,y)].graphics.beginFill(blockcolor(x,y)).drawRect(calpix(x,y)[0],calpix(x,y)[1],BLOCKSIZE,BLOCKSIZE);
                if(blockborder(x,y)){
                    mapblocks[calind(x,y)].graphics.beginStroke("#000000");
                }
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
            // test.graphics.clear().beginBitmapFill(playerimgs[0],"no-repeat").drawRect(0,0,40,40);
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

function getplayerimg(status){
    return playerimgs[status];
}

function getzombieimg(status){
    return zombieimgs[status];
}

function frameupdate(){
    var i,ok;
    if(gamestatus == 0){
        ok = 1;
        for(i=0;i<12;i++){
            if(!(playerimgs[i].complete && playerimgs[i].naturalHeight != 0)){
                ok=0;
                break;
            }
        }
        for(i=0;i<12;i++){
            if(!(zombieimgs[i].complete && zombieimgs[i].naturalHeight != 0)){
                ok=0;
                break;
            }
        }
        if(ok==1){
            gamestatus = 1;
        }
    }
    if(gamestatus == 1){
        thegame.update();
        updatemap(thegame.player.px,thegame.player.py);
        if(thegame.player.status()){
            player.graphics.clear().beginBitmapFill(getplayerimg(thegame.player.laststatus),"no-repeat").drawRect(0,0,HEROW,HEROL);
            moveObjTo(player,thegame.player.px,thegame.player.py);
        }else{
            moveObjTo(player,thegame.player.px,thegame.player.py);
        }
        for(i=0;i<NUMZOMBIE;i++){
            var pbxy = pixtoblock(thegame.player.px,thegame.player.py);
            var zbxy = pixtoblock(thegame.zombies[i].px,thegame.zombies[i].py);
            if(thegame.zombies[i].status()){
                zombies[i].graphics.clear();
                if(inseenrange(pbxy[0],pbxy[1],zbxy[0],zbxy[1])){
                    zombies[i].graphics.beginBitmapFill(getzombieimg(thegame.zombies[i].laststatus),"no-repeat").drawRect(0,0,ZOMBIEW,ZOMBIEL);
                }
                moveObjTo(zombies[i],thegame.zombies[i].px,thegame.zombies[i].py);
            }else{
                moveObjTo(zombies[i],thegame.zombies[i].px,thegame.zombies[i].py);
                if(!inseenrange(pbxy[0],pbxy[1],zbxy[0],zbxy[1])){
                    zombies[i].graphics.clear();
                }
            }
        }
        playerpowerbar.graphics.clear().beginFill("blue").drawRect(INFOBASEX+100,INFOBASEY+62,(120/PLAYER_POWER_FULL)*thegame.player.power,10);
        messagelabel.text = thegame.message;
        if(thegame.status != ONGOING){
            gamestatus = 2;
        }
    }
}

function restart_game(){
    gamestatus = 0;
    delete thegame;
    thegame = new Game();
}

function setupinfobox(){
    var playerpowerbarlabel = new createjs.Text("Your power:","15px Arial", "red");
    playerpowerbarlabel.x = INFOBASEX+10;
    playerpowerbarlabel.y = INFOBASEY+60;
    thestage.addChild(playerpowerbarlabel);

    playerpowerbar = new createjs.Shape();
    thestage.addChild(playerpowerbar);

    messagelabel = new createjs.Text(thegame.message,"15px Arial", "red");
    messagelabel.x = INFOBASEX+10;
    messagelabel.y = INFOBASEY+80;
    thestage.addChild(messagelabel);

    var newbutton = new Button("REstart",80,40,restart_game);
    newbutton.button.x = INFOBASEX+10;
    newbutton.button.y = INFOBASEY+10;
    thestage.addChild(newbutton.button);
}

function loadplayerimgs(){
    playerimgs[UP_STAY]="../assests/hero_up_stay.png";
    playerimgs[UP_WALK_1]="../assests/hero_up_walk_1.png";
    playerimgs[UP_WALK_2]="../assests/hero_up_walk_2.png";
    playerimgs[DOWN_STAY]="../assests/hero_down_stay.png";
    playerimgs[DOWN_WALK_1]="../assests/hero_down_walk_1.png";
    playerimgs[DOWN_WALK_2]="../assests/hero_down_walk_2.png";
    playerimgs[LEFT_STAY]="../assests/hero_left_stay.png";
    playerimgs[LEFT_WALK_1]="../assests/hero_left_walk_1.png";
    playerimgs[LEFT_WALK_2]="../assests/hero_left_walk_2.png";
    playerimgs[RIGHT_STAY]="../assests/hero_right_stay.png";
    playerimgs[RIGHT_WALK_1]="../assests/hero_right_walk_1.png";
    playerimgs[RIGHT_WALK_2]="../assests/hero_right_walk_2.png";
    var i=0;
    for(;i<12;i++){
        var temp = new Image();
        temp.onload = function(){
        }
        temp.src = playerimgs[i];
        playerimgs[i] = temp;
    }
}

function loadzombieimgs(){
    zombieimgs[UP_STAY]="../assests/hero_up_stay.png";
    zombieimgs[UP_WALK_1]="../assests/hero_up_walk_1.png";
    zombieimgs[UP_WALK_2]="../assests/hero_up_walk_2.png";
    zombieimgs[DOWN_STAY]="../assests/hero_down_stay.png";
    zombieimgs[DOWN_WALK_1]="../assests/hero_down_walk_1.png";
    zombieimgs[DOWN_WALK_2]="../assests/hero_down_walk_2.png";
    zombieimgs[LEFT_STAY]="../assests/hero_left_stay.png";
    zombieimgs[LEFT_WALK_1]="../assests/hero_left_walk_1.png";
    zombieimgs[LEFT_WALK_2]="../assests/hero_left_walk_2.png";
    zombieimgs[RIGHT_STAY]="../assests/hero_right_stay.png";
    zombieimgs[RIGHT_WALK_1]="../assests/hero_right_walk_1.png";
    zombieimgs[RIGHT_WALK_2]="../assests/hero_right_walk_2.png";
    var i=0;
    for(;i<12;i++){
        var temp = new Image();
        temp.onload = function(){
        }
        temp.src = zombieimgs[i];
        zombieimgs[i] = temp;
    }
}

function init(){
    // Setup the page
    var stage = new createjs.Stage("myCanvas");
    thestage = stage

    // Setup the Game
    var onegame = new Game();
    thegame = onegame;

    // Setup the page border
    var background = new createjs.Shape();
    background.graphics.beginStroke("#302e2e").beginFill("#302e2e").drawRect(0,0,1200,900);
    stage.addChild(background);

    // Setup the info box
    var infobox = new createjs.Shape();
    infobox.graphics.beginStroke("red").beginFill("#424242").drawRect(INFOBASEX,INFOBASEY,300,(HGIHT-2)*BLOCKSIZE);
    stage.addChild(infobox);

    var title = new createjs.Text("Runaway from Zombies!","30px Arial", "red");
    title.x = BASEX;title.y=BASEY-140;
    stage.addChild(title);

    var instra = new createjs.Text("You needs to reach the safty exit (green block) to escape!\nHowever, there are many zombies moving around!\nControl: 'W' up, 'S' down, 'A' left, 'D' right, 'Shift' slow walk, 'Space' run","20px Arial", "red");
    instra.x = BASEX;instra.y=BASEY-100;
    stage.addChild(instra);

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
    stage.addChild(player);

    test = new createjs.Shape();
    stage.addChild(test);

    loadplayerimgs();

    // Add zombies to the map
    var i=0;
    for(;i<NUMZOMBIE;i++){
        zombies[i] = new createjs.Shape();
        stage.addChild(zombies[i]);
    }
    // zombies[0] = new createjs.Shape();
    // stage.addChild(zombies[0]);

    loadzombieimgs();

    createjs.Ticker.addEventListener("tick", stage);
    createjs.Ticker.addEventListener("tick", frameupdate);
    createjs.Ticker.setFPS(30);

    this.document.onkeydown = keyPressed;		
	this.document.onkeyup = keyReleased;
}