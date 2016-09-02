var AgentController = pc.createScript('agentController');

AgentController.prototype.setPosRota = function(data){
    this.entity.setPosition(data.x,data.y,data.z);
    this.entity.setEulerAngles(data.rx,data.ry,data.rz);
    console.log(this.entity.name + ' AgentMove');
};

// initialize code called once per entity
AgentController.prototype.initialize = function() {
    this.app.on('AgentMove' + this.entity.name, this.setPosRota, this);
};