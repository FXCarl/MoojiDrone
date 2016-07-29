var Game = pc.createScript('game');

// initialize code called once per entity
Game.prototype.initialize = function() {
     this.gameui = this.entity.script.gameUi;
     this.main = this.app.root.findByName('UI').script.main;
    
     this.entity.onActivate = function () {
         
         this.start();
            }.bind(this);
    
     this.entity.initialized = true;
    
};

Game.prototype.switchState = function(state) {              //切换状态
    this.main.setState(state);
};


Game.prototype.start = function(paused) {                  //游戏开始                           
     
    setTimeout(function () {  //控制pausePanel
         this.gameui.reset();  
            }.bind(this), 100); 
    
};




Game.prototype.pause = function(paused) {                   //游戏暂停
    this.paused = paused;
    if (this.paused) {
        this.gameui.pausePanel.display(true);
        this.app.timeScale = 0;
    } else {
        this.gameui.pausePanel.display(false);
        this.app.timeScale = 1;
    }
};


Game.prototype.reset = function(paused) {                  //游戏重新开始
    this.app.timeScale = 1;
    this.pause(false);
    this.app.fire('GameReset');
};

Game.prototype.end = function(){
    this.app.timeScale = 0;
    this.gameui.btnPause.display(false);
    this.gameui.btnEnd.display(false);
    this.gameui.endPanel.display(true);
}

// update code called every frame
Game.prototype.update = function(dt) {
    
};

// swap method called for script hot-reloading
// inherit your script state here
Game.prototype.swap = function(old) {
    
};

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/