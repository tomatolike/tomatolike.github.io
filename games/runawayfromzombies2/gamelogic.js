class Zombie {
    constructor(){
        this.px = BASEX;
        this.py = BASEY;
        this.power = ZOMBIE_POWER_FULL;

        this.move = [false,false,false,false]
        this.chasing = false;
        this.aim = [0,0];
        this.laststatus = DOWN_STAY;
        this.speed=0;
        this.lastspeed=0;
        this.statuscounter=STAY_COUNTER;
        this.dire;
        this.lastdire;
    }

    setaim(px, py){
        // console.log("Set aim from",this.px,this.py,"to",px,py);
        var i=0;
        this.aim[0] = px; this.aim[1] = py;
        for(;i<4;i++){
            this.move[i]=false;
        }
        if(px < this.px){
            this.move[LEFT] = true;
        }
        if(px > this.px){
            this.move[RIGHT] = true;
        }
        if(py < this.py){
            this.move[UP] = true;
        }
        if(py > this.py){
            this.move[DOWN] = true;
        }
    }

    ifmoving(){
        var i=0;
        for(;i<4;i++){
            if(this.move[i]){
                return true;
            }
        }
        return false;
    }

    updatedire(){
        var dire=NODIRE;
        if(this.move[UP]){
            if(this.move[RIGHT]){
                dire = RIGHTUP;
            }else if(this.move[LEFT]){
                dire = LEFTUP;
            }else{
                dire = UP;
            }
        }else if(this.move[DOWN]){
            if(this.move[RIGHT]){
                dire = RIGHTDOWN;
            }else if(this.move[LEFT]){
                dire = LEFTDOWN;
            }else{
                dire = DOWN;
            }
        }else if(this.move[RIGHT]){
            dire = RIGHT;
        }else if(this.move[LEFT]){
            dire = LEFT;
        }else{
            dire = NODIRE;
        }
        this.lastdire = this.dire; this.dire = dire;
    }

    status(){
        //if change speed or direct, counter = 0;
        this.updatedire();
        if(this.speed != this.lastspeed || this.dire != this.lastdire){
            this.statuscounter = 0;
        }else{
            this.statuscounter --;
        }

        //if counter == 0, change status
        var newstatus=this.laststatus;
        if(this.statuscounter == 0){
            if(this.speed == 0){
                if(this.lastdire == UP || this.lastdire == RIGHTUP){
                    newstatus = UP_STAY;
                }else if(this.lastdire == RIGHT || this.lastdire == RIGHTDOWN){
                    newstatus = RIGHT_STAY;
                }else if(this.lastdire == DOWN || this.lastdire == LEFTDOWN){
                    newstatus = DOWN_STAY;
                }else if(this.lastdire == LEFT || this.lastdire == LEFTUP){
                    newstatus = LEFT_STAY;
                }else{
                    newstatus = this.laststatus;
                }
                this.statuscounter = STAY_COUNTER;
            }else{
                if(this.speed == ZOMBIE_LOW_SPEED){
                    this.statuscounter = LOW_COUNTER;
                }
                if(this.speed == ZOMBIE_HIGH_SPEED){
                    this.statuscounter = HIGH_COUNTER;
                }
                if(this.speed == ZOMBIE_MIDDLE_SPEED){
                    this.statuscounter = NORMAL_COUNTER;
                }
                if(this.dire == UP || this.dire == RIGHTUP){
                    newstatus = UP_WALK_1;
                }else if(this.dire == RIGHT || this.dire == RIGHTDOWN){
                    newstatus = RIGHT_WALK_1;
                }else if(this.dire == DOWN || this.dire == LEFTDOWN){
                    newstatus = DOWN_WALK_1;
                }else if(this.dire == LEFT || this.dire == LEFTUP){
                    newstatus = LEFT_WALK_1;
                }
                if(newstatus == this.laststatus){
                    newstatus += 1;
                }
            }
            this.laststatus = newstatus;
            return true;
        }else{
            return false;
        }
    }
}

