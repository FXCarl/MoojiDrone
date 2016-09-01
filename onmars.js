
var canvas;
var app;
var player;
var Mars;
var AgentList = [];//Local showed player List
var BulletList = [];
var Game;
var localgame;
var ui;

    canvas = document.getElementById("application-canvas");
    var clearagentlist = function(){
        if(AgentList.length > 0)//clear player List
        {
            for(i=0;i<AgentList.length;i++){
                if(AgentList[i] && AgentList[i].stateMachine.current === 'alive')
                    AgentList[i].stateMachine.aboard();
                delete AgentList[i];
            }
        }
    };
    var clearbulletlist = function(){
        if(BulletList.length > 0){
            for(i=0;i<BulletList.length;i++){
                if(BulletList[i] && BulletList[i].stateMachine.current === 'alive')
                    BulletList[i].stateMachine.destroy();
                delete BulletList[i];
            }
        }
    };

    var SyncAgentList = function(newlist){
        //compaire newlist/AgentList and destroy/generate/update Plane
        for(n=0;n<AgentList.length;n++){ //遍历本地列表，销毁本地多出的agent
            if(AgentList[n] && !newlist[n]){
                if(player && n === player.id)
                    continue;
                if(AgentList[n].stateMachine.current === 'alive')
                    AgentList[n].stateMachine.timeover();
            }
        }
        for(n=0;n< newlist.length ;n++){ //以服务器列表为准，添加本地没有的agent
            if(newlist[n] && !AgentList[n]){
                new Agent(n);
            }
        }
        console.log(AgentList);
    };

    var DownBulletList = function(){
        clearbulletlist();
        //var newlist = server.getBulletList();
        /*
        for(n=0;n<newlist.length;n++){
            if (null == newlist[n] || "object" != typeof newlist[n]) 
                continue;
            var bullet = newlist[n].constructor();
            for (var attr in newlist[n]) {
                if (newlist[n].hasOwnProperty(attr)) bullet[attr] = newlist[n][attr];
            }
            if(!BulletList[bullet.agentid])
                BulletList[bullet.agentid] = bullet;
        }
        */ 
    };
    var TerrianMaker = function(){
        // build up terrain mesh
        var ground = new pc.Entity();
        app.root.addChild(ground);
        var groundMat = app.assets.find("MarsGround.json");
        var groundHeight = app.assets.find("height.png");
        ground.addComponent("script");
        ground.script.create('terrain',{
            attributes:{
                heightMap: groundHeight,
                material: groundMat,
                minHeight: -100,
                width: 1200,
                depth: 1200,
                maxHeight: 0,
                subdivisions: 128
            }
        });
        var groundTex = app.assets.find("diffuse.jpg");
        if(ground.model){
            groundMat = ground.model.model.getMaterials()[0];
            groundMat.diffuseMap = groundTex.resource;
            groundMat.update();
        }
        return ground;
    };
    //——————————————————————————factories
    //generate new Agent  or  【ask serve to generate（and return myagent for control）】
    var Agent = (function(){
        var agent = function(ID){
            var age = this;
            age.id = ID;//ID from Server
            age.leftTime = 200;
            age.stateMachine = new stateMachine('Agent',{
                initial:null,
                events:[
                    {name:'born',from:null,to:'boot'},
                    {name:'initialize',from:'boot',to:'alive'},
                    {name:'timeover',from:'alive',to:'deletedata'},
                    {name:'aboard',from:'alive',to:'deletedata'},
                    {name:'destroy',from:'deletedata',to:'boot'},
                ],
                callbacks:{
                    onbeforeborn:function(){
                        age.plane = new Plane(age.id);//set after planeMaker
                    },
                    onafterborn:function(){
                        this.initialize();
                    },
                    onbeforetimeover:function(){
                        //timeover alert
                        age.plane.stateMachine.timeover();
                    },
                    onaftertimeover:function(){
                        //stop alert
                        if(player && age.id === player.id && age.id != -1)
                            Game.timeover();
                        this.destroy();
                    },
                    onbeforeaboard:function(){
                        age.plane.stateMachine.destroy();
                    },
                    onafteraboard:function(){
                        if(player && age.id === player.id && age.id != -1)
                            Game.return();
                        this.destroy();
                    },
                    onbeforedestroy:function(){
                        if(age.id >= 0 && AgentList[age.id]){
                            delete AgentList[age.id];
                        }
                        if(player && age.id === player.id){
                            var camera = app.root.findByName('Camera');
                            if(!camera.script||!camera.script.follow)
                                return;
                            camera.script.follow.target = null;
                            camera.setLocalPosition(0,25,-20);
                            player = undefined;//是否可用这种方式舍弃全局变量的引用值？
                        }
                    }
                }
            });
        }
        return function(id){
            var agen = new agent(id);
            if(id >= 0)
                AgentList[id] = agen;
            agen.stateMachine.born();
            return agen;
        };
    })();

    var Plane = (function(){
        var plane = function(agentid){
            // Set PlaneID from agentList/or create a new plane id
            var plane = this;
            plane.id = agentid;
            plane.entity = new pc.Entity();
            plane.entity.name = plane.id;
            plane.entity.addComponent('script');
            plane.entity.script.create('physicalbody',{
                attributes:{
                    mass: 1,
                    drag: 0.001
                }
            });
            plane.entity.script.create('physicalDroneDrive',{
                attributes:{
                    Thrust: 50,
                    hoverHeight: 3,
                }
            });
            plane.entity.script.create('droneController');
            var planemodel = app.assets.find("drone.json");
            plane.entity.addComponent("model");
            plane.entity.model.model = planemodel.resource.clone();
            //add 2 world
            app.root.addChild(plane.entity);
            //set PlaneFSM
            plane.stateMachine = new stateMachine('Plane',{
                initial:null,
                events:[
                    {name:'born',from:null,to:'boot'},
                    {name:'initialize',from:'boot',to:'alive'},
                    {name:'timeover',from:'alive',to:'boom'},
                    {name:'destroy',from:['boom','alive'],to:'boot'}
                ],
                callbacks:{
                    onbeforeborn:function(){
                        //collision for chk collider
                        plane.collision = null;
                    },
                    onafterborn:function(){
                        this.initialize();
                    },
                    onbeforetimeover:function(){
                        //Lost Control and Fall
                        //show boom effect
                    },
                    onaftertimeover:function(){
                        this.destroy();
                    },
                    onbeforedestroy:function(){
                        plane.entity.destroy();
                    }
                }
            });
        }
        return function(agentid){
            var pl = new plane(agentid);
            pl.stateMachine.born();
            return pl;
        };
    })();

    var Bullet = (function(){
        var bullet = function(agent,movedelta,hurtpower){
            var bule = this;
            bule.agentid = agent.id;
            bule.movedelta = movedelta;//move direction and speed
            bule.hurt = hurtpower;
            bule.entity = new pc.Entity();//bulletModel or ParticalEffect
            bule.target = [];//target.length > 0=>hit
            bule.stateMachine = new stateMachine('bullet',{
                initial:null,
                events:[
                    {name:'born',from:null,to:'boot'},
                    {name:'initialized',from:'boot',to:'alive'},
                    {name:'hit',from:'alive',to:'boom'},
                    {name:'destroy',from:['boom','alive'],to:'boot'}
                ],
                callbacks:{
                    onbeforeborn:function(){
                        bule.entity.setPosition(agent.Plane.entity.getPosition());//borned position
                        //add 2 world
                        app.root.addChild(bule.entity);
                        bule.collision = null;//collision for chk collider
                        bule.action = new Action(bule.hurt);
                    },
                    onafterborn:function(){this.initialized();},
                    onbeforehit:function(){
                        for(i=0;i<bule.target.length;i++){
                            bule.action.Execute(target[i].Lefttime);
                        }
                    },
                    onbeforedestroy:function(){
                        bule.entity.destroy();
                        if(bule.id >= 0 && BulletList[bule.agentid])
                            delete BulletList[bule.agentid];
                    }
                }
            });
        };
        return function(agent,movedelta){
            var bul = new bullet(agent,movedelta);
            bul.stateMachine.born();
            if(agent.id >= 0 && !BulletList[agent.id])
                BulletList[agent.id] = bul;
            return bul;
        };
    })();

    //Action is a act to do something
    var Action = (function(){
        var Action = function(effectDepth){
            this.effectDepth = effectDepth;
        };
        Action.prototype.Execute = function(aimdata){
            if(typeof aimdata === typeof this.effectDepth)
                aimdata -= this.effectDepth;
        };

        return function(effectDepth){
            return new Action(effectDepth);
        }
    })();
    
    var playerMaker = function(){
        //generate current player
        var player = new Agent(mycilent.id);
        // Set up camera behavior
        var camera = app.root.findByName('Camera');
        if(!camera.script)
            camera.addComponent('script');
        if(!camera.script.follow)
            camera.script.create('follow',{
                attributes:{
                    target: player.plane.entity,
                    distance: 25
                }
            });
        camera.script.follow.target = player.plane.entity;
        return player;
    };
    var initialplaneentity = function(){
            planeentity = new pc.Entity();
            planeentity.name = 'PlaneEntity';
            var planemodel = app.assets.find("drone.json");
            planeentity.addComponent("model");
            planeentity.model.model = planemodel.resource.clone();
            planeentity.addComponent('script');
            planeentity.script.create('physicalbody',{
                attributes:{
                    mass: 1,
                    drag: 0.001
                }
            });
            planeentity.script.create('physicalDroneDrive',{
                attributes:{
                    Thrust: 50,
                    hoverHeight: 3,
                }
            });
            planeentity.script.create('droneController');
            //add 2 world
            app.root.addChild(planeentity);
            //planeentity.enabled = false;
    };
