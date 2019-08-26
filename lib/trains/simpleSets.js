
 <style media="screen">

    .train{
        padding: 40px;
    }

     .answer{
         display: flex;
         flex-flow: column;
     }

     .answer > label{
         margin-top: 20px;
     }

     .set-cont{
         display: grid;
         grid-template-columns: 100%;
         grid-row-gap: 10px;
     }

     .answer input{
         height: 30px;
     }

     .cont-button{
         display: grid;
         grid-template-columns: max-content max-content;
         grid-column-gap: 10px;
     }

     .answer label{
         display: flex;
         align-items: center;
     }

     .answer span{
         display: block;
         width: 70px;
     }

     .button{
        padding: 10px 15px;
        background: #ccc;
        border-radius: 5px;
        width: max-content;
        margin-top: 15px;
    }

    .button:hover{
        transition: 0.5s;
        cursor: pointer;
        background: #fcc;
    }

    .result{
        display: none;
    }

    .user-info{
        margin-top: 20px;
    }
 </style>




<div class="train">
    <div class="set-cont">
        <div class="set1"></div>
        <div class="set2"></div>
    </div>


    <div class="answer">
        <label for="">
            <span>A &cap; B</span>
            <input type="text" name="inter" value="" placeholder="пересечение">
        </label>
        <label for="">
            <span>A &cup; B</span>
            <input type="text" name="union" value="" placeholder="обьединение">
        </label>
        <label for="">
            <span>A &setminus; B</span>
            <input type="text" name="minus" value="" placeholder="разность">
        </label>
        <label for="">
            <span>A &oplus; B</span>
            <input type="text" name="symDiffer" value="" placeholder="симметрическая разность">
        </label>
    </div>

    <div class="user-info">
        <div id="butAnswer" class="button">Решить</div>
        <div id="result"></div>
    </div>
</div>


<div id="kekLol"></div>

<script type="text/javascript" src="jquery.js"></script>
<script type="text/javascript" src="models/setModelProto.js?ver=2"></script>
<script type="text/javascript" src="models/randoperationModel.js"></script>
<script type="text/javascript" src="models/operationModel.js"></script>


<script type="text/javascript">

window.onload = function(){


    let a = new Set(5),
        b = new Set(4),
        oper = new RandOperation(1, 1, 1, 1);

    let algebra = new Operation();
    let newSet = algebra.do(a, b, oper);

    console.log(a.getStr('kek'));


    document.getElementById('kekLol').innerHTML = oper.cod;




    //множества
    let U = new Set(12),
        A = new Set(7, U.elems),
        B = new Set(7, U.elems);

    //операции
    let unionOper     = new RandOperation(0, 1, 0, 0),
        interOper     = new RandOperation(1, 0, 0, 0),
        minusOper     = new RandOperation(0, 0, 1, 0),
        symDifferOper = new RandOperation(0, 0, 0, 1);


    //получение блоков для вывода множеств
    let set1 = document.getElementsByClassName('set1')[0],
        set2 = document.getElementsByClassName('set2')[0];


    set1.innerHTML = 'Множество A = { ' + A.getStr(',') + '}';
    set2.innerHTML = 'Множество B = { ' + B.getStr(',') + '}';

    let operation = new Operation();

    //новые множества
    let union     = operation.do(A, B, unionOper),
        inter     = operation.do(A, B, interOper),
        minus     = operation.do(A, B, minusOper),
        symDiffer = operation.do(A, B, symDifferOper);

    let butAnswer = document.getElementById('butAnswer');
    butAnswer.addEventListener('click', getAnswer, false);
    let timer;

    function getAnswer(){

        let u  = document.getElementsByName('union')[0].value,
            i  = document.getElementsByName('inter')[0].value,
            m  = document.getElementsByName('minus')[0].value,
            sD = document.getElementsByName('symDiffer')[0].value;


        if(!checkInput(u, i, m, sD)){
            document.getElementById('result').style.block = "block";
            document.getElementById('result').style.color = "red";
            document.getElementById('result').innerHTML   = "Введите ответ";
            timer = setInterval(close, 2000, 'result');
        }

        if(checkAnswer(u, i, m, sD)){
            document.getElementById('result').style.block = "block";
            document.getElementById('result').style.color = "green";
            document.getElementById('result').innerHTML   = "Верно";
            close('butAnswer');
        }else{
            document.getElementById('result').style.block = "block";
            document.getElementById('result').style.color = "red";
            document.getElementById('result').innerHTML   = "Неверно";
            close('butAnswer');
        }

    }

    function checkInput(u, i, m, sD){
        if(u == "" || i == "" || m == "" || sD == ""){
            return false;
        }
        return true;
    }

    function checkAnswer(u, i, m, sD){
        // union, inter, minus, symDiffer
        if(union.checkStr(u) && inter.checkStr(i) && minus.checkStr(m) && symDiffer.checkStr(sD)){
            return true;
        }
        return false;
    }

    function close(nameId){
        clearInterval(timer);
        document.getElementById(nameId).style.display = "none";
    }



}




</script>
