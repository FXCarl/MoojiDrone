var stateMachine = (function(){
    var fsm =  function(name,cfg){
        this.name = name;
    　　this.current = cfg.initial || null;
        this.events = [];
        this.removelist = [];
        var callbacks = cfg.callbacks || {};
        for(i = 0;i<cfg.events.length;i++){
            this.addevent(cfg.events[i]);
        }
        for(item in callbacks){
            for(i = 0;i<this.events.length;i++){
                if(item === this.events[i].name){
                    console.log(item + " is an fsm's event! can't be defined!");
                    break;
                }
            }
            this[item] = callbacks[item];
        }
    };
    fsm.prototype.addevent = function(e){
        if(!e.to || !e.name ||typeof e.to !== 'string'|| typeof e.name !== 'string'){
            console.log(this.name + ' error event!');
            return;
        }
        var from = (e.from instanceof Array) ? e.from : (e.from ? [e.from] : [null]);
        e.from = from;
        this.generateCallback(e);
        this.events.push(e);
    }
    fsm.prototype.removeevent = function(){
        for(n = 0;n < this.removelist.length;n++){
            for(i = 0;i<this.events.length;i++){
                if(this.events[i].name === this.removelist[n]){
                    delete this[this.events[i].name];
                    this.events.pop(this.events[i]);
                    this.removelist.pop(this.removelist[n]);
                    return;
                }
            }
        }
    };
    fsm.prototype.remove = function(eventname){
        if(typeof eventname === 'string')
            this.removelist.push(eventname);
    };
    fsm.prototype.generateCallback = function(e){
        this[e.name] = function(){
            var current = this.current;
            var cheakEvent = function(eventfrom){
                if(eventfrom instanceof Array){
                    for(i = 0; i < eventfrom.length ;i++){
                        if(eventfrom[i] === null)
                            return true;
                        if(current === eventfrom[i])
                            return true;
                    }
                }
                return false;
            }
            if(!cheakEvent(e.from)){
                console.log('Error fromState!    in ' + this.name);
                return;
            }
            if(this['onbefore'+e.name] instanceof Function)
                this['onbefore'+e.name]();
            if(this['onexit'+this.current] instanceof Function)
                this['onexit'+this.current]();
            this.current = e.to;//do some other thing
            console.log(this.name + " : " + this.current);
            if(this['onenter'+e.to] instanceof Function)
                this['onenter'+e.to]();
            if(this['onafter'+e.name] instanceof Function)
                this['onafter'+e.name]();
            this.removeevent();
        };
    };
    return function(name,cfg){return new fsm(name,cfg);};
})();