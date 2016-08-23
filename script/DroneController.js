var DroneController = pc.createScript('droneController');

// initialize code called once per entity
DroneController.prototype.initialize = function() {
    this.app.on(this.entity.name + ':MoveToward', this.playerMoveToward, this);
};

// update code called every frame
DroneController.prototype.playerMoveToward = function(x,z){
    if(!this.entity.script)
        return;
    // Anti Axis For this case
    var goto = new pc.Vec2(x,z);
    var drone = this.entity.script.physicalDroneDrive;
    drone.headingDirection = goto;
};

// swap method called for script hot-reloading
// inherit your script state here
DroneController.prototype.swap = function(old) {
    old.app.off(this.entity.name + ':MoveToward', this.playerMoveToward, this);
    this.initialize();
};

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/