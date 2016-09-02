var DroneController = pc.createScript('droneController');

DroneController.prototype.fixedupdate = function(dt){
    if(!this.entity.script)
        return;
    var drone = this.entity.script.physicalDroneDrive;
    if(!drone)
        return;
    drone.headingDirection = this.goto;
    /*
    if(this.goto.lengthSq() > 0 && this.entity.name != -1 && this.entity.name === mycilent.id)
        socket.emit('playerMove',{id:this.entity.name,x:this.goto.x,y:this.goto.y});*/
    this.sendtime -= dt;
    if(this.sendtime<0 && this.entity.name != -1 && this.entity.name === mycilent.id){
        var pos = this.entity.getPosition();
        var rota = this.entity.getEulerAngles();
        socket.emit('playerMove',{
            id:this.entity.name,
            x:pos.x,y:pos.y,z:pos.z,
            rx:rota.x,ry:rota.y,rz:rota.z
        });
        this.sendtime=0.01;
    }
    this.goto.set(0,0);
};

DroneController.prototype.playerMove = function(x,z){
    this.goto.x = x;
    this.goto.y = z;
};

DroneController.prototype.setPosRota = function(data){
    this.entity.setPosition(data.x,data.y,data.z);
    this.entity.setEulerAngles(data.rx,data.ry,data.rz);
};

// initialize code called once per entity
DroneController.prototype.initialize = function() {
    this.app.on('fixedupdate', this.fixedupdate, this);
    this.app.on('Move' + this.entity.name, this.playerMove, this);
    this.app.on('AgentMove' + this.entity.name, this.setPosRota, this);
    this.goto = new pc.Vec2();
    this.sendtime = 0.01;
};