var TargetCruise = pc.createScript('targetCruise');

TargetCruise.attributes.add('target',{
    type: 'entity',
    default: null
});

TargetCruise.attributes.add('FriendList',{
    type: 'entity',
    default: null
});

TargetCruise.attributes.add('range',{
    type: 'number',
    default: 50
});

TargetCruise.attributes.add('speed',{
    type: 'number',
    default: 30
});

TargetCruise.attributes.add('changeFrequency',{
    type : 'number',
    default : 5
});

TargetCruise.attributes.add('friendSpace',{
    type : 'number',
    default : 5
});

// initialize code called once per entity
TargetCruise.prototype.initialize = function() {
    this.drone = this.entity.script.physicalDroneDrive;
    //获取队伍信息
    this.friends = this.FriendList.children;
    this.timer = 0;
    this.app.on('GameReset',this.reset,this);
};

// update code called every frame
TargetCruise.prototype.update = function(dt) {
    if(!this.drone )
        return;
    
    var disVel = this.drone.horizontalVel;
    if(disVel.x != 0 || disVel.y != 0)
        disVel.normalize();
    
    if(this.friends && this.friends.length > 0){
        var avoidFriendsVel = new pc.Vec2();
        for(var i = 0; i < this.friends.length; i++){
            var del = this.entity.getPosition();
            del.x -= this.friends[i].getPosition().x;
            del.y = 0;
            del.z -= this.friends[i].getPosition().z;
            var length = del.length();
            if(length > 0.01 && length < this.friendSpace){
                del.scale(1.0 / length);
                avoidFriendsVel.x += del.x;
                avoidFriendsVel.y += del.z;
            }
        }
        if(avoidFriendsVel.x != 0 || avoidFriendsVel.y != 0)
            avoidFriendsVel.normalize();
        disVel.x += avoidFriendsVel.x;
        disVel.y += avoidFriendsVel.y;
    }
    
   
    if(this.target){
        var delta = new pc.Vec2();
        delta.x = this.target.getPosition().x - this.entity.getPosition().x;
        delta.y = this.target.getPosition().z - this.entity.getPosition().z;
        if(delta.length() > this.range){          
           delta.normalize();
            disVel.x += delta.x;
            disVel.y += delta.y;
        }
    }
    
    this.timer += dt;
    if(this.timer >= this.changeFrequency){
        var noiseZ = 0;
        var noiseFreq = 0.066;
        var currentPos = this.entity.getPosition();
        // Anti Axis For this case
        var goto = new pc.Vec2();
        var r = Noise(currentPos.x * noiseFreq,currentPos.z * noiseFreq,noiseZ);
        goto.x +=  r;
        goto.y +=  Math.sqrt(1 - r * r);
        goto.x *= (-1)*(Noise(currentPos.x * noiseFreq,currentPos.z * noiseFreq,noiseZ));
        goto.y *= (-1)*(Noise(currentPos.x * noiseFreq,currentPos.z * noiseFreq,noiseZ));
        if(goto.x != 0 || goto.y != 0)
            goto.normalize();
        disVel.x += goto.x;
        disVel.y += goto.y;
        this.timer = 0;
    }
    
    if(disVel.x != 0 || disVel.y != 0)
        disVel.normalize();
    disVel.scale((this.speed));
    this.drone.horizontalVel = disVel;
};

TargetCruise.prototype.reset = function(){
    this.timer = 0;
};
// swap method called for script hot-reloading
// inherit your script state here
TargetCruise.prototype.swap = function(old) {
    this.initialize();
};

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/