class Player {
    constructor(){
        this.px = BASEX;
        this.py = BASEY;
        this.power = PLAYER_POWER_FULL;

        this.move = [false,false,false,false]
        this.slow = false;
        this.run = false;
        this.laststatus = DOWN_STAY;
        this.speed=0;
        this.lastspeed=0;
        this.statuscounter=STAY_COUNTER;
        this.dire;
        this.lastdire;
    }

    ifmoving(){
        var i=0;
        for(;i<4;i++){
            if(this.move[i]){
                return true;
            }
        }
        return false;
    }

    updatedire(){
        var dire=NODIRE;
        if(this.move[UP]){
            if(this.move[RIGHT]){
                dire = RIGHTUP;
            }else if(this.move[LEFT]){
                dire = LEFTUP;
            }else{
                dire = UP;
            }
        }else if(this.move[DOWN]){
            if(this.move[RIGHT]){
                dire = RIGHTDOWN;
            }else if(this.move[LEFT]){
                dire = LEFTDOWN;
            }else{
                dire = DOWN;
            }
        }else if(this.move[RIGHT]){
            dire = RIGHT;
        }else if(this.move[LEFT]){
            dire = LEFT;
        }else{
            dire = NODIRE;
        }
        this.lastdire = this.dire; this.dire = dire;
    }

    status(){
        //if change speed or direct, counter = 0;
        this.updatedire();
        if(this.speed != this.lastspeed || this.dire != this.lastdire){
            this.statuscounter = 0;
        }else{
            this.statuscounter --;
        }
        
        //if counter == 0, change status
        var newstatus=this.laststatus;
        if(this.statuscounter == 0){
            // console.log(this.speed,this.dire)
            if(this.speed == 0){
                if(this.lastdire == UP || this.lastdire == RIGHTUP){
                    newstatus = UP_STAY;
                }else if(this.lastdire == RIGHT || this.lastdire == RIGHTDOWN){
                    newstatus = RIGHT_STAY;
                }else if(this.lastdire == DOWN || this.lastdire == LEFTDOWN){
                    newstatus = DOWN_STAY;
                }else if(this.lastdire == LEFT || this.lastdire == LEFTUP){
                    newstatus = LEFT_STAY;
                }else{
                    newstatus = this.laststatus;
                }
                this.statuscounter = STAY_COUNTER;
            }else{
                if(this.speed == PLAYER_LOW_SPEED){
                    this.statuscounter = LOW_COUNTER;
                }
                if(this.speed == PLAYER_HIGH_SPEED){
                    this.statuscounter = HIGH_COUNTER;
                }
                if(this.speed == PLAYER_NORMAL_SPEED){
                    this.statuscounter = NORMAL_COUNTER;
                }
                if(this.dire == UP || this.dire == RIGHTUP){
                    newstatus = UP_WALK_1;
                }else if(this.dire == RIGHT || this.dire == RIGHTDOWN){
                    newstatus = RIGHT_WALK_1;
                }else if(this.dire == DOWN || this.dire == LEFTDOWN){
                    newstatus = DOWN_WALK_1;
                }else if(this.dire == LEFT || this.dire == LEFTUP){
                    newstatus = LEFT_WALK_1;
                }
                if(newstatus == this.laststatus){
                    newstatus += 1;
                }
            }
            this.laststatus = newstatus;
            // console.log(this.laststatus);
            return true;
        }else{
            return false;
        }
    }
}

class Game {

    notwall(x,y){
        if(this.gamemap[calind(x,y)] != 1){
            return true;
        }
        return false;
    }

    notfullfourblock(x,y){
        var i=0,nxy,lxy,nlxy;
        for(;i<4;i++){
            lxy = dire(x,y,i);
            nxy = dire(x,y,(i+1)%4);
            nlxy = dire(x,y,(i+2)*((i+1)%4)+4);
            if(!(outmap(lxy[0],lxy[1])||!this.notwall(lxy[0],lxy[1])) && !(outmap(nxy[0],nxy[1])||!this.notwall(nxy[0],nxy[1])) && !(outmap(nlxy[0],nlxy[1])||!this.notwall(nlxy[0],nlxy[1]))){
                return false;
            }
        }
        return true;
    }

