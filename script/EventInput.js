var EventInput = pc.createScript('eventInput');

EventInput.prototype.update = function(dt){
    this.InputkeyDown();
};
EventInput.prototype.InputkeyDown = function(){
    var pressed = false;
    var keyV = new pc.Vec2();
    if(this.app.keyboard.isPressed(pc.KEY_A)) {
        keyV.add(new pc.Vec2(-1, 0));
        pressed = true;
    }
    if(this.app.keyboard.isPressed(pc.KEY_D)) {
        keyV.add(new pc.Vec2(1, 0));
        pressed = true;
    }
    if(this.app.keyboard.isPressed(pc.KEY_W)) {
        keyV.add(new pc.Vec2(0, -1));
        pressed = true;
    }
    if(this.app.keyboard.isPressed(pc.KEY_S)) {
       keyV.add(new pc.Vec2(0, 1));
        pressed = true;
    }

    if(this.app.keyboard.wasPressed(pc.KEY_T)) {
        for(i=0;i<AgentList.length;i++){
            if(AgentList[i])console.log(AgentList[i].plane.entity.name);else console.log('null');
           // SyncAgentList();
        }
    }
    if(player && this.app.keyboard.wasPressed(pc.KEY_G)) {
            AgentList[player.id].plane.entity.destroy();
    }

    if(pressed && player){
        pc.app.fire('Move' + player.id,keyV.x,keyV.y);
    }
};

var touchOptions ={
        recognizers:[
            [Hammer.Pan,	{direction: Hammer.DIRECTION_VERTICAL}],
        ]
    };
var hammer = new Hammer(document.getElementById("touchPanel"), touchOptions);//window.top
hammer.on('pan',function(ev){
    if(this.activeTouch === false){return false;}
    if(player &&( Math.abs(ev.deltaX) > 10 || Math.abs(ev.deltaY) > 10)){
            pc.app.fire('Move' + player.id,ev.deltaX,ev.deltaY);
    }
});