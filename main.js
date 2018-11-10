/** @type {WebGLRenderingContext} */
var GL;

const WEBGL_ID_DEFAULT = "webGL";
const EXPERIMENTAL_WEBGL = "experimental-webgl";

const FRAGMENT_SHADER_ID = "shader-fs";
const VERTEX_SHADER_ID = "shader-vs";

const FRAGMENT_SHADER_TYPE = "x-shader/x-fragment";
const VERTEX_SHADER_TYPE = "x-shader/x-vertex";

let counter_id = 0;

function getShader(id) {
    let shaderScript = document.getElementById(id);

    let code = "";
    let node = shaderScript.firstChild;
    while(node) {
        if(node.nodeType === 3){
            code += node.textContent;
        }
        node = node.nextSibling;
    }

    let shader;
    if (shaderScript.type == FRAGMENT_SHADER_TYPE){
        shader = GL.createShader(GL.FRAGMENT_SHADER);
    } else if ( shaderScript.type == VERTEX_SHADER_TYPE) {
        shader = GL.createShader(GL.VERTEX_SHADER);
    } else {
        return null;
    }

    GL.shaderSource(shader, code);
    console.log(code);
    GL.compileShader(shader);

    if (!GL.getShaderParameter(shader, GL.COMPILE_STATUS)) {
        console.log(GL.getShaderInfoLog(shader));
        console.log(GL.getShaderSource(shader));
        return null
    }

    return shader;
}

function WebGL(id){
    id = id || WEBGL_ID_DEFAULT;
    var canvasGL = document.getElementById(id);
    GL = canvasGL.getContext(EXPERIMENTAL_WEBGL);
    GL.VIEWPORT_WIDTH = canvasGL.width;
    GL.VIEWPORT_HEIGHT = canvasGL.height;

    function initShaders() {
        let fragmentShader = getShader(FRAGMENT_SHADER_ID);
        let vertexShader = getShader(VERTEX_SHADER_ID);

        console.log(fragmentShader);
        console.log(vertexShader);

        this.shaderProgram = GL.createProgram();
        console.log('asd',this.shaderProgram);
        GL.attachShader(this.shaderProgram, vertexShader);
        GL.attachShader(this.shaderProgram, fragmentShader);
        console.log(this.shaderProgram);
        GL.linkProgram(this.shaderProgram);


        if ( !GL.getProgramParameter(this.shaderProgram, GL.LINK_STATUS)) {
            alert("Tidak bisa menginisasi Shader");
        }

        GL.useProgram(this.shaderProgram);

        this.shaderProgram.vertexColorAttribute = GL.getAttribLocation(this.shaderProgram, "aVertexColor");
        console.log(this.shaderProgram.vertexColorAttribute);
        GL.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);
        
        this.shaderProgram.vertexPositionAttribute = GL.getAttribLocation(this.shaderProgram, "aVertexPosition");
        console.log(this.shaderProgram.vertexPositionAttribute);
        GL.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

        this.shaderProgram.vertexNormalAttribute = GL.getAttribLocation(this.shaderProgram, "aVertexNormals");
        console.log(this.shaderProgram.vertexNormalAttribute);
        GL.enableVertexAttribArray(this.shaderProgram.vertexNormalAttribute);

        this.shaderProgram.textureCoordAttribute = GL.getAttribLocation(this.shaderProgram, "aTextureCoord");
        GL.enableVertexAttribArray(this.shaderProgram.textureCoordAttribute);

        this.shaderProgram.pMatrixUniform = GL.getUniformLocation(this.shaderProgram, "uPMatrix");
        this.shaderProgram.mvMatrixUniform = GL.getUniformLocation(this.shaderProgram, "uMVMatrix");
        this.shaderProgram.nMatrixUniform = GL.getUniformLocation(this.shaderProgram, "uNMatrix");
        this.shaderProgram.samplerUniform = GL.getUniformLocation(this.shaderProgram, "uSampler");
        this.shaderProgram.useLightingUniform = GL.getUniformLocation(this.shaderProgram, "uUseLighting");
        this.shaderProgram.ambientColorUniform = GL.getUniformLocation(this.shaderProgram, "uAmbientColor");
        this.shaderProgram.lightingDirectionUniform = GL.getUniformLocation(this.shaderProgram, "uLightingDirection");
        this.shaderProgram.pointLightingLocationUniform = GL.getUniformLocation(this.shaderProgram, "uPointLightingLocation");
        this.shaderProgram.pointLightingColorUniform = GL.getUniformLocation(this.shaderProgram, "uPointLightingColor");
        this.shaderProgram.alphaUniform = GL.getUniformLocation(this.shaderProgram, "uAlpha");
        this.shaderProgram.shiniUniform = GL.getUniformLocation(this.shaderProgram, "uShininess");
    }
    initShaders = initShaders.bind(this);
    initShaders();

    this.mvMatrix = mat4.create();
    this.pMatrix = mat4.create();
    this.mvMatrixStack = [];

    this.object3dBuffer = [];

    GL.clearColor(0.0, 0.0, 0.0, 1.0);
    GL.enable(GL.DEPTH_TEST);
}

