class Graph{

    countVertex;
    rGraph;
    adjac = new Array();
    vertex = new Array();
    vector = new Array();
    rVertex;
    firstColorVertex = "#69B8FF";
    secondColorVertex = "#ccc";
    orient;
    countClick = 0;
    clicked = 0;
    reflex = 0;

    constructor(maxVertex, minVertex, rGraph, rVertex, orient, clicked, reflex){
        this.countVertex = this.getRandomNumber(maxVertex, minVertex);
        this.rGraph = rGraph;
        this.adjac = this.getAdjac();
        this.rVertex = rVertex;
        this.orient = orient;
        this.clicked = clicked;
        this.reflex = reflex;
    }

    getRandomNumber(a, b) {
        return parseInt(Math.random() * (a - b) + b);
    }

    initAdjac(){
        for(var i = 0; i < this.countVertex; i++){
            this.adjac[i] = new Array();
        }
    }

    getAdjac(){
        this.initAdjac(); //инициализация двумерного массива для матрицы смежности для класса
        var adjac = new Array();
        for(var i = 0; i < this.countVertex; i++){
            adjac[i] = new Array();
        }

        //генерация матрицы смежности
        for(var i = 0; i < this.countVertex; i++){
            for(var j = 0; j < this.countVertex; j++){
                if(!this.reflex && i == j){
                    adjac[i][j] = 0;
                }else{
                    adjac[i][j] = this.getRandomNumber(0, 2);
                }
            }
        }
        console.log(adjac);
        return adjac;
    }

    createVertex(canvas){
        for(var i = 0; i < this.countVertex; i++){
            var fi = i * 2 * Math.PI / this.countVertex;;
            var x = parseInt(this.rGraph * Math.cos(fi) + canvas.width/2, 10);
            var y = parseInt(this.rGraph * Math.sin(fi) + canvas.height/2, 10);
            this.vertex[i] = new Vertex(x, y);
        }
    }

