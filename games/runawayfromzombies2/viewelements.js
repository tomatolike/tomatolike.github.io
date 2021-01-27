class Button {
    constructor(textsrc,w,l,callback){
        this.button = new createjs.Container();
        this.background = new createjs.Shape();
        this.background.graphics.beginStroke("#3271c2").beginFill("#3271c2").drawRect(0,0,w,l);
        this.label = new createjs.Text(textsrc,"20px Arial","white");
        this.label.textAlign = "center";
        this.label.textBaseline = "middle";
        this.label.x = w/2; this.label.y = l/2;
        // this.button.graphics.beginStroke("red")
        this.button.addChild(this.background,this.label);
        this.button.addEventListener("click",callback);
    }
}