var FCFS = function () {
    var t = 0;
    var cnt = 0;
    var timer;
    var timerShow = document.getElementById('timerShow');
    var WholeProcess = document.getElementsByClassName('process');
    var Process = document.getElementsByClassName('pblock');
    var showTable = document.getElementById('showTable');
    var doneTime = [0];
    var cycleTime = [0];
    var cycle_wTime = [0];
    var timeJson = {
        "A": [0, 3],
        "B": [2, 6],
        "C": [4, 4],
        "D": [6, 5],
        "E": [8, 2]
    };
    timer = setInterval(processGo, 1000);
    WholeProcess[cnt].getElementsByTagName('h4')[0].style.opacity = 1;

    function showBar(name, processcnt) {
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.innerHTML = name;
        tr.appendChild(td);
        var td = document.createElement('td');
        td.innerHTML = doneTime[processcnt];
        tr.appendChild(td);
        var td = document.createElement('td');
        td.innerHTML = cycleTime[processcnt];
        tr.appendChild(td);
        var td = document.createElement('td');
        td.innerHTML = cycle_wTime[processcnt].toFixed(2);
        tr.appendChild(td);
        showTable.appendChild(tr);
    }

    function processGo() {
        var processChoose = "A".charCodeAt();
        processChoose += cnt;
        processChoose = String.fromCharCode(processChoose);
        if (processChoose == "F") {
            clearInterval(timer);
            return;
        }
        WholeProcess[cnt].getElementsByTagName('h4')[0].style.opacity = 0;
        if (timeJson[processChoose][1] && t < timeJson[processChoose][1] + doneTime[cnt]) {
            if (Process[cnt].style.width) {
                Process[cnt].style.width = parseInt(Process[cnt].style.width) + 50 + "px";
            } else {
                Process[cnt].style.width = Process[cnt].style.width + 50 + "px";
            }
        } else {
            cnt++;
            if (WholeProcess[cnt]) {
                WholeProcess[cnt].getElementsByTagName('h4')[0].style.opacity = 1;
            }
            doneTime.push(t);
            var temp = t - timeJson[processChoose][0];
            cycleTime.push(temp);
            cycle_wTime.push(temp / timeJson[processChoose][1].toFixed(2));
            showBar(processChoose, cnt);
        }
        t++;
        if (cnt < 5) {
            timerShow.innerHTML = +t;
        } else {
            timerShow.display = "none";
            document.getElementById('tableNotice').style.display = "block";
        }
    }
};
FCFS();