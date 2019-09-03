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

    let data = {
        A        : A.getStr(','),
        B        : B.getStr(','),
        U        : U.getStr(','),
        inter    : interOper.code,
        union    : unionOper.code,
        minus    : minusOper.code,
        symDiffer: symDifferOper.code,
    }

    return data;
}


simpleSets.prototype.checkAnswer = (data) => {

    let algebra = new Algebra(),
        arrA = new Array(),
        arrB = new Array(),
        result = {
            isRight: true,
            answer: [],
            data: [],
            task_id: 1,
        }

    for(let i = 0; i < data.A.length; i++){
        if(i % 3 == 0){
            arrA.push(data.A[i]);
            arrB.push(data.B[i]);
        }
    }
    let A = new Set(null, null, arrA),
        B = new Set(null, null, arrB);

    //операции
    let unionOper     = new Operation(0, 1, 0, 0),
        interOper     = new Operation(1, 0, 0, 0),
        minusOper     = new Operation(0, 0, 1, 0),
        symDifferOper = new Operation(0, 0, 0, 1);

    //новые множества
    let union     = algebra.do(A, B, unionOper),
        inter     = algebra.do(A, B, interOper),
        minus     = algebra.do(A, B, minusOper),
        symDiffer = algebra.do(A, B, symDifferOper);

    //запись данных с тренажера
    result.data['A'] = arrA;
    result.data['B'] = arrB;
    result.data['union'] = union.elems;
    result.data['inter'] = inter.elems;
    result.data['minus'] = minus.elems;
    result.data['symDiffer'] = symDiffer.elems;

    //запись ответа пользователя
    result.answer['union'] = data.union.split('');
    result.answer['inter'] = data.inter.split('');
    result.answer['minus'] = data.minus.split('');
    result.answer['symDiffer'] = data.symDiffer.split('');

    if( union.checkStr(data.union)
        && inter.checkStr(data.inter)
        && minus.checkStr(data.minus)
        && symDiffer.checkStr(data.symDiffer)){
            result.isRight = true;
            return result;
    }

    result.isRight = false;
    return result;
}


module.exports = simpleSets;
