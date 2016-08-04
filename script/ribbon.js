var Ribbon = pc.createScript('ribbon');
Ribbon.attributes.add('lifetime',{
    type: 'number',
    default: 5
});
Ribbon.attributes.add('xoffset',{
    type: 'number',
    default: -0.5
});
Ribbon.attributes.add('yoffset',{
    type: 'number',
    default: 0.5
});
Ribbon.attributes.add('height',{
    type: 'number',
    default: 0.4
});
// initialize code called once per entity
Ribbon.prototype.initialize = function() {
    this.timer = 0;
    // The node generating this ribbon
    this.node = null;
    // The generated ribbon vertices
    this.vertices = [];
    this.uvs = [];
    // Vertex array to receive ribbon vertices
    var MAX_VERTICES = 600;
    var VERTEX_SIZE = 4;
    this.vertexData = new Float32Array(MAX_VERTICES * VERTEX_SIZE);
    this.model = null;
    var shaderDefinition = {
        attributes: {
            aPositionAge: pc.SEMANTIC_POSITION
        },
        vshader: [
            "attribute vec4 aPositionAge;",
            "",
            "uniform mat4 matrix_viewProjection;",
            "uniform float trail_time;",
            "varying float vAge;",
            "",
            "void main(void)",
            "{",
            "    vAge = trail_time - aPositionAge.w;",
            "    gl_Position = matrix_viewProjection * vec4(aPositionAge.xyz, 1.0);",
            "}"
        ].join("\n"),
        fshader: [
            "precision mediump float;",
            "varying float vAge;",
            "",
            "uniform float trail_lifetime;",
            "",
            "vec3 rainbow(float x)",
            "{",
                "float level = floor(x * 6.0);",
                "float r = float(level <= 2.0) + float(level > 4.0) * 0.5;",
                "float g = max(1.0 - abs(level - 2.0) * 0.5, 0.0);",
                "float b = (1.0 - (level - 4.0) * 0.5) * float(level >= 4.0);",
                "return vec3(1, 1, 1);",
            "}",
            "void main(void)",
            "{",
            "    gl_FragColor = vec4(rainbow(vAge / trail_lifetime), (1.0 - (vAge / trail_lifetime)) * 0.5);",
            "}"
        ].join("\n")
    };
    var shader = new pc.Shader(this.app.graphicsDevice, shaderDefinition);
    var material = new pc.Material();
    material.setShader(shader);
    material.setParameter('trail_time', 0);
    material.setParameter('trail_lifetime', this.lifetime);
    material.cull = pc.CULLFACE_NONE;
    material.blendType = pc.BLEND_ADDITIVEALPHA;
    material.depthWrite = false;
    // Create the vertex format
    var vertexFormat = new pc.VertexFormat(this.app.graphicsDevice, [
        { semantic: pc.SEMANTIC_POSITION, components: 4, type: pc.ELEMENTTYPE_FLOAT32 }
    ]);
    // Create a vertex buffer
    var vertexBuffer = new pc.VertexBuffer(this.app.graphicsDevice, vertexFormat, MAX_VERTICES, pc.USAGE_DYNAMIC);
    var mesh = new pc.Mesh();
    mesh.vertexBuffer = vertexBuffer;
    mesh.indexBuffer[0] = null;
    mesh.primitive[0].type = pc.PRIMITIVE_TRISTRIP;
    var node = new pc.GraphNode();
    var meshInstance = new pc.MeshInstance(node, mesh, material);
    meshInstance.aabb = new pc.BoundingBox(this.entity.getPosition(),new pc.Vec3());
    meshInstance.layer = pc.LAYER_WORLD;
    meshInstance.visible = true;
    this.model = new pc.Model();
    this.model.graph = node;
    this.model.meshInstances.push(meshInstance);
    this.node = this.entity;
};
Ribbon.prototype.reset = function(){
    this.timer = 0;
    this.vertices = [];
    this.uvs = [];
};
Ribbon.prototype.spawn = function(){
    var node = this.node;
    var pos = node.getPosition();
    var yaxis = new pc.Vec3().cross(node.up,node.forward);
    yaxis.scale(this.height);
    var s = this.xoffset;
    var e = this.yoffset;
    this.vertices.unshift({
        spawnTime: this.timer,
        vertexPair: [
            pos.x + yaxis.x * s, pos.y + yaxis.y * s, pos.z + yaxis.z * s, 
            pos.x + yaxis.x * e, pos.y + yaxis.y * e, pos.z + yaxis.z * e
        ]
    });
};
Ribbon.prototype.clearOld = function(){
    for (var i = this.vertices.length - 1; i >= 0; i--) {
        var vp = this.vertices[i];
        if (this.timer - vp.spawnTime >= this.lifetime) {
            this.vertices.pop();
            this.uvs.pop();
        } else {
            return;
        }
    }
};
Ribbon.prototype.copyToArrayBuffer = function(){
    for (var i = 0; i < this.vertices.length; i++) {
        var vp = this.vertices[i];
        this.vertexData[i * 8 + 0] = vp.vertexPair[0];
        this.vertexData[i * 8 + 1] = vp.vertexPair[1];
        this.vertexData[i * 8 + 2] = vp.vertexPair[2];
        this.vertexData[i * 8 + 3] = vp.spawnTime;
        this.vertexData[i * 8 + 4] = vp.vertexPair[3];
        this.vertexData[i * 8 + 5] = vp.vertexPair[4];
        this.vertexData[i * 8 + 6] = vp.vertexPair[5];
        this.vertexData[i * 8 + 7] = vp.spawnTime;
        this.uvs.push((vp.vertexPair[0] + vp.vertexPair[3]) * 0.5,(vp.vertexPair[2] + vp.vertexPair[5]) * 0.5);
    }
};
Ribbon.prototype.updateNumActive = function(){
    this.model.meshInstances[0].mesh.primitive[0].count = this.vertices.length * 2;
    this.model.meshInstances[0].aabb = new pc.BoundingBox(this.entity.getPosition(),new pc.Vec3());
};
// update code called every frame
Ribbon.prototype.update = function(dt) {
    this.timer += dt;
    var material = this.model.meshInstances[0].material;
    material.setParameter('trail_time', this.timer);
    this.clearOld();
    this.spawn();
    if (this.vertices.length > 1) {
        this.copyToArrayBuffer();
        this.updateNumActive();
        var vertexBuffer = this.model.meshInstances[0].mesh.vertexBuffer;
        var vertices = new Float32Array(vertexBuffer.lock());
        vertices.set(this.vertexData);
        vertexBuffer.unlock();
        if (!this.app.scene.containsModel(this.model)) {
            this.app.scene.addModel(this.model);
        }
    } 
    else {
        if (this.app.scene.containsModel(this.model)) {
            this.app.scene.removeModel(this.model);
        }
    }
};
// swap method called for script hot-reloading
// inherit your script state here
Ribbon.prototype.swap = function(old) {
};
// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/