var Physicalbody = pc.createScript('physicalbody');
// initialize code called once per entity
Physicalbody.prototype.initialize = function() { 
    //attributes
    this.mass = 1;
    this.radius = 1;
    this.drag = 0.001;
    //data
    this.pos = new pc.Vec3();
    this.rot = new pc.Quat();
    this.vel = new pc.Vec3();
    this.aVel = new pc.Vec3();
    this.lastPos = new pc.Vec3();
    this.lastRot = new pc.Quat();
    this.lastVel = new pc.Vec3();
    this.lastAVel = new pc.Vec3();
    this.lerpedPos = new pc.Vec3();
    this.lerpedRot = new pc.Quat();
    this.acceleration = new pc.Vec3();
    this.aAcceleration = new pc.Vec3();
    this.deltaRot = new pc.Quat();
    this.app.on('presimulation', this.presim, this);
    this.app.on('simulation', this.simulation,this);
    this.app.on('aftsimulation', this.aftsim, this);
};

Physicalbody.prototype.presim = function(){
    this.lastPos.copy(this.pos);
    this.lastVel.copy(this.vel);
    this.lastRot.copy(this.rot);
    this.lastAVel.copy(this.aVel);
}

Physicalbody.prototype.aftsim = function(percentage){
    this.lerpedPos.lerp(this.lastPos, this.pos, percentage);
    this.entity.setPosition(this.lerpedPos);
    this.lerpedRot.slerp(this.lastRot, this.rot, percentage);
    this.entity.setRotation(this.lerpedRot);
}

// fixedupdate code called every frame
Physicalbody.prototype.simulation = function(dt) {
    this.vel.x += this.acceleration.x * dt;
    this.vel.y += this.acceleration.y * dt;
    this.vel.z += this.acceleration.z * dt;
    this.acceleration.set(0, 0, 0);
    this.vel.x *= 1.0 / (1.0 + this.drag);
    this.vel.y *= 1.0 / (1.0 + this.drag);
    this.vel.z *= 1.0 / (1.0 + this.drag);
    this.pos.x += 0.5 * (this.vel.x + this.lastVel.x) * dt;
    this.pos.y += 0.5 * (this.vel.y + this.lastVel.y) * dt;
    this.pos.z += 0.5 * (this.vel.z + this.lastVel.z) * dt;
    this.aVel.x += this.aAcceleration.x * dt;
    this.aVel.y += this.aAcceleration.y * dt;
    this.aVel.z += this.aAcceleration.z * dt;
    this.aAcceleration.set(0, 0, 0);
    this.aVel.x *= 1.0 / (1.0 + this.drag);
    this.aVel.y *= 1.0 / (1.0 + this.drag);
    this.aVel.z *= 1.0 / (1.0 + this.drag);
    // direct set rot
    var vx, vy, vz, sx, cx, sy, cy, sz, cz;
    vx = 0.25 * (this.aVel.x + this.lastAVel.x) * dt;
    vy = 0.25 * (this.aVel.y + this.lastAVel.y) * dt;
    vz = 0.25 * (this.aVel.z + this.lastAVel.z) * dt;
    sx = Math.sin(vx);
    cx = Math.cos(vx);
    sy = Math.sin(vy);
    cy = Math.cos(vy);
    sz = Math.sin(vz);
    cz = Math.cos(vz);
    this.deltaRot.x = sx * cy * cz - cx * sy * sz;
    this.deltaRot.y = cx * sy * cz + sx * cy * sz;
    this.deltaRot.z = cx * cy * sz - sx * sy * cz;
    this.deltaRot.w = cx * cy * cz + sx * sy * sz;
    this.rot.mul(this.deltaRot);
};

Physicalbody.prototype.addforce = function(force) {
    var inv_inertia = (1.0 / Math.max(0.1,this.mass));
    this.acceleration.x += force.x * inv_inertia;
    this.acceleration.y += force.y * inv_inertia;
    this.acceleration.z += force.z * inv_inertia;
};

Physicalbody.prototype.addtorque = function(torque){
    var inv_inertia = (1.0 / Math.max(0.1, this.mass * this.radius * this.radius));
    this.aAcceleration.x += torque.x * inv_inertia;
    this.aAcceleration.y += torque.y * inv_inertia;
    this.aAcceleration.z += torque.z * inv_inertia;
}

/*
Physicalbody.prototype.swap = function(old) {
    old.app.off('presimulation', old.presim, old);
    old.app.off('simulation', old.simulation, old);
    old.app.off('aftsimulation', old.aftsim, old);
    this.initialize();
};*/