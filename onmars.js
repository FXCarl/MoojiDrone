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
app.scene.gammaCorrection = pc.GAMMA_SRGBFAST;

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
    url: "follow.js",
    type: "script"
},{
    url: "terrain.js",
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
}];

// Handle initialize
var count = requests.length;
var assets = [];
for (var i = 0; i < requests.length; i++) {
    app.assets.loadFromUrl(requests[i].url, requests[i].type, function (err, asset) {
        count--;
        if (count === 0) {

            // Set up camera behavior
            camera.addComponent('script');
            camera.script.create('follow',{
                attributes:{
                    target: entity,
                    distance: 50
                }
            });
            
            // build up terrain mesh
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
            groundMat = ground.model.model.getMaterials()[0];
            groundMat.diffuseMap = groundTex.resource;
            groundMat.update();

            // Set up entity behavior
            var angle = 135;
            var radius = 3;
            var height = 0;//1.1;
            app.on("update", function (dt) {
                angle += 30*dt;
                if (angle > 360) {
                    angle -= 360;
                }
                entity.setLocalPosition(radius * Math.sin(angle*pc.math.DEG_TO_RAD), height, radius * Math.cos(angle*pc.math.DEG_TO_RAD));
                entity.setLocalEulerAngles(0, angle+90, 0);
            });
        }
    });
};

// Add Entities into the scene hierarchy
app.root.addChild(camera);
app.root.addChild(lightDir);
app.root.addChild(ground);
app.root.addChild(entity);