let timer;

function trainAjax(data){
    $.ajax({
        url: '/tasks/task-answer',
        type: 'get',
        data: data,
        dataType: 'json',
        cashe: false,
        success: function(data){
            console.log(data);
            if(data.success){
                let bool = data.result;
                printAnswer(bool);
            }else{
                console.log('no');
            }
        }
    });
}

function printAnswer(bool){
    if(bool){
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

function close(nameId){
    clearInterval(timer);
    document.getElementById(nameId).style.display = "none";
}
