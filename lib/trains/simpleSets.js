const Set       = require('../../models/trains/SetModel');
const Operation = require('../../models/trains/OperationModel');
const Algebra   = require('../../models/trains/AlgebraModel');

function simpleSets(){};

simpleSets.prototype.getData = () => {
    //множества
    let U = new Set(12),
        A = new Set(7, U.elems),
        B = new Set(7, U.elems);

    //операции
    let unionOper     = new Operation(0, 1, 0, 0),
        interOper     = new Operation(1, 0, 0, 0),
        minusOper     = new Operation(0, 0, 1, 0),
        symDifferOper = new Operation(0, 0, 0, 1);

    return [
        A, B, U, unionOper, interOper, minusOper, symDifferOper,
    ];

}

module.exports = simpleSets;