    search(x, y){
        
        if(x==WIDTH && y==HGIHT){
            this.gamemap[TOTAL-1] = 0;
            return true;
        }
        this.gamemap[calind(x,y)] = 0;

        var d = Math.floor(Math.random()*4),i;
        var nxy;
        for(i=0;i<4;i++)
        {
            nxy = dire(x,y,d);
            if(!outmap(nxy[0],nxy[1]) && !this.notwall(nxy[0],nxy[1]) && this.notfullfourblock(nxy[0],nxy[1])){
                this.search(nxy[0],nxy[1]);
            }
            d += 1;
            d = d%4;
        }

        this.gamemap[calind(x,y)] = 0;
        return true;
    }

    research(x,y){
        if(this.notwall(x,y)){
            return true;
        }
        var d = Math.floor(Math.random()*4);
        var i;
        var nxy;
        for(i=0;i<4;i++){
            nxy = dire(x,y,d);
            if(!outmap(nxy[0],nxy[1])){
                if(this.research(nxy[0],nxy[1])){
                    this.gamemap[calind(x,y)] = 0;
                    return true;
                }
            }
            d += 1;
            d = d%4;
        }
        return false;
    }

    generatemap(){
        var i;
        for(i=0;i<TOTAL;i++){
            this.gamemap[i] = 1;
        }
        this.gamemap[0] = 0;
        this.search(1,1);
        // this.gamemap[TOTAL-1] = 0;
        this.research(WIDTH,HGIHT);
    }

    moveable(px,py,type){
        var i=0,nxy,bkxy,bkpxy,w,l;
        nxy = [px,py];
        for(;i<4;i++){
            // console.log("corner",nxy[0],nxy[1]);
            if(outmappx(nxy[0],nxy[1])){
                // console.log("out map");
                return false;
            }
            bkxy = pixtoblock(nxy[0], nxy[1]);
            bkpxy = calpix(bkxy[0], bkxy[1]);
            if(type == ZOMBIE){
                w = ZOMBIEW; l = ZOMBIEL;
            }else{
                w = HEROW; l = HEROL;
            }
            if(this.gamemap[calind(bkxy[0],bkxy[1])] == WALL && overlap(px,py,w,l,bkpxy[0],bkpxy[1],BLOCKSIZE,BLOCKSIZE)){
                return false;
            }
            nxy = cornerdirepx(nxy[0],nxy[1],i,type);
        }
        return true;
    }

    intozombies(px, py, ifzombie, index){
        var i=0,w,l;
        for(;i<NUMZOMBIE;i++){
            if(ifzombie && i==index){
                continue;
            }
            if(ifzombie){
                w = ZOMBIEW; l = ZOMBIEL;
            }else{
                w = HEROW; l = HEROL;
            }
            if(overlap(px,py,w,l,this.zombies[i].px,this.zombies[i].py,ZOMBIEW,ZOMBIEL)){
                return true;
            }
        }
        return false;
    }

    intoplayer(px, py){
        if(overlap(px,py,ZOMBIEW,ZOMBIEL,this.player.px,this.player.py,HEROW,HEROL)){
            return true;
        }
        return false;
    }

    intosafetyrange(px, py){
        var zbxy = pixtoblock(px,py);
        if(zbxy[0] <= SAFERANGE && zbxy[1] <= SAFERANGE){
            return true;
        }
        return false;
    }

    inizombiexy(){
        var i;
        for(i=0;i<NUMZOMBIE;i++){
            // console.log("Zombie",i);
            while(true){
                var x = Math.floor(Math.random()*WIDTH)+1;
                var y = Math.floor(Math.random()*HGIHT)+1;
                var pxy = calpix(x,y);
                if(this.moveable(pxy[0],pxy[1],ZOMBIE) && !this.intozombies(pxy[0],pxy[1],true,i) && !this.intosafetyrange(pxy[0],pxy[1])){
                    this.zombies[i].px = pxy[0];
                    this.zombies[i].py = pxy[1];
                    break;
                }
                this.setrandomgoal(this.zombies[i]);
            }
        }
    }