WebGL.prototype.mvPushMatrix = function() {
    let duplicate = mat4.create();
    mat4.copy(duplicate, this.mvMatrix);
    this.mvMatrixStack.push(duplicate);
}

WebGL.prototype.mvPopMatrix = function() {
    this.mvMatrix = this.mvMatrixStack.pop();   
}

WebGL.prototype.setMatrixUniform = function() {
    let normalMatrix = mat3.create();
    mat3.normalFromMat4(normalMatrix, this.mvMatrix);

    GL.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
    GL.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
    GL.uniformMatrix3fv(this.shaderProgram.nMatrixUniform, false, normalMatrix);
}

async function handleLoadedTexture(texture) {
    await GL.pixelStorei(GL.UNPACK_FLIP_Y_WEBGL, true);
    await GL.bindTexture(GL.TEXTURE_2D, texture);
    
    await GL.texImage2D(GL.TEXTURE_2D, 0, GL.RGBA, GL.RGBA, GL.UNSIGNED_BYTE, texture.image);
    await GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
    await GL.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
    
    texture.loaded = true;
}

WebGL.prototype.add = function(object3d) {
    let buffer = {}
    if(object3d.type === 'geometry') {
        buffer.id = object3d.id;

        buffer.obj3d = object3d;

        buffer.position = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, buffer.position);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(object3d.vertices), GL.STATIC_DRAW);
        buffer.position.itemSize = 3;
        buffer.position.numItems = object3d.vertices.length / buffer.position.itemSize;

        buffer.normal = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, buffer.normal);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(object3d.normals), GL.STATIC_DRAW);
        buffer.normal.itemSize = 3;
        buffer.normal.numItems = object3d.normals.length / buffer.normal.itemSize;

        buffer.indices = GL.createBuffer();
        GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer.indices);
        GL.bufferData(GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(object3d.indices), GL.STATIC_DRAW);
        buffer.indices.itemSize = 1;
        buffer.indices.numItems = object3d.indices.length / buffer.indices.itemSize;

        if(object3d.textureSrc !== undefined) {
            buffer.texture = GL.createTexture();
            buffer.texture.loaded = false;
            buffer.texture.image = new Image();
            buffer.texture.image.onload = function () {
                handleLoadedTexture(buffer.texture);
            }
            buffer.texture.image.src = object3d.textureSrc;
        } else {
            buffer.texture = GL.createTexture();
            buffer.texture.loaded = true;
            buffer.texture.image = new Image();
        }

        buffer.textureCoord = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, buffer.textureCoord);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(object3d.textureCoord), GL.STATIC_DRAW);
        buffer.textureCoord.itemSize = 2;
        buffer.textureCoord.numItems = object3d.textureCoord.length / buffer.textureCoord.itemSize;

        buffer.color = GL.createBuffer();
        GL.bindBuffer(GL.ARRAY_BUFFER, buffer.color);
        GL.bufferData(GL.ARRAY_BUFFER, new Float32Array(object3d.colors), GL.STATIC_DRAW);
        buffer.color.itemSize = 4;
        buffer.color.numItems = object3d.colors.length / buffer.color.itemSize;

        this.object3dBuffer.push(buffer);
    } else {
        GL.uniform1i(this.shaderProgram.useLightingUniform, 1);
        GL.uniform1f(this.shaderProgram.shiniUniform, 5.0);
        buffer.obj3d = object3d;

        this.object3dBuffer.push(buffer);
    }
}

