

function Set(n, univer, arr) {

    this.countElem;
    this.elems = new Array();
    this.univer = "";
    this.elemsStr = "";

    Set.UNIVER = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
        'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '0',
        '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];


    if(typeof arr != 'undefined'){
        this.countElem = arr.length;
        this.elems = arr.slice();
        this.elemsStr = this.elems.join('');
    }else{

        if (univer == undefined){
            univer = Set.UNIVER;
        }

        if(!n){
            this.countElem = this.randomInteger(2, 6);
        }else{
            this.countElem = n;
        }
        this.createUniver(univer);
        this.makeElems();
    }

}


Set.prototype.randomInteger = function(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
};


Set.prototype.makeElems = function(){
    var str = this.makeElemsStr();
    for(let i = 0; i < this.countElem; i++){
        this.elems.push(str[i]);
    }
};


Set.prototype.createUniver = function(univer){
    for(let i = 0; i < univer.length; i++){
        this.univer += univer[i];
    }
};


Set.prototype.makeElemsStr = function(){
    var text = "";
    var i = 0;
    var flag = 0;
    while(i < this.countElem){
        var char = this.univer.charAt(Math.floor(Math.random() * this.univer.length));
        flag = 0;
        for(var j = 0; j < i; j++){
            if(char == text[j]){
                break;
            }else{
                flag++;
            }
        }
        if(flag == i){
            i++;
            text += char;
        }
    }
    this.elemsStr = text;
    return text;
};


Set.prototype.getStr = function(char){
    var text = "";
    for(let i = 0; i < this.countElem; i++){
        text += this.elemsStr[i];
        if(i != this.countElem - 1){
             text += char + " ";
        }
    }
    return text;
};


Set.prototype.checkStr = function(str){
    if(this.elemsStr == str){
        return true;
    }
    return false;
};


Set.prototype.add = function(elem){
    for(let i = 0; i < this.countElem; i++){
        if(this.elem[i] == elem){
            return false;
        }
    }
    this.elem.push(elem);
    this.countElem++;
};


//delete element if it place in set
Set.prototype.delete = function(elem){
    for(let i = 0; i < this.countElem; i++){
        if(this.elem[i] == elem){
            delete this.elem[i];
            this.countElem--
            return false;
        }
    }
};


//edit element if it place in set
Set.prototype.edit = function(oldElem, newElem){
    for(let i = 0; i < this.countElem; i++){
        if(this.elems[i] == oldElem){
            this.elems[i] = newElem;
            return;
        }
    }
};

module.exports = Set;
