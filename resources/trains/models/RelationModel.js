function Relation(set, size) {
    this.relation = new Array();

    let oper = new Operation(0, 0, 0, 0, 1);
    let alg = new Algebra();

    let res = alg.do(set, set, oper).elems.slice();
    for (let i = 0; i < size; i++) {
        let index = this.randomInteger(0, res.length - 1);
        this.relation.push(res[index]);
        res.splice(index, 1);
    }
}

Relation.prototype.randomInteger = function(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
};

Relation.prototype.getRel = function() {
    return this.relation;
}