var PhysicalDroneDrive = pc.createScript('physicalDroneDrive');

PhysicalDroneDrive.attributes.add('Thrust',{
    type: 'number',
    title: 'Max Thrust',
    placeholder: 'N',
    default: 50
});

PhysicalDroneDrive.attributes.add('thrustDelta',{
    type: 'number',
    title: 'Thrust Changing Rate',
    placeholder: 'N/s',
    default: 50
});

PhysicalDroneDrive.attributes.add('hoverHeight',{
    type: 'number',
    title: 'Expect Height',
    placeholder: 'm',
    defualt: 50
});

PhysicalDroneDrive.attributes.add('horizontalVel',{
    type: 'vec2',
    title: 'Horizontal Velocity',
    defualt : pc.Vec2.ZERO
});

PhysicalDroneDrive.attributes.add('heading',{
    type: 'vec2',
    title: 'Heading',
    defualt : pc.Vec2.ZERO
});

PhysicalDroneDrive.attributes.add('headingVel',{
    type: 'boolean',
    title: 'Heading Velocity',
    defualt : true
});

// initialize code called once per entity
PhysicalDroneDrive.prototype.initialize = function() {
    this.app.on('fixedupdate', this.fixedupdate,this);
    // local var
    this.gravity = new pc.Vec3(0, -3.71, 0); // we are on Mars !
    this.currentThrust = 0;
    this.currentHThrust = pc.Vec2.ZERO;
    this.currentThrustVector = pc.Vec3.UP;
    this.currentHeading = pc.Vec3.FORWARD;
    this.currentQuat = pc.Quat.IDENTITY;
};

PhysicalDroneDrive.prototype.fixedupdate = function(dt) {
    // find body
    var pbody = this.entity.script.physicalbody;
    // Add Gravity
    var gravity = this.gravity.clone().scale(pbody.mass);
    pbody.addforce(gravity);
    
    // Thrust
    var maxThrust = pc.math.clamp(this.currentThrust + this.thrustDelta * dt, 0, this.maxThrust);
    var currentPos = pbody.pos;
    // Compute expect vertical thrust
    var currentVVel = pbody.currentVel.y;
    var vDist = this.hoverHeight - currentPos.y;
    // a = 2 * (d/t - v) / t
    var expectT = Math.max(1, Math.abs(currentVVel / this.gravity.length()));
    var expectVAcc = 2 * (vDist / expectT - currentVVel) / expectT;
    var expectVThrust = (expectVAcc - this.gravity.y) * pbody.mass;
    var vThrust = pc.math.clamp(expectVThrust, 0, maxThrust) || 0;
    // Available Horizontal Thrust
    var useableHThrust = maxThrust - vThrust;
    // Compute expectr Horizontal thrust
    var currentHVel = new pc.Vec2(pbody.currentVel.x, pbody.currentVel.z);
    // a = (tgtv - v) / t [t = 1]
    var expectHAcc = this.horizontalVel.clone().sub(currentHVel);
    var expectHThrust = expectHAcc.scale(pbody.mass);
    var hThrust = pc.Vec2.ZERO;
    if(expectHThrust.lengthSq() > 0)
        hThrust.copy(expectHThrust).normalize();
    hThrust.scale(pc.math.clamp(expectHThrust.length(), 0, useableHThrust));
    // merge all
    // http://www.gamedev.net/topic/429507-finding-the-quaternion-betwee-two-vectors/
    this.currentHThrust.lerp(this.currentHThrust, hThrust, dt);
    var thrust = new pc.Vec3(this.currentHThrust.x, vThrust, this.currentHThrust.y);
    this.currentThrust = Math.abs(thrust.x) + Math.abs(thrust.y) + Math.abs(thrust.z);
    if(this.currentThrust > 0){
        this.currentThrustVector.copy(thrust).sub(gravity).normalize();
        this.currentQuat = new pc.Quat(this.currentThrustVector.z, 0, -this.currentThrustVector.x, 1 + this.currentThrustVector.y).normalize();
    }
    else{
        this.currentThrustVector = pc.Vec3.UP;
        this.currentQuat = pc.Quat.IDENTITY;
    }
    // Apply Thrust
    pbody.addforce(thrust);
};

PhysicalDroneDrive.prototype.update = function(dt){
    // find body
    var pbody = this.entity.script.physicalbody;
    // heading
    if(this.headingVel){
        this.heading.lerp(this.heading, new pc.Vec2(pbody.currentVel.x, pbody.currentVel.z), dt);
    }
    if(this.heading.lengthSq() > 0){
        this.currentHeading.lerp(this.currentHeading, new pc.Vec3(this.heading.x, 0, this.heading.y), 0.5);
    }
    // Attitude control
    var dir = this.currentQuat.transformVector(this.currentHeading);
    this.entity.lookAt(this.entity.getPosition().sub(dir));
}

// swap method called for script hot-reloading
// inherit your script state here
PhysicalDroneDrive.prototype.swap = function(old) {
    this.initialize();
};

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/