var Cruise = pc.createScript('cruise');
Cruise.attributes.add('speed',{
    type : 'number',
    default : 25
});

Cruise.attributes.add('changeFrequency',{
    type : 'number',
    default : 5
});

// initialize code called once per entity
Cruise.prototype.initialize = function() {
    this.drone = this.entity.script.physicalDroneDrive;
    this.timer = 0;
};

// update code called every frame
Cruise.prototype.update = function(dt) {
    this.timer += dt;
    
    if(this.timer >= this.changeFrequency){
        // Anti Axis For this case
        var noiseZ = 0;
        var noiseFreq = 0.066;
        var currentPos = this.entity.getPosition();
        var goto = this.drone.horizontalVel;
        if(goto.x != 0 || goto.y != 0)
            goto.normalize();
            
        var r = Noise(currentPos.x * noiseFreq,currentPos.z * noiseFreq,noiseZ);
        goto.x +=  r;
        goto.y +=  Math.sqrt(1 - r * r);
        goto.x *= (-1.0)*(Noise(currentPos.x * noiseFreq,currentPos.z * noiseFreq,noiseZ));
        goto.y *= (-1.0)*(Noise(currentPos.x * noiseFreq,currentPos.z * noiseFreq,noiseZ));
        
        if(goto.x != 0 || goto.y != 0)
            goto.normalize();
        goto.scale((this.speed));
        this.drone.horizontalVel = goto;
        
        this.timer = 0;
    }
};

Cruise.prototype.swap = function(old) {
    this.initialize();
};
