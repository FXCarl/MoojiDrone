var DroneController = pc.createScript('droneController');

DroneController.attributes.add('speed',{
    type : 'number',
    default : 25
});

// initialize code called once per entity
DroneController.prototype.initialize = function() {
    this.drone = this.entity.script.physicalDroneDrive;
    this.app.on(this.entity.name + ':MoveToward', this.playerMoveToward, this);
};

// update code called every frame
DroneController.prototype.playerMoveToward = function(x,z){
    if(!this.drone)
        return;
    // Anti Axis For this case
    var goto = new pc.Vec2(x,z);
    if(goto.x != 0 || goto.y != 0){
        goto.normalize();
        goto.scale((this.speed));
    }
    this.drone.horizontalVel = goto;
};

// swap method called for script hot-reloading
// inherit your script state here
DroneController.prototype.swap = function(old) {
    old.app.off(this.entity.name + ':MoveToward', this.playerMoveToward, this);
    this.initialize();
};