var eventAfterRender = new CustomEvent('after-render');
var eventLightFollow = new CustomEvent('light-follow');

WebGL.prototype.render = function() {
    GL.viewport(0, 0, GL.VIEWPORT_WIDTH, GL.VIEWPORT_HEIGHT);
    GL.clear(GL.COLOR_BUFFER_BIT, GL.DEPTH_BUFFER_BIT);

    mat4.perspective(this.pMatrix, glMatrix.toRadian(45), GL.VIEWPORT_WIDTH/GL.VIEWPORT_HEIGHT, 0.1, 100.0)

    mat4.identity(this.mvMatrix);

    mat4.translate(this.mvMatrix, this.mvMatrix, [0.0, 0.0,-50.0])

    //console.log(this.object3dBuffer);

    for(let i = 0; i < this.object3dBuffer.length; i++) {
        this.mvPushMatrix();

        let o = this.object3dBuffer[i];

        if(o.obj3d.type === 'geometry') {
            var ev = new CustomEvent(o.id);

            document.dispatchEvent(ev);
            mat4.multiply(this.mvMatrix, this.mvMatrix, o.obj3d.matrixWorld);

            GL.bindBuffer(GL.ARRAY_BUFFER, o.position);
            GL.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, o.position.itemSize, GL.FLOAT, false, 0, 0);

            GL.bindBuffer(GL.ARRAY_BUFFER, o.color);
            GL.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, o.color.itemSize, GL.FLOAT, false, 0, 0);

            GL.bindBuffer(GL.ARRAY_BUFFER, o.normal);
            GL.vertexAttribPointer(this.shaderProgram.vertexNormalAttribute, o.normal.itemSize, GL.FLOAT, false, 0, 0);

            GL.bindBuffer(GL.ARRAY_BUFFER, o.textureCoord);
            GL.vertexAttribPointer(this.shaderProgram.textureCoordAttribute, o.textureCoord.itemSize, GL.FLOAT, false, 0, 0);

            if(o.textureSrc !== undefined){
                GL.activeTexture(GL.TEXTURE0);
                GL.bindTexture(GL.TEXTURE_2D, o.texture);
                GL.uniform1i(this.shaderProgram.samplerUniform, 0);
            }

            GL.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, o.indices);

            let temp = [];
            for(let i = 0; i < o.obj3d.vertices_.length; i++){
                temp.push(multiply(this.mvMatrix, o.obj3d.vertices_[i]));
            }
            o.obj3d.position = JSON.parse(JSON.stringify(temp));

            this.setMatrixUniform();

            GL.drawElements(GL.TRIANGLES, o.indices.numItems, GL.UNSIGNED_SHORT, 0);
        } else if (o.obj3d.type === 'ambient-light') {
            GL.uniform3f(this.shaderProgram.ambientColorUniform, o.obj3d.color.r, o.obj3d.color.g, o.obj3d.color.b);
        } else if (o.obj3d.type === 'point-light') {
            document.dispatchEvent(eventLightFollow);
            GL.uniform3f(this.shaderProgram.pointLightingLocationUniform, o.obj3d.position.x, o.obj3d.position.y, o.obj3d.position.z)
            GL.uniform3f(this.shaderProgram.pointLightingColorUniform, o.obj3d.color.r, o.obj3d.color.g, o.obj3d.color.b);
        }

        this.mvPopMatrix();

    }

    document.dispatchEvent(eventAfterRender);
}

