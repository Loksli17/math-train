function Graph(minVertex, maxVertex, orient, reflex, adjac){
    this.countVertex = this.randomInteger(minVertex, maxVertex);
    this.reflex = reflex;
    this.orient = orient;
    if(adjac == undefined){
        this.adjac = new Array(this.countVertex);
        this.initAdjac();
    }else{
        this.adjac = adjac.slice('');
    }
}


Graph.prototype.randomInteger = function(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
};


Graph.prototype.initAdjac = function(){
    for (var i = 0; i < this.countVertex; i++) {
        this.adjac[i] = new Array();
    }
    //генерация матрицы смежности
    for (var i = 0; i < this.countVertex; i++) {
        for (var j = 0; j < this.countVertex; j++) {
            if (!this.reflex && i == j) {
                this.adjac[i][j] = 0;
            } else if (this.orient) {
                this.adjac[i][j] = this.randomInteger(1, 2);
                this.adjac[i][j]--;
            } else if (!this.orient && !this.adjac[j][i]) {
                this.adjac[i][j] = this.randomInteger(1, 2);
                this.adjac[i][j]--;
                this.adjac[j][i] = this.adjac[i][j];
            }
            if(this.adjac[i][j] < 0){
                this.adjac = 0;
            }
        }
    }
}


module.exports = Graph;
