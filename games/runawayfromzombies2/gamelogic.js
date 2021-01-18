class Zombie {
    constructor(){
        this.px = BASEX;
        this.py = BASEY;
        this.power = ZOMBIE_POWER_FULL;

        this.move = [false,false,false,false]
        this.chasing = false;
        this.aim = [0,0];
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
}

class Player {
    constructor(){
        this.px = BASEX;
        this.py = BASEY;
        this.power = PLAYER_POWER_FULL;

        this.move = [false,false,false,false]
        this.slow = false;
        this.run = false;
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
            nxy = cornerdirepx(nxy[0],nxy[1],i);
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

    inizombiexy(){
        var i;
        for(i=0;i<NUMZOMBIE;i++){
            // console.log("Zombie",i);
            while(true){
                var x = Math.floor(Math.random()*WIDTH)+1;
                var y = Math.floor(Math.random()*HGIHT)+1;
                var pxy = calpix(x,y);
                if(this.moveable(pxy[0],pxy[1],ZOMBIE) && !this.intozombies(pxy[0],pxy[1],true,i) && !this.intoplayer(pxy[0],pxy[1])){
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
        if(!this.player.ifmoving() || this.player.slow){
            this.player.power += PLAYER_POWER_RECOVER;
            if(this.player.power>PLAYER_POWER_FULL){
                this.player.power = PLAYER_POWER_FULL;
            }
        }else{
            if(this.player.run){
                this.player.power -= PLAYER_POWER_LOST;
                if(this.player.power < 0){
                    this.player.power = 0;
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
            return true;
        }
        while(true){
            nxy = dire(nxy[0],nxy[1],d);
            if(nxy[0]==toxy[0] && nxy[1] == toxy[1]){
                break;
            }
            if(!this.notwall(nxy[0],nxy[1])){
                return false;
            }
        }
        return true;
    }

    detectplayer(zombie){
        var zbkxy = pixtoblock(zombie.px, zombie.py);
        var pbkxy = pixtoblock(this.player.px, this.player.py);
        var d = caldire(zbkxy,pbkxy);
        if(d == NODIRE){
            // zombie.chasing = false;
            return false;
        }
        if(zombie.move[d] && this.notwallrange(zbkxy,pbkxy,d)){
            zombie.chasing = true;
            zombie.setaim(calpix(pbkxy[0],pbkxy[1])[0],calpix(pbkxy[0],pbkxy[1])[1]);
            // console.log("Player seen, moving",zombie.move)
            return true;
        }else{
            if(!this.player.slow && this.player.ifmoving()){
                if(inhearrange(zbkxy,pbkxy,d)){
                    zombie.chasing = true;
                    zombie.setaim(calpix(pbkxy[0],pbkxy[1])[0],calpix(pbkxy[0],pbkxy[1])[1]);
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
                if(this.moveable(npxy[0],npxy[1],ZOMBIE) && !this.intozombies(npxy[0],npxy[1],true,index) && (pxy[0] != npxy[0] || pxy[1] != npxy[1])){
                    pxy = npxy;
                    ok = 1;
                }
            }
        }
        // console.log("moveit");
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