    updateplayer(){
        var pxy = [this.player.px,this.player.py];
        var speed = (this.player.slow ? PLAYER_LOW_SPEED : (this.player.run ? (this.player.power>=PLAYER_POWER_LOST ? PLAYER_HIGH_SPEED : PLAYER_NORMAL_SPEED) : PLAYER_NORMAL_SPEED));
        this.player.lastspeed = this.player.speed; this.player.speed = speed;
        var range;
        var i,ok=false;
        // console.log(speed,this.player.slow,this.player.run)
        for(i=0;i<4;i++){
            if(this.player.move[i] == true){
                ok = true;
                for(range=speed;range>=1;range--){
                    // console.log("player move",i,"range",range);
                    var npxy = direrange(pxy[0],pxy[1],i,range);
                    if(this.moveable(npxy[0],npxy[1],HERO) && !this.intozombies(npxy[0],npxy[1],false,0)){
                        pxy = npxy;
                        break;
                    }
                }
            }
        }
        if(!this.player.ifmoving()){
            this.player.speed = 0;
        }
        if(!this.player.ifmoving() || this.player.slow){
            this.player.power += PLAYER_POWER_HIGH_RECOVER;
            if(this.player.power>PLAYER_POWER_FULL){
                this.player.power = PLAYER_POWER_FULL;
            }
        }else{
            if(this.player.run){
                this.player.power -= PLAYER_POWER_LOST;
                if(this.player.power < 0){
                    this.player.power = 0;
                }
            }else{
                this.player.power += PLAYER_POWER_RECOVER;
                if(this.player.power>PLAYER_POWER_FULL){
                    this.player.power = PLAYER_POWER_FULL;
                }
            }
        }
        this.player.px = pxy[0]; this.player.py = pxy[1];
        if(overlap(this.player.px,this.player.py,HEROW,HEROL,calpix(WIDTH,HGIHT)[0],calpix(WIDTH,HGIHT)[1],BLOCKSIZE,BLOCKSIZE)){
            this.message = "You escaped! Lucky!";
            this.status = PLAYERWIN;
        }
    }

    notwallrange(fromxy,toxy,d){
        var nxy=fromxy;
        if(fromxy[0]==toxy[0] && fromxy[1] == toxy[1]){
            return 0;
        }
        var counter = 0;
        while(true){
            nxy = dire(nxy[0],nxy[1],d);
            if(nxy[0]==toxy[0] && nxy[1] == toxy[1]){
                break;
            }
            counter+=1;
            if(!this.notwall(nxy[0],nxy[1])){
                return -1;
            }
        }
        return counter;
    }

    detectplayer(zombie){
        var zbkxy = pixtoblock(zombie.px, zombie.py);
        var pbkxy = pixtoblock(this.player.px, this.player.py);
        var d = caldire(zbkxy,pbkxy);
        if(d == NODIRE){
            // zombie.chasing = false;
            return false;
        }
        if(zombie.move[d] && (this.notwallrange(zbkxy,pbkxy,d) >= 0 && this.notwallrange(zbkxy,pbkxy,d) <= 2 )){
            zombie.chasing = true;
            if(this.notwallrange(zbkxy,pbkxy,d) == 0){
                zombie.setaim(this.player.px,this.player.py);
            }else{
                zombie.setaim(calpix(pbkxy[0],pbkxy[1])[0],calpix(pbkxy[0],pbkxy[1])[1]);
            }
            // console.log("Player seen, moving",zombie.move)
            return true;
        }else{
            if(!this.player.slow && this.player.ifmoving()){
                if(inhearrange(zbkxy,pbkxy,d)){
                    zombie.chasing = true;
                    // zombie.setaim(calpix(pbkxy[0],pbkxy[1])[0],calpix(pbkxy[0],pbkxy[1])[1]);
                    zombie.setaim(this.player.px,this.player.py);
                    // console.log("Player heared, moving",zombie.move)
                    return true;
                }
            }
        }
        // zombie.chasing = false;
        return false;
    }

