const WIDTH = 12;//x
const HGIHT = 12;//y
const TOTAL = WIDTH*HGIHT;
const ZOMBIE = 2;
const HERO = 1;

const BASEX = 100;
const BASEY = 150;
const BLOCKSIZE = 60;
const HEROW = 20;
const HEROL = 40;
const ZOMBIEW = 20;
const ZOMBIEL = 40;

const INFOBASEX = BASEX+WIDTH*BLOCKSIZE+20;
const INFOBASEY = BASEY;

const OUTMAP = 10;
const PATH = 0;
const WALL = 1;

const NUMZOMBIE = 1;

const KEYUP = 87;
const KEYDOWN = 83;
const KEYLEFT = 65;
const KEYRIGHT = 68;
const KEYSHIFT = 16;
const KEYSPACE = 32;

const PLAYER_LOW_SPEED = 2;
const PLAYER_NORMAL_SPEED = 4;
const PLAYER_HIGH_SPEED = 6;
const ZOMBIE_LOW_SPEED = 1;
const ZOMBIE_MIDDLE_SPEED = 3;
const ZOMBIE_HIGH_SPEED = 5;

const STAY_COUNTER = 300;
const LOW_COUNTER = 15;
const NORMAL_COUNTER = 8;
const HIGH_COUNTER = 4;

const PLAYER_POWER_FULL = 100;
const PLAYER_POWER_LOST = 4;
const PLAYER_POWER_RECOVER = 1;

const ZOMBIE_POWER_FULL = 100;
const ZOMBIE_POWER_LOST = 4;
const ZOMBIE_POWER_RECOVER = 1;

const RIGHT = 0;
const DOWN = 1;
const LEFT = 2;
const UP = 3;
const RIGHTUP = 4;
const RIGHTDOWN = 6;
const LEFTDOWN = 10;
const LEFTUP = 16;
const NODIRE = -1;

const HEARRANGE = 2;

const PLAYERWIN = 1;
const ZOMBIEWIN = 2;
const ONGOING = 0;

const DOWN_STAY = 0;
const DOWN_WALK_1 = 1;
const DOWN_WALK_2 = 2;
const RIGHT_STAY = 3;
const RIGHT_WALK_1 = 4;
const RIGHT_WALK_2 = 5;
const LEFT_STAY = 6;
const LEFT_WALK_1 = 7;
const LEFT_WALK_2 = 8;
const UP_STAY = 9;
const UP_WALK_1 = 10;
const UP_WALK_2 = 11;

function outmap(x,y){
    if(x<1 || y<1 || x>WIDTH || y > HGIHT){
        return true;
    }
}

function calind(x,y){
    return (y-1)*WIDTH + x - 1;
}

function direrange(x,y,d,r){
    if(d==RIGHT){
        return [x+r,y];
    }
    if(d==DOWN){
        return [x,y+r];
    }
    if(d==LEFT){
        return [x-r,y];
    }
    if(d==UP){
        return [x,y-r];
    }
}

function dire(x,y,d){
    if(d==RIGHT){
        return [x+1,y];
    }
    if(d==DOWN){
        return [x,y+1];
    }
    if(d==LEFT){
        return [x-1,y];
    }
    if(d==UP){
        return [x,y-1];
    }
    if(d==RIGHTUP){ // (3+2)*0 + 4
        return [x+1,y-1];
    }
    if(d==RIGHTDOWN){ // (0+2)*1 + 4
        return [x+1,y+1];
    }
    if(d==LEFTDOWN){ // (1+2)*2 + 4
        return [x-1,y+1];
    }
    if(d==LEFTUP){ // (2+2)*3 + 4
        return [x-1,y-1];
    }
}

function calpix(x,y){
    return [BASEX+(x-1)*BLOCKSIZE, BASEY+(y-1)*BLOCKSIZE];
}

function printmap(gamemap){
    var x,y,str;
    for(y=1;y<=HGIHT;y++){
        str = "";
        for(x=1;x<=WIDTH;x++){
            // console.log("x ,y",x,y,gamemap[calind(x,y)])
            str += gamemap[calind(x,y)].toString()+" ";
        }
        console.log(str)
    }
}

function outmappx(x,y){
    if(x < BASEX || x > BASEX+WIDTH*BLOCKSIZE || y < BASEY || y > BASEY+HGIHT*BLOCKSIZE){
        return true;
    }
    return false;
}

function overlap(x,y,w,l,x2,y2,w2,l2){
    if( ((x<=x2 && x2<x+w) || (x2<=x && x<x2+w2)) && ((y<=y2 && y2<y+l) || (y2<=y && y<y2+l2)) ){
        return true;
    }
    return false;
}

function cornerdirepx(x,y,d,type){
    if(d==0){
        if(type == ZOMBIE){
            return [x+ZOMBIEW,y];
        }else{
            return [x+HEROW,y];
        }
    }
    if(d==1){
        if(type == ZOMBIE){
            return [x,y+ZOMBIEL];
        }else{
            return [x,y+HEROL];
        }
    }
    if(d==2){
        if(type == ZOMBIE){
            return [x-ZOMBIEW,y];
        }else{
            return [x-HEROW,y];
        }
    }
    if(d==3){
        if(type == ZOMBIE){
            return [x,y-ZOMBIEL];
        }else{
            return [x,y-HEROL];
        }
    }
}

function pixtoblock(x, y){
    var bx = Math.floor((x - BASEX) / BLOCKSIZE)+1;
    var by = Math.floor((y - BASEY) / BLOCKSIZE)+1;
    return [bx,by];
}

function caldire(fromxy, toxy){
    if(fromxy[0] != toxy[0] && fromxy[1] != toxy[1]){
        return NODIRE;
    }
    if(fromxy[0] == toxy[0]){
        if(fromxy[1] <= toxy[1]){
            return DOWN;
        }else{
            return UP;
        }
    }
    if(fromxy[1] == toxy[1]){
        if(fromxy[0] <= toxy[0]){
            return RIGHT;
        }else{
            return LEFT;
        }
    }
    return NODIRE;
}

function inhearrange(fromxy, toxy, dire){
    if(dire == UP || dire == DOWN){
        if(toxy[1] >= fromxy[1] - HEARRANGE && toxy[1] <= fromxy[1] + HEARRANGE){
            return true;
        }
    }else{
        if(toxy[0] >= fromxy[0] - HEARRANGE && toxy[0] <= fromxy[0] + HEARRANGE){
            return true;
        }
    }
    return false;
}

function ifatbk(px,py,x,y){
    var pxy = calpix(x,y);
    if(px == pxy[0] && py == pxy[1]){
        return true;
    }
    return false;
}