function Relation(set, size) {
    this.set = set;
    this.relation = new Array();
    this.size = size;
}

Relation.prototype.randomInteger = function(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
};
//это дело наверняка можно сделать красивее
Relation.prototype.getRel = function() {
    let oper = new Operation(0, 0, 0, 0, 1);
    let alg = new Algebra();

    let res = alg.do(this.set, this.set, oper).elems.slice();
    for (let i = 0; i < this.size; i++) {
        let index = this.randomInteger(0, res.length - 1);
        this.relation.push(res[index]);
        res.splice(index, 1);
    }
    return this.relation;
}