function Geometry(){
    this.id = btoa(Math.random()).substring(0,12);
    this.matrixWorld = mat4.create();

    this.temporaryMatrixWorld = undefined;

    this.rotation = {
        _x : 0,
        _y : 0,
        _z : 0,
        updateMatrixWorld : function(deg, array) {
            mat4.rotate(this.matrixWorld, this.matrixWorld, glMatrix.toRadian(deg), array);
        }.bind(this)
    }
    Object.defineProperties(this.rotation, {
        x : {
            get : function () {
                return this._x;
            },

            set: function (value) {
                this._x = value;
                this.updateMatrixWorld(this._x, [1, 0, 0]);
            }
        },
        y : {
            get : function () {
                return this._y;
            },

            set: function (value) {
                this._y = value;
                this.updateMatrixWorld(this._y, [0, 1, 0]);
            }
        },
        z : {
            get : function () {
                return this._z;
            },

            set: function (value) {
                this._z = value;
                this.updateMatrixWorld(this._z, [0, 0, 1]);
            }
        },
    });

    this.translate = {
        to : [0, 0, 0],
        updateMatrixWorld : function() {
            mat4.translate(this.matrixWorld, this.matrixWorld, this.translate.to);
        }.bind(this)
    }
    Object.defineProperties(this.translate,{
        mat : {
            get : function () {
                return this.to;
            },
            set : function (value) {
                this.to = value;
                this.updateMatrixWorld();
            },
        },
    });

    this.move = {
        direction : [0, 0, 0],
        vector : function(value) {
            this.direction[0] += value[0];
            this.direction[1] += value[1];
            this.direction[2] += value[2];
            this.updateMatrixWorld();
        },
        updateMatrixWorld : function() {
            mat4.translate(this.matrixWorld, this.matrixWorld, this.move.direction);
        }.bind(this)
    }

}

Geometry.prototype.constructor = Geometry;

// Object.defineProperties(Geometry.prototype, {
//     rotation: {
//         configurable: true,
// 		enumerable: true,
//         value: this.rotation
//     },
// });

const BOX_GEOMETRY_FACE = 6;
const BOX_GEOMETRY_POINT = 4;

function BoxGeometry(depth, width, height, step = 1){
    Geometry.call(this);

    this.type = 'geometry';
    this.indices = [];
    this.vertices = [];
    this.vertices_ = [];
    this.normals = [];
    this.colors = [];
    this.textureCoord = [];
    this.textureSrc = undefined;
    this.position = [];

    this.step = step;

    var d = depth / 2;
    var w = width / 2;
    var h = height / 2;

    var counter = 0;
    for(let i = 0; i < BOX_GEOMETRY_FACE; i+=step, counter++){
        for(let j = 0; j < BOX_GEOMETRY_POINT; j++){
            var x = d, y = w, z = h;
            if(i & 4){ // LEFT RIGHT
                x *= (i&1)? -1 : 1;
                y *= (j&2)? 1 : -1;
                z *= (j&1)? 1 : -1;
                this.normals.push(1.0, 0, 0);
            } else if ( i & 2) { // BOTTOM TOP
                x *= (j&2)? 1 : -1;
                y *= (i&1)? -1 : 1;
                z *= (j&1)? 1 : -1;
                this.normals.push(0, 1.0, 0);
            } else { // FRONT BACK
                x *= (j&2)? 1 : -1;
                y *= (j&1)? 1 : -1;
                z *= (i&1)? -1 : 1;
                this.normals.push(0, 0, 1.0);
            }
            this.vertices.push(x, y, z);
            this.colors.push(0.0, 0.0, 0.0, 1.0);
        }
        var p = counter * BOX_GEOMETRY_POINT;
        var q = counter * BOX_GEOMETRY_POINT + 1;
        var r = counter * BOX_GEOMETRY_POINT + 2;
        var s = counter * BOX_GEOMETRY_POINT + 3;
        this.indices.push(p, q, r);
        this.indices.push(q, r, s);
    }

    for(let i = 0; i < BOX_GEOMETRY_FACE / 3; i++, counter++){
        for(let j = 0; j < BOX_GEOMETRY_POINT; j++){
            var x = d, y = w, z = h;
            if ( i & 2) { // BOTTOM TOP
                x *= (j&2)? 1 : -1;
                y *= (i&1)? -1 : 1;
                z *= (j&1)? 1 : -1;
            } else { // FRONT BACK
                x *= (j&2)? 1 : -1;
                y *= (j&1)? 1 : -1;
                z *= (i&1)? -1 : 1;
            }
            this.vertices_.push([x, y, z, 1.0]);
            this.position.push([x, y, z, 1.0]);
        }
    }
    console.log(this.vertices_);

    console.log(this.indices);
    console.log(this.normals);
    console.log(this.vertices);
}

