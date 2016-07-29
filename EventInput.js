var EventInput = pc.createScript('eventInput');

EventInput.prototype.initialize = function() {
    // Touch events
    var touchOptions ={
				recognizers:[
					[Hammer.Pan,	{direction: Hammer.DIRECTION_VERTICAL}],
				]
			};
    var hammer = new Hammer(this.app.graphicsDevice.canvas, touchOptions);
    hammer.on('pan',this.touchMove.bind(this));
};

EventInput.prototype.update = function(dt){
     this.InputkeyDown();
};

EventInput.prototype.InputkeyDown = function(){
    var keyV = new pc.Vec2();
    if(this.app.keyboard.isPressed(pc.KEY_A)) {
        keyV.add(new pc.Vec2(-1, 0));
    }
    if(this.app.keyboard.isPressed(pc.KEY_D)) {
        keyV.add(new pc.Vec2(1, 0));
    }
    if(this.app.keyboard.isPressed(pc.KEY_W)) {
        keyV.add(new pc.Vec2(0, -1));
    }
    if(this.app.keyboard.isPressed(pc.KEY_S)) {
       keyV.add(new pc.Vec2(0, 1));
    }
    this.app.fire('playerMoveToward', keyV.x, keyV.y);
};

EventInput.prototype.touchMove = function(ev){
    if(this.activeTouch === false){return false;}
    if( Math.abs(ev.deltaX) > 10 || Math.abs(ev.deltaY) > 10){
        this.app.fire('playerMoveToward',ev.deltaX,ev.deltaY);
    }
};