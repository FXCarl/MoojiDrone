var canvas = document.getElementById("application-canvas");

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

// Set the canvas to fill the window and automatically change resolution to be the same as the canvas size
app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
app.setCanvasResolution(pc.RESOLUTION_AUTO);

// No Project Config
// No Pre Load - Loading Screen
// No Scene Load
// So Direct Start
app.start();
app.scene.gammaCorrection = pc.GAMMA_SRGB;
app.scene.ambientLight = new pc.Color(0.85, 0.73, 0.6);

// Create an Entity with a camera component
var camera = new pc.Entity();
camera.addComponent("camera", {
    clearColor: new pc.Color(0,0,0)
});

camera.rotateLocal(-45, 0, 0);
camera.translateLocal(0, 0, 5);
camera.addComponent("audiolistener");

// Create an Entity for the ground
var ground = new pc.Entity();
// Create walking dude
var entity = new pc.Entity();

var friendList = new pc.Entity();

//create UI bodies
var ui = new pc.Entity();
var mainMenu = new pc.Entity();
var game = new pc.Entity();

// Create an Entity with a light component
var lightDir = new pc.Entity();
lightDir.addComponent("light", {
    type: "directional",
    color: new pc.Color(1, 1, 1),
    intensity: 1.2
});
lightDir.setLocalPosition(2, 2, -2);
lightDir.setLocalEulerAngles(45, 90, 0);

// All Assets Reqs
var requests = [{
    url: "script/EventInput.js",//————————————————————————————————Game
    type: "script"
},{
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
    url: "res/drone/drone.json",
    type: "model"
},{
    url: "script/follow.js",
    type: "script"
},{
    url: "script/terrain.js",
    type: "script"
},{
    url: "res/Mars/height.png",
    type: "texture"
},{
    url: "res/Mars/4657685/MarsGround.json",
    type: "material"
},{
    url: "res/Mars/4657643/diffuse.jpg",
    type: "texture"
},{
    url: "UI/game.js",//————————————————————————————————————UI
    type: "script"
},{
    url: "UI/gameUi.js",
    type: "script"
},{
    url: "UI/mainMenu.js",
    type: "script"
},{
    url: "UI/main.js",
    type: "script"
}];

// Handle initialize
var count = requests.length;
var assets = [];
for (var i = 0; i < requests.length; i++) {
    app.assets.loadFromUrl(requests[i].url, requests[i].type, function (err, asset) {
        count--;
        if (count === 0) {
            //set up game body
            var root = app.root;
            root.addComponent('script');
            root.script.create('physics',{
                attributes:{
                    fixedStep: 0.01
                }
            });
            root.script.create('eventInput');
            
            //set up ui
            ui.name = 'UI';
            game.name = 'Game';
            mainMenu.name = 'MainMenu';

            ui.addComponent('script');
            mainMenu.addComponent('script');
            game.addComponent('script');

            ui.script.create('main',{
                attributes:{
                    minHeight: 570,
                    minWidth: 1070
                }
            });
            mainMenu.script.create('mainMenu');
            game.script.create('gameUi');
            game.script.create('game');
            

            // Set up camera behavior
            camera.addComponent('script');
            camera.script.create('follow',{
                attributes:{
                    target: entity,
                    distance: 15
                }
            });
            
            // build up terrain mesh
            var groundMat = app.assets.find("MarsGround.json");
            var groundTex = app.assets.find("diffuse.jpg");
            groundMat.resource.diffuseMap = groundTex.resource;
            groundMat.resource.update();

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
            
            // Set up entity behavior
            entity.name = "player";
            //add ribbon to entity
            entity.addComponent('script');

            entity.script.create('physicalbody',{
                attributes:{
                    mass: 1,
                    drag: 0.01
                }
            });
            
            entity.script.create('physicalDroneDrive',{
                attributes:{
                    Thrust: 50,
                    thrustDelta: 1000,
                    hoverHeight: 15,
                    headingVel: true
                }
            });
            entity.script.create('droneController',{
                attributes:{
                    speed: 20
                }
            }); 
            var planemodel = app.assets.find("drone.json");
            entity.addComponent("model", {
                type: 'asset',
                asset: planemodel
            });          
    
            // Add Entities into the scene hierarchy 
            app.root.addChild(camera);
            app.root.addChild(lightDir);
            app.root.addChild(entity);
            var another = entity.clone();
            another.name = "another";
            app.root.addChild(another);
            another.setPosition(1,1,1);
            app.root.addChild(ground);
            another.destroy();
            console.log(another);
        }
    });
};

app.root.addChild(ui);
ui.addChild(mainMenu);
ui.addChild(game);