    setrandomgoal(zombie){
        var zbkxy = pixtoblock(zombie.px, zombie.py);
        var d = Math.floor(Math.random()*4);
        var i,nxy;
        // console.log("Set random goal from",zbkxy);
        for(i=0;i<4;i++){
            nxy = dire(zbkxy[0],zbkxy[1],d);
            // console.log("try",nxy);
            if(this.notwall(nxy[0],nxy[1]) && !outmap(nxy[0],nxy[1])){
                nxy = calpix(nxy[0],nxy[1]);
                zombie.setaim(nxy[0],nxy[1]);
                break;
            }
            d += 1;
            d = d % 4;
        }
    }

    updatezombie(index){
        var zombie = this.zombies[index];
        // console.log([zombie.px,zombie.py],zombie.aim);
        var pxy = [zombie.px,zombie.py],npxy = [zombie.px,zombie.py];
        this.detectplayer(zombie);
        // console.log("detectplayer");
        var speed = (zombie.chasing ? (zombie.power >= ZOMBIE_POWER_LOST ? ZOMBIE_HIGH_SPEED : ZOMBIE_MIDDLE_SPEED) : ZOMBIE_LOW_SPEED);
        zombie.lastspeed = zombie.speed; zombie.speed = speed;
        var i,ok=0;
        for(i=0;i<4;i++){
            if(zombie.move[i] == true){
                if(i == UP || i==DOWN){
                    if(Math.abs(pxy[1] - zombie.aim[1]) <= speed){
                        npxy[1] = zombie.aim[1];npxy[0] = pxy[0];
                    }else{
                        npxy = direrange(pxy[0],pxy[1],i,speed);
                    }
                }else{
                    if(Math.abs(pxy[0] - zombie.aim[0]) <= speed){
                        npxy[0] = zombie.aim[0];npxy[1] = pxy[1];
                    }else{
                        npxy = direrange(pxy[0],pxy[1],i,speed);
                    }
                }
                // console.log("move to",npxy);
                if(this.moveable(npxy[0],npxy[1],ZOMBIE) && !this.intozombies(npxy[0],npxy[1],true,index) && (pxy[0] != npxy[0] || pxy[1] != npxy[1])){
                    pxy = npxy;
                    ok = 1;
                }
            }
        }
        // console.log("moveit");
        if(!zombie.ifmoving()){
            zombie.speed = 0;
        }
        if(ok == 1){
            zombie.px = pxy[0];zombie.py = pxy[1];
            if(zombie.chasing && zombie.power >= ZOMBIE_POWER_LOST){
                zombie.power -= ZOMBIE_POWER_LOST;
                if(zombie.power < 0){
                    zombie.power = 0;
                }
            }
        }else{
            zombie.chasing = false;
            zombie.power += ZOMBIE_POWER_RECOVER;
            if(zombie.power > ZOMBIE_POWER_FULL){
                zombie.power = ZOMBIE_POWER_FULL;
            }
            this.setrandomgoal(zombie);
        }
        if(this.intoplayer(zombie.px,zombie.py)){
            // console.log("zombie",index,"hit")
            this.message = "The zombie gets you!\nYou are dead...";
            this.status = ZOMBIEWIN;
        }
        // console.log("end");
    }

    update(){
        if(this.status == ONGOING){
            this.updateplayer();
        }
        // console.log("updateplayer");
        
        if(this.status == ONGOING){
            var i=0;
            for(;i<NUMZOMBIE;i++){
                this.updatezombie(i);
                // console.log("updatezombie",i);
            }
        }
    }

    constructor(){
        this.gamemap = new Array(TOTAL);
        this.generatemap();
        this.player = new Player();
        this.zombies = new Array(NUMZOMBIE);
        this.message = "Game started. Try to escape!";
        var i=0;
        for(;i<NUMZOMBIE;i++){
            this.zombies[i] = new Zombie();
        }
        // printmap(this.gamemap);
        this.inizombiexy();
        this.status = ONGOING;
    }

    getblock(x, y){
        if(outmap(x,y)){
            return OUTMAP;
        }
        // console.log("get",x,y,"=",this.gamemap[calind(x,y)]);
        return this.gamemap[calind(x,y)];
    }

    getfullmap(){
        return this.gamemap;
    }
}