BoxGeometry.prototype.constructor = BoxGeometry;

BoxGeometry.prototype.addTexture = function(src) {
    this.textureSrc = src;
    for(let i = 0; i < BOX_GEOMETRY_FACE; i+=this.step){
        this.textureCoord.push(0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0);
    }
}

BoxGeometry.prototype.render = function() {
    this.temporaryMatrixWorld = this.matrixWorld;
    document.addEventListener(this.id, this.action.bind(this));
}

function RGeometry(depth, width, height, color = new Color("0x156289")) {
    Geometry.call(this);

    this.type = 'geometry';
    var w = width || 3;
    var h = height || 6;
    var d = depth || 1;

    this.vertices = [
        0, h,       d,
        w, h,       d,
        0, h-(h/6), d,
        w, h-(h/6), d,

        w-(w/3.0),h-(h/6)  , d,
        w        ,h-(2*h/6), d,
        w-(w/3.0),h-(2*h/6), d,

        w-(2*w/3.0),h-(h/6)  , d,
        0          ,h-(2*h/6), d,
        w-(2*w/3.0),h-(2*h/6), d,

        0, h-(3*h/6), d,
        w, h-(3*h/6), d,

        w-(2*w/3.0),h-(3*h/6), d,
        0          ,0        , d,
        w-(2*w/3.0),0        , d,

        w-(w/3.0),0        , d,
        w        ,0        , d,
        w-(w/3.0),h-(3*h/6), d,
        //------------------------
        0 ,h      ,0, 
        w ,h      ,0, 
        0 ,h-(h/6),0, 
        w ,h-(h/6),0, 

        w-(w/3.0),h-(h/6)  , 0, 
        w        ,h-(2*h/6), 0, 
        w-(w/3.0),h-(2*h/6), 0, 

        w-(2*w/3.0), h-(h/6)  , 0, 
        0          , h-(2*h/6), 0, 
        w-(2*w/3.0), h-(2*h/6), 0, 

        0, h-(3*h/6), 0, 
        w, h-(3*h/6), 0, 

        w-(2*w/3.0),h-(3*h/6), 0, 
        0          ,0        , 0, 
        w-(2*w/3.0),0        , 0, 

        w-(w/3.0),0        , 0, 
        w        ,0        , 0, 
        w-(w/3.0),h-(3*h/6), 0, 
    ];

    this.indices = [
        // FRONT
        0,1,2, 2,1,3,
        3,4,5, 6,4,5,
        2,7,8, 8,9,7,
        8,5,10,  10,5,11,
        10,12,13,  13,12,14,
        12,15,16,  16,17,12,
        // BACK
        18,19,20,  20,19,21,
        21,22,23,  24,22,23,
        20,25,26,  26,27,25,
        26,23,28,  28,23,29,
        28,30,31,  31,30,32,
        30,33,34,  34,35,30,
        // SAMPING KANAN
        1,19,29,  29,11,1,
        11,29,35,  35,17,11,
        17,35,34,  34,16,17,
        // SAMPING KIRI
        0,18,31,  31,13,0,
        // BAWAH
        13,31,14,  14,32,31,
        15,33,16,  16,34,33,
        // ATAS
        0,18,1,  1,19,18,
        // BOLONG
        14,32,30,  30,12,14,
        15,33,30,  30,12,15,
        // BOLONG KOTAK
        7,25,9,  9,27,25,
        4,22,6,  6,24,22,
        7,25,4,  4,22,25,
        9,27,6,  6,24,27,
    ];
    this.position = [
        [0, h,       d, 1],
        [w, h,       d, 1],
        [0, h-(h/6), d, 1],
        [w, h-(h/6), d, 1],
        [w-(w/3.0),h-(h/6)  , d, 1],
        [w        ,h-(2*h/6), d, 1],
        [w-(w/3.0),h-(2*h/6), d, 1],
        [w-(2*w/3.0),h-(h/6)  , d, 1],
        [0          ,h-(2*h/6), d, 1],
        [w-(2*w/3.0),h-(2*h/6), d, 1],
        [0, h-(3*h/6), d, 1],
        [w, h-(3*h/6), d, 1],
        [w-(2*w/3.0),h-(3*h/6), d, 1],
        [0          ,0        , d, 1],
        [w-(2*w/3.0),0        , d, 1],
        [w-(w/3.0),0        , d, 1],
        [w        ,0        , d, 1],
        [w-(w/3.0),h-(3*h/6), d, 1],
        [0 ,h      , 0, 1],
        [w ,h      , 0, 1], 
        [0 ,h-(h/6), 0, 1], 
        [w ,h-(h/6), 0, 1], 
        [w-(w/3.0),h-(h/6)  , 0, 1], 
        [w        ,h-(2*h/6), 0, 1], 
        [w-(w/3.0),h-(2*h/6), 0, 1], 
        [w-(2*w/3.0), h-(h/6)  , 0, 1], 
        [0          , h-(2*h/6), 0, 1], 
        [w-(2*w/3.0), h-(2*h/6), 0, 1], 
        [0, h-(3*h/6), 0, 1], 
        [w, h-(3*h/6), 0, 1], 
        [w-(2*w/3.0),h-(3*h/6), 0, 1], 
        [0          ,0        , 0, 1], 
        [w-(2*w/3.0),0        , 0, 1], 
        [w-(w/3.0),0        , 0, 1], 
        [w        ,0        , 0, 1], 
        [w-(w/3.0),h-(3*h/6), 0, 1],
    ]
    this.vertices_ = Object.assign([], this.position);
    this.normals = [];
    this.textureCoord = [];
    for(let i = 0; i < this.vertices.length / 3; i++){
        this.textureCoord.push(0.0, 0.0);
    }
    for(let i = 0; i < this.vertices.length / 6; i++){
        this.normals.push(0.0, 0.0, 1.0);
    }
    for(let i = 0; i < this.vertices.length / 6; i++){
        this.normals.push(0.0, 1.0, 0.0);
    }
    this.colors = []
    for(let i = 0; i < this.vertices.length / 3; i++){
        this.colors.push(color.r / 255, color.g / 255, color.b/ 255, 1.0);
    }
    console.log(this.colors);

    this.textureSrc = undefined; //'Crate.jpg';
}

