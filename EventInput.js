var EventInput = pc.createScript('eventInput');

EventInput.prototype.initialize = function() {
    // Touch events
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
var touchOptions ={
        recognizers:[
            [Hammer.Pan,	{direction: Hammer.DIRECTION_VERTICAL}],
        ]
    };
var hammer = new Hammer(document.getElementById("touchPanel"), touchOptions);//window.top
hammer.on('pan',function(ev){
    if(this.activeTouch === false){return false;}
    if( Math.abs(ev.deltaX) > 10 || Math.abs(ev.deltaY) > 10){
        pc.app.fire('playerMoveToward',ev.deltaX,ev.deltaY);
    }
});