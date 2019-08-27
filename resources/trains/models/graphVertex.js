class Vertex {

    x;
    y;
    click;
    name;

    constructor(x = 0, y = 0, name) {
        this.x = x;
        this.y = y;
        this.click = false;
        this.name = name;
    }

    get x() {
        return this.x;
    }

    set x(x = 0) {
        this.x = 0;
    }

    get y() {
        return this.y;
    }

    set y(y = 0) {
        this.y = y;
    }

    get click() {
        return this.y;
    }

    set click(click) {
        this.click = click;
    }

    get name() {
        return this.name;
    }

    set name(name) {
        this.name = name;
    }

    draw(ctx, r = 10, startAngle = 0, endAngle, anticlockwise, color) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, startAngle, endAngle, anticlockwise);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = "#083560";
        ctx.font = 'bold 30px sans-serif';
        ctx.fillText(String.fromCharCode(this.name), this.x, this.y);
    }

    checkAccess(x, y, r) {
        if ((y - this.y) * (y - this.y) + (x - this.x) * (x - this.x) <= r * r) {
            return 1;
        } else {
            return 0;
        }
    }


}



// function Vertex(x = 0, y = 0){
//     this.x = x;
//     this.y = y;
//     this.click = false;
// }

// Vertex.prototype.draw = function(ctx, r = 10, startAngle = 0, endAngle, anticlockwise, color){
//     ctx.beginPath();
//     ctx.arc(this.x, this.y, r, startAngle, endAngle, anticlockwise);
//     ctx.fillStyle = color;
//     ctx.fill();
// }

// Vertex.prototype.checkAccess = function(x, y, r){
//     if((y - this.y) * (y - this.y) + (x - this.x) * (x - this.x) <= r*r){
//         return 1;
//     }else{
//         return 0;
//     }
// }