 var Physics = pc.createScript('physics');

Physics.attributes.add('fixedStep',{
    type: 'number',
    default: 0.01
});

Physics.prototype.initialize = function() {
    this.timeahead = 0;
    this.fixedtime = 0;
};

Physics.prototype.update = function(dt) {
    this.timeahead += dt;
    if(this.timeahead > this.fixedtime){
        this.timeahead -= this.fixedtime;
        this.fixedtime = 0;
        this.app.fire('presimulation');
        while(this.fixedtime < this.timeahead){
            this.app.fire('fixedupdate',this.fixedStep);
            this.app.fire('simulation',this.fixedStep);
            this.fixedtime += this.fixedStep;
        }
    }
    this.app.fire('aftsimulation', this.timeahead/this.fixedtime);
};

Physics.prototype.swap = function(old) {
    this.initialize();
};