RGeometry.prototype.constructor = RGeometry;

RGeometry.prototype.render = function() {
    this.temporaryMatrixWorld = Object.assign({}, this.matrixWorld);
    document.addEventListener(this.id, this.action.bind(this));
}

RGeometry.prototype.findCenter = function() {
    let center = [0, 0, 0];
    for(let i = 0; i < this.position.length; i++){
        center[0] += this.position[i][0];
        center[1] += this.position[i][1];
        center[2] += this.position[i][2];
    }
    center[0] /= this.position.length;
    center[1] /= this.position.length;
    center[2] /= this.position.length;
    return center;
}

function Color(hex){
    if(hex.charAt(0) == '0' && hex.charAt(1) === 'x'){
        hex = hex.substr(2);
    }
    let values = hex.split('');
    this.r = parseInt(values[0].toString() + values[1].toString(), 16);
    this.g = parseInt(values[2].toString() + values[3].toString(), 16);
    this.b = parseInt(values[4].toString() + values[5].toString(), 16);
}

function AmbientLight(color, intensity = 0.2) {
    this.type = 'ambient-light';
    this.color = {};
    console.log(color);
    this.color.r = (color.r - 0)/255 * intensity;
    this.color.g = (color.g - 0)/255 * intensity;
    this.color.b = (color.b - 0)/255 * intensity;
}

function PointLight(color, position) {
    this.type = 'point-light';
    this.color = {};
    this.color.r = (color.r - 0)/255;
    this.color.g = (color.g - 0)/255;
    this.color.b = (color.b - 0)/255;
    this.position = position;
}

function multiply(a,b) {
    let c1,c2,c3,c4;
    c1 = a[0]*b[0] + a[4]*b[1] + a[8]*b[2] + a[12]*b[3]
    c2 = a[1]*b[0] + a[5]*b[1] + a[9]*b[2] + a[13]*b[3]
    c3 = a[2]*b[0] + a[6]*b[1] + a[10]*b[2] + a[14]*b[3]
    c4 = a[3]*b[0] + a[7]*b[1] + a[11]*b[2] + a[15]*b[3]
    return [c1,c2,c3,c4]
}



