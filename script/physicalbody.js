var Physicalbody = pc.createScript('physicalbody');

Physicalbody.attributes.add('mass',{
    type : 'number',
    default : 1
});

Physicalbody.attributes.add('drag',{
    type : 'number',
    default : 0
});

// initialize code called once per entity
Physicalbody.prototype.initialize = function() { 
    this.pos = new pc.Vec3();
    this.lastVel = new pc.Vec3();
    this.currentVel = new pc.Vec3();
    this.acceleration = new pc.Vec3();
    this.posDiff = new pc.Vec3();
    
    this.app.on('presimulation', this.presim, this);
    this.app.on('simulation', this.simulation,this);
    this.app.on('aftsimulation', this.aftsim, this);

    this.initialized = true;
};

Physicalbody.prototype.presim = function(){
    this.pos = this.entity.getPosition();
    this.pos.sub(this.posDiff);
}

Physicalbody.prototype.aftsim = function(timeDiff){
    this.posDiff = this.currentVel.clone().scale(timeDiff); 
    this.pos.add(this.posDiff);
    this.entity.setPosition(this.pos);
}

// fixedupdate code called every frame
Physicalbody.prototype.simulation = function(dt) {
    if(typeof this.initialized == 'undefined')
        return;
    
    this.currentVel.x += this.acceleration.x * dt;
    this.currentVel.y += this.acceleration.y * dt;
    this.currentVel.z += this.acceleration.z * dt;
    
    var dragCoef = 1.0 / (1 + this.drag);
    this.currentVel.x *= dragCoef;
    this.currentVel.y *= dragCoef;
    this.currentVel.z *= dragCoef;
    
    this.pos.x += 0.5 * (this.currentVel.x + this.lastVel.x) * dt;
    this.pos.y += 0.5 * (this.currentVel.y + this.lastVel.y) * dt;
    this.pos.z += 0.5 * (this.currentVel.z + this.lastVel.z) * dt;
    
    this.acceleration.set(0, 0, 0);
    this.lastVel.copy(this.currentVel);
};

Physicalbody.prototype.addforce = function(force) {
    var invMass = 1.0 / Math.max(0.1,this.mass);
    
    this.acceleration.x += force.x * invMass;
    this.acceleration.y += force.y * invMass;
    this.acceleration.z += force.z * invMass;
};

Physicalbody.prototype.swap = function(old) {
    this.initialized = false;
    old.app.off('presimulation', old.presim, old);
    old.app.off('simulation', old.simulation, old);
    old.app.off('aftsimulation', old.aftsim, old);
    this.initialize();
};