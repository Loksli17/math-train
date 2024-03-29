class Graph {

    countVertex;
    rGraph;
    adjac = new Array();
    dist = new Array();
    incid = new Array();
    vertex = new Array();
    vector = new Array();
    rVertex;
    firstColorVertex = "#69B8FF";
    secondColorVertex = "#ccc";
    orient;
    countClick = 0;
    clicked = 0;
    reflex = 0;

    constructor(minVertex, maxVertex, rGraph, rVertex, orient, clicked, reflex) {
        this.countVertex = this.getRandomNumber(minVertex, maxVertex);
        this.rGraph = rGraph;
        this.rVertex = rVertex;
        this.orient = orient;
        this.adjac = this.getAdjac();
        this.clicked = clicked;
        this.reflex = reflex;
    }

    getRandomNumber(a, b) {
        return parseInt(Math.random() * (a - b) + b);
    }


    //мб стоит их объединить в одну функцию ХМММММ
    initAdjac() {
        for (var i = 0; i < this.countVertex; i++) {
            this.adjac[i] = new Array();
        }
    }

    initDist() {
        for (var i = 0; i < this.countVertex; i++) {
            this.dist[i] = new Array();
        }
    }

    initIncid() {
        for (var i = 0; i < this.countVertex; i++) {
            this.incid[i] = new Array();
        }
    }

    distance(a, b) {
        return Math.round(Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2)) / 10);
    }

    getDist() {
        this.initDist();
        for (var i = 0; i < this.countVertex; i++) {
            this.dist[i] = new Array();
        }

        for (var i = 0; i < this.countVertex; i++) {
            for (var j = 0; j < this.countVertex; j++) {
                if (this.adjac[i][j]) {
                    //евклидово расстояние ftw
                    this.dist[i][j] = this.distance(this.vertex[i], this.vertex[j]);

                    //добавление рёбер в массив рёбер
                    this.vector.push({
                        "start": this.vertex[i], //начальная вершина ребра
                        "dist": this.dist[i][j], //длина ребра
                        "end": this.vertex[j] //конечная вершина ребра
                    });


                } else {
                    this.dist[i][j] = 0;
                }
            }
        }
        console.log(this.dist);
    }

    removeDoubles() {
        for (let i = 0; i < this.vector.length; i++) {
            for (let j = i + 1; j < this.vector.length; j++) {
                if (this.vector[i].start == this.vector[j].end && this.vector[i].end == this.vector[j].start) {
                    this.vector.splice(j, 1);
                }
            }
        }
    }

    getAdjac() {
        this.initAdjac(); //инициализация двумерного массива для матрицы смежности для класса
        var adjac = new Array();
        for (var i = 0; i < this.countVertex; i++) {
            adjac[i] = new Array();
        }

        //генерация матрицы смежности
        for (var i = 0; i < this.countVertex; i++) {
            for (var j = 0; j < this.countVertex; j++) {
                if (!this.reflex && i == j) {
                    adjac[i][j] = 0;
                } else if (this.orient) {
                    adjac[i][j] = this.getRandomNumber(0, 2);
                } else if (!this.orient && !adjac[j][i]) {
                    adjac[i][j] = this.getRandomNumber(0, 2);
                    adjac[j][i] = adjac[i][j];
                }
            }
        }
        console.log(adjac);
        return adjac;
    }

    setAdjacZero() {
        for (var i = 0; i < this.countVertex; i++) {
            for (var j = 0; j < this.countVertex; j++) {
                this.adjac[i][j] = 0;
            }
        }
    }

    getIncid() {
        this.initIncid();
        for (var i = 0; i < this.countVertex; i++) {
            for (var j = 0; j < this.vector.length; j++) {
                if (this.vertex[i] == this.vector[j].start || this.vertex[i] == this.vector[j].end) {
                    this.incid[i][j] = 1;
                } else {
                    this.incid[i][j] = 0;
                }
            }
        }
        console.log(this.incid);
    }

    createVertex(canvas) {
        for (var i = 0; i < this.countVertex; i++) {
            var fi = i * 2 * Math.PI / this.countVertex;;
            var x = parseInt(this.rGraph * Math.cos(fi) + canvas.width / 2, 10);
            var y = parseInt(this.rGraph * Math.sin(fi) + canvas.height / 2, 10);
            this.vertex[i] = new Vertex(x, y, 65 + i);
        }
    }

    calcEccent() {
        for (let i = 0; i < this.vertex.length; i++) {
            for (let j = 0; j < this.vertex.length; j++) {
                if (this.adjac[i][j]) {
                    this.vertex[i].neighbors.push(this.vertex[j]);
                }
            }
        }

        for (let i = 0; i < this.vertex.length; i++) {
            let unv = this.vertex.slice();

            for (let j = 0; j < this.vertex.length; j++) {
                if (this.vertex[j].neighbors.length > 0) {
                    this.vertex[j].pathTo = Infinity;
                } else {
                    this.vertex[j].pathTo = undefined;
                }
            }

            unv[i].pathTo = 0;
            let visit = new Array();

            while (unv.length > 0) {
                let wIndex = 0;
                for (let j = 0; j < unv.length; j++) {
                    if (unv[j].pathTo < unv[wIndex].pathTo) {
                        wIndex = j;
                    }
                }
                let current = unv[wIndex];
                unv.splice(wIndex, 1);
                visit.push(current);
                for (let j = 0; j < current.neighbors.length; j++) {
                    let newPathTo = current.pathTo + this.distance(current, current.neighbors[j]);
                    if (newPathTo < current.neighbors[j].pathTo) {
                        current.neighbors[j].pathTo = newPathTo;
                    }
                }
            }

            let max = 0;
            for (let j = 0; j < visit.length; j++) {
                if (visit[j].pathTo > max) {
                    max = visit[j].pathTo;
                }
            }
            if (this.vertex[i].neighbors.length > 0) {
                this.vertex[i].eccent = max;
            } else {
                this.vertex[i].eccent = 0;
            }

        }
        console.log(this.vertex);
    }

    getRadius() {
        let min = Infinity;
        for (let v of this.vertex) {
            if (v.eccent < min) {
                min = v.eccent;
            }
        }
        return min;
    }

    getDiam() {
        let max = 0;
        for (let v of this.vertex) {
            if (v.eccent > max) {
                max = v.eccent;
            }
        }
        return max;
    }

    drawVector(ctx, x1, y1, x2, y2, color) {
        if (this.orient) {
            var r = 20;
            var x = x2 - x1;
            var y = y2 - y1;

            var len = Math.sqrt(x * x + y * y); // узнали длину вектора

            var phi = Math.atan(y / x);
            if (x < 0) phi += Math.PI;
            if (x == 0 && y > 0) phi = Math.PI / 2;
            if (x == 0 && y == 0) phi = 3 * Math.PI / 2; // узнали угол вектора

            x2 = x1 + (len - r) * Math.cos(phi);
            y2 = y1 + (len - r) * Math.sin(phi);
            len -= r; // укоротили вектор с одного конца

            x1 = x2 + (len - r) * Math.cos(phi + Math.PI);
            y1 = y2 + (len - r) * Math.sin(phi + Math.PI);
            len -= r; // укоротили вектор с другого конца

            x = x2 - x1; // пересчитали проекции
            y = y2 - y1;
            len = Math.sqrt(x * x + y * y); // пересчитали длину

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
        } else {
            for (var i = 0; i < this.countVertex; i++) {
                for (var j = 0; j < this.countVertex; j++) {
                    if ((this.adjac[i][j]) && (i != j)) {
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

    drawCurve(canvas, x, y, r, startAngle, endAngle, anticlockwise, color) {
        var ctx = canvas.getContext('2d');
        if (y > canvas.height / 2) {
            y += r;
        } else if (y == canvas.height / 2 && x > canvas.width / 2) {
            x += r;
        } else if (y == canvas.height / 2 && x < canvas.width / 2) {
            x -= r;
        } else {
            y -= r;
        }
        ctx.beginPath();

        ctx.arc(x, y, r, startAngle, endAngle, anticlockwise);
        ctx.fillStyle = color;
        ctx.stroke();
    }

    draw(canvas) {
        var ctx = canvas.getContext('2d');
        var startAngle = 0;
        var endAngle = 2 * Math.PI;
        var anticlockwise = true;
        // отрисовка ребер
        for (var i = 0; i < this.countVertex; i++) {
            for (var j = 0; j < this.countVertex; j++) {
                if ((this.adjac[i][j]) && (i != j)) {
                    this.drawVector(ctx, this.vertex[i].x, this.vertex[i].y, this.vertex[j].x, this.vertex[j].y, '#ccc');
                } else if ((this.adjac[i][j]) && (i == j)) {
                    this.drawCurve(canvas, this.vertex[i].x, this.vertex[i].y, 30, startAngle, endAngle, anticlockwise); //рисуем кривую
                }
            }
        }
        // отрисовка вершин
        for (var i = 0; i < this.countVertex; i++) {
            this.vertex[i].draw(ctx, this.rVertex, startAngle, endAngle, anticlockwise, this.firstColorVertex);
        }
    }

    drawError(i, j, color) {
        var ctx = canvas.getContext('2d');
        var startAngle = 0;
        var endAngle = 2 * Math.PI;
        var anticlockwise = true;
        if (i != j) {
            this.drawVector(ctx, this.vertex[i].x, this.vertex[i].y, this.vertex[j].x, this.vertex[j].y, color);
        } else if (i == j) {
            this.drawCurve(canvas, this.vertex[i].x, this.vertex[i].y, 30, startAngle, endAngle, anticlockwise, color);
        }
    }

    clear(canvas) {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    checkClick(x, y, canvas) {
        if (!this.clicked) {
            return 0;
        }
        let flag = false;
        for (let i = 0; i < this.countVertex; i++) {
            if (this.vertex[i].checkAccess(x, y, this.rVertex)) {
                flag = true;
                this.countClick++;
                if (this.countClick % 2 == 1 && !this.vertex[i].click) {
                    let ctx = canvas.getContext('2d');
                    let startAngle = 0;
                    let endAngle = 2 * Math.PI;
                    let anticlockwise = true;
                    this.vertex[i].click = true;
                    this.vertex[i].draw(ctx, this.rVertex, startAngle, endAngle, anticlockwise, this.secondColorVertex);
                    console.log(this.adjac);
                } else if (this.countClick % 2 == 0 && this.vertex[i].click) {
                    let ctx = canvas.getContext('2d');
                    let startAngle = 0;
                    let endAngle = 2 * Math.PI;
                    let anticlockwise = true;
                    this.vertex[i].click = false;
                    if (!this.adjac[i][i]) {
                        this.adjac[i][i] = 1;
                        this.drawCurve(canvas, this.vertex[i].x, this.vertex[i].y, 30, startAngle, endAngle, anticlockwise); //рисуем кривую
                    } else {
                        this.adjac[i][i] = 0;
                        this.clear(canvas);
                        this.draw(canvas);
                    }
                    this.vertex[i].draw(ctx, this.rVertex, startAngle, endAngle, anticlockwise, this.firstColorVertex);
                    console.log(this.adjac);
                } else if (this.countClick % 2 == 0 && !this.vertex[i].click) {
                    //ДВЕ ВЕРШИН ЗДЕСЬ
                    this.countClick = 0;
                    for (let j = 0; j < this.countVertex; j++) {
                        if (this.vertex[j].click) {
                            let ctx = canvas.getContext('2d');
                            let startAngle = 0;
                            let endAngle = 2 * Math.PI;
                            let anticlockwise = true;
                            this.vertex[j].click = false;
                            this.vertex[j].draw(ctx, this.rVertex, startAngle, endAngle, anticlockwise, this.firstColorVertex);
                            if (this.adjac[j][i]) {
                                //удаление ребра перестраиваем весь граф
                                this.adjac[j][i] = 0;
                                this.clear(canvas);
                                this.draw(canvas);
                            } else {
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
        if (!flag) {
            this.countClick = 0;
            this.clear(canvas);
            this.draw(canvas);
            for (let i = 0; i < this.countVertex; i++) {
                this.vertex[i].click = false;
            }
        }
    }

}
