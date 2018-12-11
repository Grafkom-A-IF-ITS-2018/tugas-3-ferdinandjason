var eventRightClick = new CustomEvent('right-click');

var AMORTIZATION = 0.95;
var drag = false;
var old_x, old_y;
var dX = 0, dY = 0;
var THETA = 0, PHI = 0;

var mouseDown = function(e) {
    if(e.which === 1){
        drag = true;
        old_x = e.pageX, old_y = e.pageY;
        e.preventDefault();
        return false;
    } else if (e.which === 3){
        e.preventDefault();
        document.dispatchEvent(eventRightClick);
    }
};

var mouseUp = function(e){
    if(e.which ===  1){
        drag = false;
    }
};

var mouseMove = function(e) {
    if(e.which === 1){
        if (!drag) return false;
        dX = (e.pageX-old_x)*2*Math.PI/GL.VIEWPORT_WIDTH/2,
        dY = (e.pageY-old_y)*2*Math.PI/GL.VIEWPORT_HEIGHT/2;
        THETA+= dX;
        PHI+=dY;
        old_x = e.pageX, old_y = e.pageY;
        e.preventDefault();
    }
};

document.addEventListener("mousedown", mouseDown, false);
document.addEventListener("mouseup", mouseUp, false);
document.addEventListener("mouseout", mouseUp, false);
document.addEventListener("mousemove", mouseMove, false);
window.oncontextmenu = function (){
    return false;     // cancel default menu
}
