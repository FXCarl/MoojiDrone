var PhysicalDroneDrive = pc.createScript('physicalDroneDrive');

// initialize code called once per entity
PhysicalDroneDrive.prototype.initialize = function() {
    //attributes
    this.maxThrust = 50;
    this.maxSpeed = 50;
    this.maxG = 3;
    this.hoverHeight = 3;
    // local var
    this.gravity = new pc.Vec3(0, -3.71, 0); // we are on Mars !
    this.gravityForce = new pc.Vec3(0, 0, 0);
    this.currentPos = new pc.Vec3(0, 0, 0);
    this.thrust = new pc.Vec3(0, 0, 0);
    this.headingDirection = new pc.Vec2();
    // start simulation
    this.pbody = this.entity.script.physicalbody;
    this.app.on('fixedupdate', this.fixedupdate, this);
};

PhysicalDroneDrive.prototype.fixedupdate = function(dt) {
    this.gravityForce.copy(this.gravity).scale(this.pbody.mass);
    this.currentPos.copy(this.pbody.pos);
    // Add Gravity
    this.pbody.addforce(this.gravityForce);
    // vertical thrust
    var hoverDist = this.currentPos.y - this.hoverHeight;
    var verticalThrust = pc.math.clamp(Math.exp(-0.1 * hoverDist) * this.gravityForce.length(), 0, this.maxThrust);
    this.thrust.y = verticalThrust;
    this.pbody.addforce(this.thrust);
    this.thrust.set(0, 0, 0);
    // Frame for rotation
    var Fwd = this.pbody.rot.transformVector(pc.Vec3.FORWARD);
    var Rt = new pc.Vec3().cross(Fwd, pc.Vec3.UP);
    Fwd.cross(pc.Vec3.UP, Rt);
    // rotate
    var sway = this.pbody.vel.dot(Rt);
    if(this.pbody.vel.lengthSq() > 1){
        this.pbody.aVel.y = pc.math.clamp(sway, -this.maxG, this.maxG);
    }
    // early return
    if(this.headingDirection.lengthSq() < 0.01) return;
    if(this.headingDirection.lengthSq() > 1) this.headingDirection.normalize();
    // horizontal thrust
    this.thrust.x = this.headingDirection.x;
    this.thrust.z = this.headingDirection.y;
    var speedLimit = pc.math.clamp(Math.exp(-0.1 * (this.pbody.vel.dot(this.thrust) - this.maxSpeed)) - 1, -1, 1);
    var avaluableThrust = (this.maxThrust - verticalThrust);
    this.thrust.scale(avaluableThrust * speedLimit);
    this.pbody.addforce(this.thrust);
    this.thrust.set(0, 0, 0);
};