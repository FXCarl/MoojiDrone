var canvas = document.getElementById("application-canvas");
var app;
var player;
var AgentList = [];//Local showed player List
var BulletList = [];

var Game = new stateMachine("Game",{
        events:[
            {name:'start',from:null,to:'connecting'}
        ],
        callbacks:{
            onbeforestart:function(){
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
                        if(count === 0)
                            console.log('loaded');
                    });
                };
            },
            onafterstart:function(){
                this.addevent({name:'connected',from:'connecting',to:'mainmenu'});
                this.addevent({name:'lostconnect',from:null,to:'connecting'});
            },
            onbeforeconnected:function(){
                //show mainmenu UI
                
                //set canvas
                app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
                app.setCanvasResolution(pc.RESOLUTION_AUTO);
                //generate and initial terrian + sceneItem + camera + light
                // Create an Entity with a camera component
                var camera = new pc.Entity();
                camera.name = 'Camera';
                camera.addComponent("camera", {
                    clearColor: new pc.Color(0,0,0)
                });
                camera.rotateLocal(-45, 0, 0);
                camera.translateLocal(0, 0, 5);
                camera.addComponent("audiolistener");
                app.root.addChild(camera);
                // Create an Entity with a light component
                var lightDir = new pc.Entity();
                lightDir.addComponent("light", {
                    type: "directional",
                    color: new pc.Color(1, 1, 1),
                    intensity: 1.2
                });
                lightDir.setLocalPosition(2, 2, -2);
                lightDir.setLocalEulerAngles(60, 60, 0);
                app.root.addChild(lightDir);
                app.root.addComponent('script');
                app.root.script.create('physics',{
                    attributes:{
                        fixedStep: 0.01
                    }
                });

                //generate Mars 
                var Mars = TerrianMaker();
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
               
                //Sync current agentList (include create gaming plane)
                SyncAgentList();
            },
            onafterlogged:function(){
                this.addevent({name:'jumpin',from:'pregamescene',to:'gaming'});
            },
            onbeforelogfailed:function(){
                console.log('Login Failed!Please cheack your username or passweord!');
            },
            onbeforejumpin:function(){
                //show gameUI
                
                //start control
                if(!app.root.script.eventInput)
                    app.root.script.create('eventInput');

                //generate current player
                var playerID = 0;//ask Serve to get agentID(by username?)
                player = new Agent(playerID);
                player.plane.entity.name = "player";
                player.plane.entity.script.create('droneController',{
                    attributes:{
                        speed: 30
                    }
                }); 
                //upload Player to server
                SyncAgentList();

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
            },
            onafterjumpin:function(){
                this.addevent({name:'timeover',from:'gaming',to:'endmenu'});
                this.addevent({name:'return',from:['gaming','endmenu'],to:'pregamescene'});
            },
            onbeforereturn:function(){
                if(player){
                    player.stateMachine.timeover();
                }
                //show pregamesceneUI
            },
            onbeforetimeover:function(){
                //show endmenu UI
            }
        }
    });

Game.start();
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


var SyncAgentList = function(){
        //connect Server and get serve List
    //var newlist = server.getAgentList();//have not nefined
    /*
    for(n=0;n<AgentList.count;n++){ //遍历本地列表，销毁本地多出的agent
        if(findAgentinListbyID(AgentList[n].id,newlist)){
            //update AgentList[n].position/action
        }else if(AgentList[n].id !== player.id){
            AgentList[n].stateMachine.timeover();
        }
    }
    for(n=0;n<newlist.count;n++){ //以服务器列表为准，添加本地没有的agent
        if(!findAgentinListbyID(newlist[n].id,AgentList)){
            var agent = newlist[n].copy();
            AgentList.push(agent);
            //or var agent = new Agent(newlist[n].id);
        }
    }
    */ 
    //compaire newlist/AgentList and destroy/generate/update Plane
    var findAgentinListbyID = function(id,list){
        for(i=0;i<list.count;i++){
            if(list[i].id === id)
                return true;
        }
        return false;
    }
    console.log("Synced AgentList");
};

//——————————————————————————factories
//generate new Agent  or  【ask serve to generate（and return myagent for control）】
var Agent = (function(){
    var agent = function(id){
        var age = this;
        age.stateMachine = new stateMachine('Agent',{
            initial:null,
            events:[
                {name:'born',from:null,to:'boot'},
                {name:'initialize',from:'boot',to:'alive'},
                {name:'timeover',from:'alive',to:'deletedata'},
                {name:'destroy',from:'deletedata',to:'boot'},
            ],
            callbacks:{
                onbeforeborn:function(){
                    age.ID = id;//ID from Server
                    age.plane = new Plane(age.ID);//set after planeMaker
                    age.leftTime = 200;
                },
                onafterborn:function(){
                    this.initialize();
                },
                onbeforetimeover:function(){
                    age.plane.stateMachine.timeover();
                },
                onaftertimeover:function(){
                    Game.timeover();
                    this.destroy();
                },
                onbeforedestroy:function(){
                    AgentList.pop(age);
                    if(age.ID === player.ID)
                        player = undefined;//是否可用这种方式舍弃全局变量的引用值？
                }
            }
        });
        age.stateMachine.born();
    }
    agent.prototype.getInput = function(input){
        //listen input and set plane or shoot bullet
        //input.shootcommand => generateBullet
    };
    //agent.prototype.commandPlane = function(){}//control plane or shoot
    return function(id,plane){
        var agen = new agent(id,plane);
        AgentList.push(agen);
        return agen;
    };
})();

var Plane = (function(){
    var plane = function(agentid){
        // Set PlaneID from agentList/or create a new plane id
        var plane = this;
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
                    plane.ID = agentid;
                    plane.entity = new pc.Entity();
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
                    /*plane.entity.script.create('ribbon',{
                        attributes:{
                            lifetime: 1,
                            xoffset: -0.5,
                            yoffset: 0.5,
                            height: 0.4
                        }
                    });*/
                    var planemodel = app.assets.find("drone.json");
                    plane.entity.addComponent("model");
                    plane.entity.model.model = planemodel.resource.clone();
                },
                onafterborn:function(){
                    this.initialize();
                },
                onbeforetimeover:function(){
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
        //add 2 world
        plane.stateMachine.born();
        app.root.addChild(this.entity);
    }
    return function(agentid){return new plane(agentid);};
})();

var Bullet = (function(){
    var bullet = function(agent,movedelta){
        var bule = this;
        bule.stateMachine = new stateMachine('bullet',{
            initial:null,
            events:[
                {name:'born',from:null,to:'boot'},
                {name:'initialized',from:'boot',to:'alive'},
                {name:'hit',from:'alive',to:'boom'},
                {name:'destroy',from:'boom',to:'boot'}
            ],
            callbacks:{
                onbeforeborn:function(){
                    bule.agentID = agent.ID;
                    bule.movedelta = movedelta;//move direction and speed
                    bule.entity = new pc.Entity();
                    bule.entity.setPosition(agent.Plane.entity.getPosition());//borned position
                },
                onafterborn:function(){this.initialized();}
            }
        });
    };
    return function(agent,movedelta){
        var bul = new bullet(agent,movedelta);
        BulletList.push(bul);
        return bul;
    };
})();