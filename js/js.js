function getTimer(duration, thisArg, callback){
    var timer;
    return{
        start:function(){
            if(timer){
                return;
            }
               timer= setInterval(callback.bind(thisArg),duration)
            
        },
        stop:function(){
            clearInterval(timer);
            timer= null;
        }
    }
}

function getRandom(min,max){
    return Math.floor(Math.random() * (max+1-min)+min);
}





var game = {

    dom:document.querySelector(".game"),
    overDom:document.querySelector(".game .over"),
    isPause:true,
    isOver:false,
    start:function(){
        sky.timer.start();
        land.timer.start();
        bird.swingTimer.start();
        bird.dropTimer.start();
        pipeManager.produceTimer.start();
        pipeManager.moveTimer.start();
        hitManager.timer.start();
        this.isPause =false;
    },
    stop:function(){
        sky.timer.stop();
        land.timer.stop();
        bird.swingTimer.stop();
        bird.dropTimer.stop();
        pipeManager.produceTimer.stop();
        pipeManager.moveTimer.stop();
        hitManager.timer.stop();
        this.isPause = true;
    }
}

game.width = game.dom.clientWidth; 
game.height = game.dom.clientHeight;

//tiankong
var sky ={
    left:0,
    dom:document.querySelector(".game .sky"),
    
};

sky.timer = getTimer(16 , sky , function(){
    this.left-=1;
    if(this.left== -game.width){
        this.left=0;
    }
    this.dom.style.left = this.left+"px";
})



var land ={
    left:0,
    dom:document.querySelector(".game .land"),
}

land.height = land.dom.clientHeight;
land.top = game.height - land.height;

land.timer = getTimer(16 , land , function(){
    this.left -= 2;
    if(this.left== -game.width){
        this.left=0;
    }
    this.dom.style.left = this.left+"px";
})

// the bird
var bird = {
    dom:document.querySelector(".game .bird"),
    left: 150,
    top:150,
    width:51,
    height:35,
    swingIndex:1,
    a:0.002,
    v:0,
    t:16,
    show(){
        if(this.swingIndex === 0){
            this.dom.style.backgroudPosition = "1px 0px";
        }

        else if(this.swingIndex === 1){
            this.dom.style.backgroudPosition = "-49px 0px";
        }

       else{
            this.dom.style.backgroudPosition = "-102px 0px";
        }

        this.dom.style.left = this.left+"px";
        this.dom.style.top = this.top+"px";
    },
    setTop(top){
        if (top<0){
            top=0;
        }
        else if(top>land.top - bird.height){
            top = land.top - this.height;
        }
        this.top = top;
        this.show();

    },
    jump(){
        this.v= -0.5;
    }
}
bird.show();

bird.swingTimer = getTimer(100 , bird , function(){
    this.swingIndex = (this.swingIndex + 1) % 3
    this.show();
})

bird.dropTimer = getTimer(bird.t , bird , function(){
    var dis = this.v*this.t+0.5*this.a * this.t *this.t;
    this.v = this.v + this.a * this.t;

    this.setTop(this.top + dis);
})

//pipe
function Pipe(direction , height){
    this.width = Pipe.width;
    this.left = game.width ;
    this.height = height;
    this.direction = direction;

    if(direction == "up"){
        this.top = 0;
    }else{
        this.top = land.top - this.height
    }

    this.dom  = document.createElement('div');
    this.dom.className = 'pipe ' + direction;
    this.dom.style.height = this.height+"px";
    this.dom.style.top = this.top+"px";
    this.show();
    game.dom.appendChild(this.dom);

}
Pipe.prototype.show = function(){
    this.dom.style.left = this.left + "px";
}


Pipe.width=52;

function Pipepair(){
    var minHeight = 60;
    var gap = 150;
    var maxHeight = land.top - minHeight - gap;
    var h = getRandom(minHeight, maxHeight);
    this.up = new Pipe("up", h);
    this.down = new Pipe("down",land.top -h - gap);
    this.left = this.up.left;

}

Pipepair.prototype.show = function(){
    this.up.left = this.left;
    this.down.left = this.left;
    this.up.show();
    this.down.show();
}

Pipepair.prototype.remove = function(){
    this.up.dom.remove();
    this.down.dom.remove();
}

var pipeManager = {
    pairs:[],
    
};
// create a manager
pipeManager.produceTimer = getTimer(1500 , pipeManager ,function(){
    this.pairs.push (new Pipepair());
})

//create a moveing timer
pipeManager.moveTimer = getTimer(16, pipeManager , function(){
    for(var i=0 ; i<this.pairs.length ; i++){
        var pair = this.pairs[i];
        pair.left -= 2;
        if(pair.left <= -Pipe.width){
            pair.remove();
            this.pairs.splice(i,1);
            i--;
        }else{
            pair.show();
        }
       
    }
})
//pengzhuang

var hitManager = {

    validate:function(){
        //hit with land
        if(bird.top >= land.top - bird.height){
            return true;
        }
        //hit with pipe
        for(var i = 0;i<pipeManager.pairs.length;i++){
            var pair = pipeManager.pairs[i];
            if(this.validateBirdAndPipe(pair.up) || this.validateBirdAndPipe(pair.down)){
                return true;
            }
        }
        return false;
    },
    validateBirdAndPipe(pipe){
        var bx = bird.left + bird.width / 2;
        var by = bird.top + bird.height / 2;
        var px = pipe.left + pipe.width / 2;
        var py = pipe.top + pipe.height / 2;
        if((Math.abs(px-bx)<=(bird.width+pipe.width) / 2) &&
           (Math.abs(py-by)<=(bird.height+pipe.height) / 2)){
            return true;
        }else{
            return false;
        }
    }

};
hitManager.timer = getTimer(16, hitManager, function(){
    if(this.validate()){
        game.stop();
        game.overDom.style.display = "block";
        game.isOver = true;

    }
})



//event
window.onkeydown = function(e){
    if(e.key == "Enter"){
        if (game.isOver){
            location.reload();
            return;
        }
        if (game.isPause){
            game.start();
        }else{
            game.stop();
        }
    }else if(e.key == " "){
        console.log('adadadad')
        bird.jump();
    }
}



