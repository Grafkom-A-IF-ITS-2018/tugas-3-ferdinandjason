// Collision Detector

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
            if(this.distancePointToPlane(this.FRONT, pos[i]) < this.THRESHOLD && dir[2] > 0) {dir[2] *= -1; rotater *= -1; console.log("FRONT"); return;} 
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