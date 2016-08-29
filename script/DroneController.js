var DroneController = pc.createScript('droneController');

// initialize code called once per entity
DroneController.prototype.startListen = function() {
    this.drone = this.entity.script.physicalDroneDrive;
    this.app.on('Move' + player.id, this.playerMove, this);
};
// update code called every frame
DroneController.prototype.playerMove = function(x,z){
    if(!this.drone)
        return;
    // Anti Axis For this case
    var goto = new pc.Vec2(x,z);
    this.drone.headingDirection = goto;
};

// swap method called for script hot-reloading
// inherit your script state here
DroneController.prototype.swap = function(old) {
    old.app.off('Move' + this.entity.name, this.playerMove, this);
    this.initialize();
};
