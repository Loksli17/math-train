const Set = require('./SetModel');

function Operation(inter, union, minus, setDiffer, decart) {
    let param = new Array();
    let flagExep = 0;
    //проверка пришедших параметров
    (inter) ? param.push(1): flagExep++;
    (union) ? param.push(2): flagExep++;
    (minus) ? param.push(3): flagExep++;
    (setDiffer) ? param.push(4): flagExep++;
    (decart) ? param.push(5): flagExep++;
    //добавить обработку
    //отправка массива для получения операции
    this.num = this.randomIntegerExeption(param);
    this.code = this.initOperation();
}

Operation.prototype.randomIntegerExeption = function(numPool) {
    var rand = numPool[Math.floor(Math.random() * numPool.length)];
    return rand;
}

Operation.prototype.initOperation = function() {
    switch (this.num) {
        case 1:
            return "&cap;";
            break;
        case 2:
            return "&cup;"
            break;
        case 3:
            return "&setminus;"
            break;
        case 4:
            return "&oplus;"
            break;
        case 5:
            return "&times;"
            break;
    }
}

Operation.prototype.code = function() {
    return this.code;
}

Operation.prototype.int = function() {
    return this.num;
}

module.exports = Operation;
