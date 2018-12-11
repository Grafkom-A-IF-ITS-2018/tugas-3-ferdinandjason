// Color, Light, and other

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
