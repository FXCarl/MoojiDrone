var canvas = document.getElementById("application-canvas");
var app;
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
                /*{
                    url: "script/EventInput.js",
                    type: "script"
                },*/ {
                    url: "script/Physics.js",
                    type: "script"
                },{
                    url: "script/PeilinNoise.js",
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
                    url: "script/targetCruise.js",
                    type: "script"
                },{
                    url: "script/follow.js",
                    type: "script"
                },{
                    url: "script/terrain.js",
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
                
                //generate and initial terrian + sceneItem + camera + light
                //initialize scene
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
               
                //Sync agentList + create gaming plane
            },
            onafterlogged:function(){
                this.addevent({name:'jumpin',from:'pregamescene',to:'gaming'});
            },
            onbeforelogfailed:function(){console.log('Login Failed!Please cheack your username or passweord!');},
            onbeforejumpin:function(){
                //show gameUI
                
            },
            onafterjumpin:function(){
                this.addevent({name:'timeover',from:'gaming',to:'endmenu'});
                this.addevent({name:'return',from:['gaming','endmenu'],to:'pregamescene'});
            },
            onbeforereturn:function(){
                //show pregamesceneUI
                
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