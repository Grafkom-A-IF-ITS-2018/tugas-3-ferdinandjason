
const BOX_GEOMETRY_FACE = 6;
const BOX_GEOMETRY_POINT = 4;

function BoxGeometry(depth, width, height, step = 1, colored = false){
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
            if(colored) this.colors.push(1.0, 1.0, 1.0, 1.0);
            else this.colors.push(0.0, 0.0, 0.0, 1.0);
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

BoxGeometry.prototype.action = function() {
    
}