
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

    this.textureSrc = undefined; //'Crate.jpg';
}

RGeometry.prototype.constructor = RGeometry;

RGeometry.prototype.render = function() {
    this.temporaryMatrixWorld = Object.assign({}, this.matrixWorld);
    document.addEventListener(this.id, this.action.bind(this));
}

RGeometry.prototype.findCenter = function() {
    let center = [0, 0, 0];
    for(let i = 0; i < this.position.length / 2; i++){
        center[0] += this.position[i][0];
        center[1] += this.position[i][1];
        center[2] += this.position[i][2];
    }
    center[0] /= this.position.length / 2;
    center[1] /= this.position.length / 2;
    center[2] /= this.position.length / 2;
    return center;
}

RGeometry.prototype.action = function() {

}