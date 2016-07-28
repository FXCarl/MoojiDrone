 var Physics = pc.createScript('physics');

Physics.attributes.add('fixedStep',{
    type: 'number',
    default: 0.01
});

Physics.prototype.initialize = function() {
    this.gametime = 0;
    this.fixedtime = 0;
};

Physics.prototype.update = function(dt) {
    this.gametime += dt;
    var timeDiff = 0;
    this.app.fire('presimulation');
    while(this.fixedtime < this.gametime){
        this.app.fire('fixedupdate',this.fixedStep);
        this.app.fire('simulation',this.fixedStep); // For PhysicalBody
        this.fixedtime += this.fixedStep;
        timeDiff = this.gametime - this.fixedtime;
    };
    this.app.fire('aftsimulation', timeDiff);
};