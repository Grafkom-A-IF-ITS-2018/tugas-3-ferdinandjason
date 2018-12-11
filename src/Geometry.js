// Base Geometry Class

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