    drawVector(ctx, x1, y1, x2, y2, color){
        if(this.orient){
            var r = 20;
            var x = x2 - x1;
            var y = y2 - y1;

            var len = Math.sqrt(x*x+y*y); // узнали длину вектора

            var phi = Math.atan(y/x);
            if (x < 0) phi += Math.PI;
            if (x == 0 && y > 0) phi = Math.PI/2;
            if (x == 0 && y == 0) phi = 3*Math.PI/2; // узнали угол вектора

            x2 = x1 + (len - r) * Math.cos(phi);
            y2 = y1 + (len - r) * Math.sin(phi);
            len -= r; // укоротили вектор с одного конца

            x1 = x2 + (len - r) * Math.cos(phi+Math.PI);
            y1 = y2 + (len - r) * Math.sin(phi+Math.PI);
            len -= r; // укоротили вектор с другого конца

            x = x2 - x1; // пересчитали проекции
            y = y2 - y1;
            len = Math.sqrt(x*x+y*y); // пересчитали длину

            var h = 8; // длина наконечника стрелки
            var w = 3; // ширина наконечника стрелки

            var ny = (x1 - x2); // получаем вектор нормали к отривовываемому
            var nx = (y2 - y1);
            var nLen = Math.sqrt(nx * nx + ny * ny);
            nx = nx / nLen * w; // нормируем и сразу
            ny = ny / nLen * w; // домножаем на ширину наконечника

            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);


            var ox = x1 + (len - h) * Math.cos(phi); // смещаемся от конца вектора к началу
            var oy = y1 + (len - h) * Math.sin(phi); // на длину наконечника

            ctx.moveTo(x2, y2);
            ctx.lineTo(ox + nx, oy + ny);
            ctx.moveTo(x2, y2);
            ctx.lineTo(ox - nx, oy - ny);
            ctx.strokeStyle = color;
            ctx.stroke();
        }else{
            for(var i = 0; i < this.countVertex; i++){
                for(var j = 0; j < this.countVertex; j++){
                    if((this.adjac[i][j]) && (i != j)){
                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        ctx.lineWidth = 1.5;
                        ctx.strokeStyle = color;
                        ctx.stroke();
                    }
                }
            }
        }
    }

    drawCurve(canvas, x, y, r, startAngle, endAngle, anticlockwise, color){
        var ctx = canvas.getContext('2d');
        if(y > canvas.height/2){
            y += r;
        }else if(y == canvas.height/2 && x > canvas.width/2){
            x += r;
        }else if(y == canvas.height/2 && x < canvas.width/2){
            x -= r;
        }else{
            y -= r;
        }
        ctx.beginPath();

        ctx.arc(x, y, r, startAngle, endAngle, anticlockwise);
        ctx.fillStyle = color;
        ctx.stroke();
    }

    draw(canvas){
        var ctx = canvas.getContext('2d');
        var startAngle = 0;
        var endAngle = 2*Math.PI;
        var anticlockwise = true;
        // отрисовка ребер
        for(var i = 0; i < this.countVertex; i++){
            for(var j = 0; j < this.countVertex; j++){
                if((this.adjac[i][j]) && (i != j)){
                    this.drawVector(ctx, this.vertex[i].x, this.vertex[i].y, this.vertex[j].x, this.vertex[j].y, '#ccc');
                }else if((this.adjac[i][j]) && (i == j)){
                    this.drawCurve(canvas, this.vertex[i].x, this.vertex[i].y, 30, startAngle, endAngle, anticlockwise); //рисуем кривую
                }
            }
        }
        // отрисовка вершин
        for(var i = 0; i < this.countVertex; i++){
            this.vertex[i].draw(ctx, this.rVertex, startAngle, endAngle, anticlockwise, this.firstColorVertex);
        }
    }

    clear(canvas){
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    checkClick(x, y, canvas){
        if(!this.clicked){
            return 0;
        }
        let flag = false;
        for(let i = 0; i < this.countVertex; i++){
            if(this.vertex[i].checkAccess(x, y, this.rVertex)){
                flag = true;
                this.countClick++;
                if(this.countClick % 2 == 1 && !this.vertex[i].click){
                    let ctx = canvas.getContext('2d');
                    let startAngle = 0;
                    let endAngle = 2*Math.PI;
                    let anticlockwise = true;
                    this.vertex[i].click = true;
                    this.vertex[i].draw(ctx, this.rVertex, startAngle, endAngle, anticlockwise, this.secondColorVertex);
                    console.log(this.adjac);
                }else if(this.countClick % 2 == 0 && this.vertex[i].click){
                    let ctx = canvas.getContext('2d');
                    let startAngle = 0;
                    let endAngle = 2*Math.PI;
                    let anticlockwise = true;
                    this.vertex[i].click = false;
                    if(!this.adjac[i][i]){
                        this.adjac[i][i] = 1;
                        this.drawCurve(canvas, this.vertex[i].x, this.vertex[i].y, 30, startAngle, endAngle, anticlockwise); //рисуем кривую
                    }else{
                        this.adjac[i][i] = 0;
                        this.clear(canvas);
                        this.draw(canvas);
                    }
                    this.vertex[i].draw(ctx, this.rVertex, startAngle, endAngle, anticlockwise, this.firstColorVertex);
                    console.log(this.adjac);
                }else if(this.countClick % 2 == 0 && !this.vertex[i].click){
                    //ДВЕ ВЕРШИН ЗДЕСЬ
                    this.countClick = 0;
                    for(let j = 0; j < this.countVertex; j++){
                        if(this.vertex[j].click){
                            let ctx = canvas.getContext('2d');
                            let startAngle = 0;
                            let endAngle = 2*Math.PI;
                            let anticlockwise = true;
                            this.vertex[j].click = false;
                            this.vertex[j].draw(ctx, this.rVertex, startAngle, endAngle, anticlockwise, this.firstColorVertex);
                            if(this.adjac[j][i]){
                                //удаление ребра перестраиваем весь граф
                                this.adjac[j][i] = 0;
                                this.clear(canvas);
                                this.draw(canvas);
                            }else{
                                //добавление ребра

                                this.adjac[j][i] = 1;
                                this.drawVector(ctx, this.vertex[j].x, this.vertex[j].y, this.vertex[i].x, this.vertex[i].y, '#ccc');
                            }
                            console.log(this.adjac);
                        }
                    }
                }
                break;
            }
        }
        if(!flag){
            this.countClick = 0;
            this.clear(canvas);
            this.draw(canvas);
            for(let i = 0; i < this.countVertex; i++){
                this.vertex[i].click = false;
            }
        }
    }

}
