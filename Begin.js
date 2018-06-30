var btnfather = document.getElementById('selec');
var btns = document.getElementsByClassName('selecbut');
btnfather.addEventListener('click', function (e) {
    // console.log(e.target.tagName == 'BUTTON');
    // console.log(e.target.className);
    // console.log(e.target.getAttribute("class"));
    //这里补充一下找class名的相关方法
    if (e.target.tagName == 'BUTTON') {
        var inText = e.target.innerHTML;
        e.target.style.backgroundColor = "#0089ff";
        for (var i in btns) {
            btns[i].disabled = true;
        }
        switch (inText) {
            case ('FCFS'):
                Process.FCFS();
                break;
            case ('SJF'):
                Process.SJF();
                break;
            case ('HRN'):
                Process.HRN();
                break;
            case ('RR'):
                Process.RR();
                break;
            default:
                console.log('hhh');
        }
    }
});