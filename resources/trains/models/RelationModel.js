function Relation(set, size, graph, mat) {
    this.relation = new Array();
    this.set;
    this.size;
    this.graph;
    this.mat;
    if (graph != undefined && mat != undefined && !set && !size) {
        this.graph = graph;
        this.mat = mat;
    } else if (set != undefined && size != undefined && !graph && !mat) {
        this.set = set;
        this.size = size;
    } else {
        this.relation = 0;
    }
}

Relation.prototype.randomInteger = function(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
};

//это дело наверняка можно сделать красивее
Relation.prototype.getRel = function() {
    if (this.graph == undefined) {
        let oper = new Operation(0, 0, 0, 0, 1);
        let alg = new Algebra();

        let res = alg.do(this.set, this.set, oper).elems.slice();
        for (let i = 0; i < this.size; i++) {
            let index = this.randomInteger(0, res.length - 1);
            this.relation.push(res[index]);
            res.splice(index, 1);
        }
    } else if (this.graph != undefined) {
        for (let i = 0; i < graph.countVertex; i++) {
            for (let j = 0; j < graph.countVertex; j++) {
                if (this.mat[i][j]) {
                    this.relation.push(new Set(2, 0, [String.fromCharCode(graph.vertex[i].name), String.fromCharCode(graph.vertex[j].name)]));
                }
            }
        }
    }
    return this.relation;
}

Relation.prototype.copy = function(orig) {
    this.relation = orig.relation;
    this.set = orig.set;
    this.size = orig.size;
    this.graph = orig.graph;
    this.mat = orig.mat;
}