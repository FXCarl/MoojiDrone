var DroneController = pc.createScript('droneController');

DroneController.prototype.fixedupdate = function(dt){
    if(!this.entity.script)
        return;
    var drone = this.entity.script.physicalDroneDrive;
    if(!drone)
        return;
    drone.headingDirection = this.goto;
    if(this.goto.lengthSq() > 0 && this.entity.name != -1 && this.entity.name === mycilent.id)
        socket.emit('playerMove',{id:this.entity.name,x:this.goto.x,y:this.goto.y});
    this.goto.set(0,0);
};

DroneController.prototype.playerMove = function(x,z){
    this.goto.x = x;
    this.goto.y = z;
};

// initialize code called once per entity
DroneController.prototype.initialize = function() {
    this.app.on('fixedupdate', this.fixedupdate, this);
    this.app.on('Move' + this.entity.name, this.playerMove, this);
    this.goto = new pc.Vec2();
};