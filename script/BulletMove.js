var BulletMove = pc.createScript('bulletMove');

BulletMove.prototype.fixedupdate = function(dt){
    this.entity.translate(this.move);
    this.lifeTime -= dt;
    if(this.lifeTime < 0){
        if(this.stateMachine.current === 'alive')
        this.stateMachine.destroy();
    }
};
// initialize code called once per entity
BulletMove.prototype.initialize = function() {
    this.app.on('fixedupdate', this.fixedupdate, this);
    this.lifeTime = 5;
    this.moveSpeed = -0.5;
    this.move = this.entity.forward.scale(this.moveSpeed);
    this.stateMachine;
};