var rotater = 1;
var dir = [1, 1, 1];

class CollisionDetector{
    constructor(box, r){
        this.box = box;
        this.r = r;

        this.THRESHOLD = 0.05;
    }

    buildCollider(){
        let point = this.box.position;
        this.BACK = this.planeFromPoint(point[2], point[3], point[6]);
        this.FRONT = this.planeFromPoint(point[1], point[4], point[5]);
        this.RIGHT = this.planeFromPoint(point[1], point[3], point[5]);
        this.LEFT = this.planeFromPoint(point[0], point[2],point[4]);
        this.BOTTOM = this.planeFromPoint(point[1], point[2], point[3]);
        this.TOP = this.planeFromPoint(point[4], point[5], point[6]);
    }

    planeFromPoint(A, B, C) {
        let n = [], temp = [], temp2 = []
        temp = vec3.subtract(temp,B,A)
        temp2= vec3.subtract(temp2,C,B)
        n = vec3.cross(n,temp,temp2)

        let D = 0;
        D = vec3.dot(n.map(x =>-x), A)
        // Equation = n_x X + n_y Y + n_z Z - D = 0
        return n.concat(D)
    }

    distancePointToPlane(planeEq, point) {
        let new_point = point;
        let num = Math.abs(
            planeEq[0]*new_point[0] + 
            planeEq[1]*new_point[1] + 
            planeEq[2]*new_point[2] + planeEq[3])
        let denum = Math.sqrt(planeEq.slice(0,3).map(x => x*x).reduce((a,b) => a+b, 0))
        return num/denum
    }

    detect(){
        let pos = this.r.position;
        for(let i = 0; i < pos.length; i++){
            if(this.distancePointToPlane(this.TOP, pos[i]) < this.THRESHOLD && dir[1] > 0) {dir[1] *= -1; rotater *= -1; console.log("TOP"); return;}
            if(this.distancePointToPlane(this.TOP, pos[i]) < this.THRESHOLD && dir[1] < 0) {return;}
        }
        for(let i = 0; i < pos.length; i++){
            if(this.distancePointToPlane(this.BOTTOM, pos[i]) < this.THRESHOLD && dir[1] < 0) {dir[1] *= -1; rotater *= -1; console.log("BOTTOM"); return;}
            if(this.distancePointToPlane(this.BOTTOM, pos[i]) < this.THRESHOLD && dir[1] > 0) {return;}
        }
        for(let i = 0; i < pos.length; i++){
            if(this.distancePointToPlane(this.FRONT, pos[i]) < this.THRESHOLD && dir[2] > 0) {dir[2] *= -1; rotater *= -1; console.log("FRONT");
                console.log('a',this.box.position);
                console.log('b',this.r.position)
            return;}
            if(this.distancePointToPlane(this.FRONT, pos[i]) < this.THRESHOLD && dir[2] < 0) {return;}
        }
        for(let i = 0; i < pos.length; i++){
            if(this.distancePointToPlane(this.BACK, pos[i]) < this.THRESHOLD && dir[2] < 0) {dir[2] *= -1; rotater *= -1; console.log("BACK"); return;}
            if(this.distancePointToPlane(this.BACK, pos[i]) < this.THRESHOLD && dir[2] > 0) {return;}
        }
        for(let i = 0; i < pos.length; i++){
            if(this.distancePointToPlane(this.RIGHT, pos[i]) < this.THRESHOLD && dir[0] > 0) {dir[0] *= -1; rotater *= -1; console.log("RIGHT"); return;}
            if(this.distancePointToPlane(this.RIGHT, pos[i]) < this.THRESHOLD && dir[0] < 0) {return;}
        }
        for(let i = 0; i < pos.length; i++){
            if(this.distancePointToPlane(this.LEFT, pos[i]) < this.THRESHOLD && dir[0] < 0) {dir[0] *= -1; rotater *= -1; console.log("LEFT"); return;}
            if(this.distancePointToPlane(this.LEFT, pos[i]) < this.THRESHOLD && dir[0] < 0) {return;}
        }
    }
}