var isonline = false;
$(document).ready(function(){
    //————————————————————————————————factory end————————————————————
    ui = new DroneUI();
    var localScene;
    localgame = new stateMachine("localgame",{
        initial:'boot',
        events:[
            {name:'start',from:'boot',to:'localgaming'},
            {name:'end',from:'localgaming',to:'destroy'},
            {name:'destroied',from:'destroy',to:'boot'}
        ],
        callbacks:{
            onbeforestart:function(){
                //chk and destroy
                clearagentlist();//clear agent List
                clearbulletlist();//clear bullets List
                //destroy MainGameScene
                if(Mars){Mars.destroy();Mars = undefined;}
                var lightDir = app.root.findByName('DirectLight')
                if(!lightDir){
                    lightDir = new pc.Entity();
                    lightDir.name = 'DirectLight';
                    lightDir.addComponent("light", {
                        type: "directional",
                        intensity: 1.2
                    });
                    lightDir.setLocalPosition(2, 2, -2);
                    lightDir.setLocalEulerAngles(60, 60, 0);
                    app.root.addChild(lightDir);
                }
                lightDir.light.color = new pc.Color(0, 0.5, 1);
                localScene = TerrianMaker();
                player = playerMaker();
            },
            onbeforeend:function(){
                localScene.destroy();
                //destroy other tags
                if(app.root.findByName('DirectLight')){
                    app.root.findByName('DirectLight').light.color = new pc.Color(1, 1, 1);
                }
                player.stateMachine.aboard();
            },
            onafterend:function(){this.destroied()}
        }
    });
    Game = new stateMachine("Game",{
            events:[
                {name:'start',from:null,to:'waitloading'},
                {name:'_2singlegame',from:null,to:'connecting'}
            ],
            callbacks:{
                onenterwaitloading:function(){
                    //start Loading
                    ui.stateMachine.born();
                    //create app
                    // Disable I-bar cursor on click+drag
                    canvas.onselectstart = function () { return false; };
                    var devices = createInputDevices(canvas);
                    // Create the application and start the update loop
                    app = new pc.Application(canvas, {
                        keyboard: devices.keyboard,
                        mouse: devices.mouse,
                        gamepads: devices.gamepads,
                        touch: devices.touch,
                        graphicsDeviceOptions: {
                            'alpha': false,
                            'preserveDrawingBuffer': false
                        }
                    });
                    // So Direct Start
                    app.start();
                    // No Project Config
                    // No Pre Load - Loading Screen
                    // No Scene Load
                    app.scene.gammaCorrection = pc.GAMMA_SRGB;
                    app.scene.ambientLight = new pc.Color(0.85, 0.73, 0.6);// Handle initialize
                    
                    //Loading
                    // All Assets Reqs
                    var requests = [//————————————————————————————————Game
                    {
                        url: "script/EventInput.js",
                        type: "script"
                    }, {
                        url: "script/Physics.js",
                        type: "script"
                    },{
                        url: "script/ribbon.js",//————————————————————————————————Player
                        type: "script"
                    },{
                        url: "script/physicalbody.js",
                        type: "script"
                    },{
                        url: "script/physicalDroneDrive.js",
                        type: "script"
                    },{
                        url: "script/DroneController.js",
                        type: "script"
                    },{
                        url: "script/follow.js",//——————————————————————————Camera
                        type: "script"
                    },{
                        url: "script/terrain.js",//—————————————————Terrain
                        type: "script"
                    },{
                        url: "res/drone/drone.json",
                        type: "model"
                    },{
                        url: "res/Mars/height.png",
                        type: "texture"
                    },{
                        url: "res/Mars/4657685/MarsGround.json",
                        type: "material"
                    },{
                        url: "res/Mars/4657643/diffuse.jpg",
                        type: "texture"
                    }
                    ];
                    var assets = [];
                    var count = requests.length;
                    for (var i = 0; i < requests.length; i++) {
                        app.assets.loadFromUrl(requests[i].url, requests[i].type, function (err, asset) {
                            count--;
                            if(count === 0){
                                Game._2singlegame();
                                socket.emit('newConnect',mycilent);//tell server a new connect
                            }
                        });
                    };
                },
                onbefore_2singlegame:function(){
                },
                onafter_2singlegame:function(){
                    this.addevent({name:'connected',from:'connecting',to:'mainmenu'});
                    Game.connected();
                },
                onenterconnecting:function(){
                    //changeUI
                    ui.stateMachine.startconnect();
                },
                onbeforeconnected:function(){
                    //set canvas
                    app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
                    app.setCanvasResolution(pc.RESOLUTION_AUTO);
                    //generate and initial terrian + sceneItem + camera + light
                    // Create an Entity with a camera component
                    var camera = app.root.findByName('Camera');
                    if(!camera){
                        camera = new pc.Entity();
                        camera.name = 'Camera';
                        camera.addComponent("camera", {
                            clearColor: new pc.Color(0,0,0)
                        });
                        camera.rotateLocal(-45, 0, 0);
                        camera.translateLocal(0, 0, 5);
                        camera.addComponent("audiolistener");
                        app.root.addChild(camera);
                    }
                    camera.setLocalPosition(0,25,-20);
                    if(!app.root.script){
                        app.root.addComponent('script');
                        app.root.script.create('physics',{
                            attributes:{
                                fixedStep: 0.01
                            }
                        });
                        app.root.script.create('eventInput');
                    }
                    //show mainmenu
                    //changeUI
                    ui.stateMachine.connected();
                    localgame.start();
                },
                onafterconnected:function(){
                    this.addevent({name:'userlog',from:'mainmenu',to:'login'});
                },
                onafteruserlog:function(){
                    this.addevent({name:'logged',from:'login',to:'pregamescene'});
                    this.addevent({name:'logfailed',from:'login',to:'mainmenu'});
                },
                onbeforelogged:function(){
                    //show pregamesceneUI
                    ui.stateMachine._2jump();
                    localgame.end();

                    // Create an Entity with a light component
                    var lightDir = app.root.findByName('DirectLight');
                    if(!lightDir){
                        lightDir = new pc.Entity();
                        lightDir.name = 'DirectLight';
                        lightDir.addComponent("light", {
                            type: "directional",
                            color: new pc.Color(1, 1, 1),
                            intensity: 1.2
                        });
                        lightDir.setLocalPosition(2, 2, -2);
                        lightDir.setLocalEulerAngles(60, 60, 0);
                        app.root.addChild(lightDir);
                    }
                    //generate Mars
                    if(!Mars)
                        Mars = TerrianMaker();
                },
                onafterlogged:function(){
                    this.addevent({name:'jumpin',from:'pregamescene',to:'gaming'});
                },
                onenterpregamescene:function(){
                    var camera = app.root.findByName('Camera');
                    if(camera){
                        camera.setLocalPosition(0,25,-20);
                        camera.script.follow.target = null;
                    }
                },
                onbeforelogfailed:function(){
                    console.log('Login Failed!Please cheack your username or passweord!');
                },
                onbeforejumpin:function(){
                    //show gameUI
                    ui.stateMachine.jumpin();
                    player = playerMaker();
                },
                onafterjumpin:function(){
                    this.addevent({name:'timeover',from:'gaming',to:'endmenu'});
                    this.addevent({name:'return',from:['gaming','endmenu'],to:'pregamescene'});
                },
                onbeforereturn:function(){
                    //show pregamesceneUI
                    ui.stateMachine._2jump();
                },
                onbeforetimeover:function(){
                    //show endmenu UI
                    ui.stateMachine.gameover();
                }
            }
        });
    Game.start();
});