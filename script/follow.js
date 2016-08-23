var Follow = pc.createScript('follow');

Follow.attributes.add('target',{
    type: 'entity',
    displayName: 'Target Entity',
    default: ''
});

Follow.attributes.add('distance',{
    type: 'number',
    default: 4
});

Follow.attributes.add('damping',{
    type: 'number',
    default: 0.2
});

// initialize code called once per entity
Follow.prototype.initialize = function() {
    this.target = this.target || null;
    this.vec = new pc.Vec3();
};

// update code called every frame
Follow.prototype.update = function(dt) {
    if(!this.target)
        return;
    var pos = this.target.getPosition();
    pos.z += this.distance;
    pos.y += this.distance;
    this.vec.lerp(this.vec, pos, this.damping * (1-Math.exp(-20*dt)));
    this.entity.setPosition(pos);
};

Follow.prototype.swap = function(old) {
    this.initialize();
};