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
    this.vel = new pc.Vec3();
    this.lastPos = new pc.Vec3();
    this.lastVel = new pc.Vec3();
    this.acceleration = new pc.Vec3();
    this.lerpedPos = new pc.Vec3();
    this.app.on('presimulation', this.presim, this);
    this.app.on('simulation', this.simulation,this);
    this.app.on('aftsimulation', this.aftsim, this);
};

Physicalbody.prototype.presim = function(){
    this.lastPos.copy(this.pos);
    this.lastVel.copy(this.vel);
}

Physicalbody.prototype.aftsim = function(percentage){
    this.lerpedPos.lerp(this.lastPos, this.pos, percentage);
    this.entity.setPosition(this.lerpedPos);
}

// fixedupdate code called every frame
Physicalbody.prototype.simulation = function(dt) {
    this.vel.x += this.acceleration.x * dt;
    this.vel.y += this.acceleration.y * dt;
    this.vel.z += this.acceleration.z * dt;
    this.vel.x *= 1.0 / (1.0 + this.drag);
    this.vel.y *= 1.0 / (1.0 + this.drag);
    this.vel.z *= 1.0 / (1.0 + this.drag);
    this.pos.x += 0.5 * (this.vel.x + this.lastVel.x) * dt;
    this.pos.y += 0.5 * (this.vel.y + this.lastVel.y) * dt;
    this.pos.z += 0.5 * (this.vel.z + this.lastVel.z) * dt;
    this.acceleration.set(0, 0, 0);
};

Physicalbody.prototype.addforce = function(force) {
    this.acceleration.x += force.x * (1.0 / Math.max(0.1,this.mass));
    this.acceleration.y += force.y * (1.0 / Math.max(0.1,this.mass));
    this.acceleration.z += force.z * (1.0 / Math.max(0.1,this.mass));
};

Physicalbody.prototype.swap = function(old) {
    old.app.off('presimulation', old.presim, old);
    old.app.off('simulation', old.simulation, old);
    old.app.off('aftsimulation', old.aftsim, old);
    this.initialize();
};