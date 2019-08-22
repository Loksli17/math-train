class Operation{

	num;
	code;

	constructor(inter, union, minus, setDiffer){
    let param = new Array();
    let flagExep = 0;
    //проверка пришедших параметров
    (inter)     ? param.push(1) : flagExep++;
    (union)     ? param.push(2) : flagExep++;
    (minus)     ? param.push(3) : flagExep++;
    (setDiffer) ? param.push(4) : flagExep++;
    //добавить обработку
    //отправка массива для получения операции
    this.num = this.randomIntegerExeption(param);
    this.code = this.initOperation();
	};

  randomIntegerExeption(numPool){
    var rand = numPool[Math.floor(Math.random() * numPool.length)];
    return rand;
  }

  //инициализация операции
  initOperation(){
  	switch(this.num){
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
  	}
  }

  //получение html-кода операции
  get code(){
  	return this.code;
  }

  //получение условного когда операции
  get int(){
  	return this.num;
  }

}
