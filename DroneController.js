var DroneController = pc.createScript('droneController');

DroneController.attributes.add('speed',{
    type : 'number',
    default : 25
});

// initialize code called once per entity
DroneController.prototype.initialize = function() {
    this.app.on('playerMoveToward', this.playerMoveToward, this);
};

// update code called every frame
DroneController.prototype.playerMoveToward = function(x,z){
    // Anti Axis For this case
    var goto = new pc.Vec2(x,z);
    if(goto.x != 0 || goto.y != 0)
        goto.normalize();
    goto.scale((this.speed));
    var drone = this.entity.script.physicalDroneDrive;
    drone.horizontalVel = goto;
};

// swap method called for script hot-reloading
// inherit your script state here
DroneController.prototype.swap = function(old) {
    old.app.off('playerMoveToward', this.playerMoveToward, this);
    this.initialize();
};

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/