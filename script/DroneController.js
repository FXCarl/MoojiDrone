var DroneController = pc.createScript('droneController');

// initialize code called once per entity
DroneController.prototype.initialize = function() {
    this.app.on('fixedupdate', this.fixedupdate, this);
    this.app.on('Move' + this.entity.name, this.playerMove, this);
    this.goto = new pc.Vec2();
};
// update code called every frame
DroneController.prototype.playerMove = function(x,z){
    // Anti Axis For this case
    this.goto.x = x;
    this.goto.y = z;
};

DroneController.prototype.fixedupdate = function(dt){
    if(!this.entity.script)
        return;
    var drone = this.entity.script.physicalDroneDrive;
    if(!drone)
        return;
    //drone.setDir(this.goto.x,this.goto.y);
    drone.headingDirection = this.goto;
        if(player && this.goto.lengthSq() > 0 && this.entity.name != -1 && this.entity.name === player.id)
            socket.emit('playerMove',{id:this.entity.name,x:this.goto.x,y:this.goto.y});
    this.goto = new pc.Vec2();
};

/*
// swap method called for script hot-reloading
// inherit your script state here
DroneController.prototype.swap = function(old) {
    old.app.off('Move' + this.entity.name, this.playerMove, this);
    this.initialize();
};*/
