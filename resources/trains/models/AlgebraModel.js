// class Operation {
//
//   do(set1, set2, oper) {
//     if (typeof oper == 'string') {
//       if (oper == 'equal') {
//         return this.equal(set1, set2);
//       } else if (oper == 'comp') {
//         arr = this.cartСomp(set1, set2).slice();
//       }
//     }
//     let numOper = oper.int;
//     let arr = new Array();
//     switch (numOper) {
//       case 1:
//         arr = this.inter(set1, set2).slice();
//         break;
//       case 2:
//         arr = this.union(set1, set2).slice();
//         break;
//       case 3:
//         arr = this.minus(set1, set2).slice();
//         break;
//       case 4:
//         arr = this.simDiff(set1, set2).slice();
//         break;
//     }
//
//     let newSet = new Set(null, null, arr);
//     return newSet;
//   }
//
//   //
//   equal(set1, set2) {
//
//     if (set1.elems.length != set2.elems.length) {
//       return false;
//     }
//
//     let arg1 = set1.elems.slice();
//     let arg2 = set2.elems.slice();
//
//     arg1.sort();
//     arg2.sort();
//
//     for (let i = 0; i < arg1.length; i++) {
//       if (arg1[i] == arg2[i]) continue;
//       else {
//         return false;
//       }
//     }
//     return true;
//   }
//
//   //
//   cartСomp(set1, set2) {
//     let comp = [];
//     let iter = 0;
//     for (i = 0; i < arg1.length; i++) {
//       for (j = 0; j < arg2.length; j++) {
//         comp[iter] = arg1[i].concat(arg2[j]);
//         iter++;
//       }
//     }
//     return comp;
//   }
//
//   //
//   simDiff(set1, set2) {
//     let arr1 = set1.elems.slice();
//     let arr2 = set2.elems.slice();
//     let newArr = arr1.filter(x => !arr2.includes(x))
//       .concat(arr2.filter(x => !arr1.includes(x)));
//     return newArr;
//   }
//
//   //
//   minus(set1, set2) {
//     let arr1 = set1.elems.slice();
//     let arr2 = set2.elems.slice();
//     let newArr = arr1.filter(x => !arr2.includes(x));
//     return newArr;
//   }
//
//   //
//   union(set1, set2) {
//     let arr1 = set1.elems.slice();
//     let arr2 = set2.elems.slice();
//     let newArr = arr1.filter(x => !arr2.includes(x))
//       .concat(arr2.filter(x => !arr1.includes(x)))
//       .concat(arr2.filter(x => arr1.includes(x)));
//     return newArr;
//   }
//
//   //
//   inter(set1, set2) {
//     let arr1 = set1.elems.slice();
//     let arr2 = set2.elems.slice();
//     let newArr = arr1.filter(x => arr2.includes(x));
//     return newArr;
//   }
// }

function Algebra() {
  //Тут должно быть пусто?
}

Algebra.prototype.do = function(set1, set2, oper) {
  if (typeof oper == 'string') {
    if (oper == 'equal') {
      return this.equal(set1, set2);
    } else if (oper == 'comp') {
      arr = this.cartСomp(set1, set2).slice();
    }
  }
  let numOper = oper.int;
  let arr = new Array();
  switch (numOper) {
    case 1:
      arr = this.inter(set1, set2).slice();
      break;
    case 2:
      arr = this.union(set1, set2).slice();
      break;
    case 3:
      arr = this.minus(set1, set2).slice();
      break;
    case 4:
      arr = this.simDiff(set1, set2).slice();
      break;
  }

  let newSet = new Set(null, null, arr);
  return newSet;
}

Algebra.prototype.equal = function(set1, set2) {

  if (set1.elems.length != set2.elems.length) {
    return false;
  }

  let arg1 = set1.elems.slice();
  let arg2 = set2.elems.slice();

  arg1.sort();
  arg2.sort();

  for (let i = 0; i < arg1.length; i++) {
    if (arg1[i] == arg2[i]) continue;
    else {
      return false;
    }
  }
  return true;
}

Algebra.prototype.cartComp = function(set1, set2) {
  let comp = [];
  let iter = 0;
  for (i = 0; i < arg1.length; i++) {
    for (j = 0; j < arg2.length; j++) {
      comp[iter] = arg1[i].concat(arg2[j]);
      iter++;
    }
  }
  return comp;
}

Algebra.prototype.simDiff = function(set1, set2) {
  let arr1 = set1.elems.slice();
  let arr2 = set2.elems.slice();
  let newArr = arr1.filter(x => !arr2.includes(x))
    .concat(arr2.filter(x => !arr1.includes(x)));
  return newArr;
}

Algebra.prototype.minus = function(set1, set2) {
  let arr1 = set1.elems.slice();
  let arr2 = set2.elems.slice();
  let newArr = arr1.filter(x => !arr2.includes(x));
  return newArr;
}

Algebra.prototype.union = function(set1, set2) {
  let arr1 = set1.elems.slice();
  let arr2 = set2.elems.slice();
  let newArr = arr1.filter(x => !arr2.includes(x))
    .concat(arr2.filter(x => !arr1.includes(x)))
    .concat(arr2.filter(x => arr1.includes(x)));
  return newArr;
}

Algebra.prototype.inter = function(set1, set2) {
  let arr1 = set1.elems.slice();
  let arr2 = set2.elems.slice();
  let newArr = arr1.filter(x => arr2.includes(x));
  return newArr;
}