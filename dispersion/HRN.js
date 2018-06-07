var t = 0;
var finalTime = 0; //当前进程结束时间,只有一个
var timer;
var cnt = 0;
var timerShow = document.getElementById('timerShow');
var queShow = document.getElementById('processque');
var WholeProcess = document.getElementsByClassName('process');
var Process = document.getElementsByClassName('pblock');
var showTable = document.getElementById('showTable');
var doneTime = [0]; //完成时间即完成时刻
var cycleTime = [0]; //周转时间 = 作业完成时间-作业提交时间
var cycle_wTime = [0]; //带权周转时间 = 作业周转时间/作业实际运作时间

var timeJson = {
    "A": [0, 3],
    "B": [2, 6],
    "C": [4, 4],
    "D": [6, 5],
    "E": [8, 2]
};
var timeJsonSet = JSON.parse(JSON.stringify(timeJson));
var HRNque = []; //存放进程名称及提交时间
timer = setInterval(processHRN, 1000);

function addQueBlock(processName, index) {
    var newqueblock = document.createElement('div');
    //queblock.setAttribute('class','queblock');
    newqueblock.className = 'queblock';
    newqueblock.innerHTML = processName;
    if (queShow.children.length <= 1) { //这里如果使用childNode会包括文本结点
        queShow.appendChild(newqueblock);
    } else if (index >= 1) {
        queShow.insertBefore(newqueblock, queShow.children[index]);
    }
    queShow.children[0].style.backgroundColor = "orange"; //注意这里的属性名字
}

function delQueBlock() {
    queShow.removeChild(queShow.children[0]);
    if (queShow.children[0]) {
        queShow.children[0].style.backgroundColor = "orange"; //注意这里的属性名字
    }
}

function showBar(name, processcnt) {
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    td.innerHTML = name;
    tr.appendChild(td);
    var td = document.createElement('td');
    if (doneTime[processcnt]) {
        td.innerHTML = doneTime[processcnt];
        tr.appendChild(td);
    }
    var td = document.createElement('td');
    if (cycleTime[processcnt]) {
        td.innerHTML = cycleTime[processcnt];
        tr.appendChild(td);
    }
    var td = document.createElement('td');
    if (cycle_wTime[processcnt]) {
        td.innerHTML = cycle_wTime[processcnt].toFixed(2);
        tr.appendChild(td);
    }
    showTable.appendChild(tr);
}

function processHRN() {
    if (t > 0 && HRNque.length == 0) {
        clearInterval(timer);
        timerShow.display = "none";
        document.getElementById('tableNotice').style.display = "block";
        return;
    }
    var waitTime;
    var keyR = 0;
    var key;
    if (t >= finalTime) {
        if (HRNque.length == 1) {
            var temp0 = HRNque[0][0].charCodeAt() - 64;
            doneTime[temp0] = t;
            cycleTime[temp0] = t - HRNque[0][1];
            cycle_wTime[temp0] = (t - HRNque[0][1]) / timeJson[HRNque[0][0]][1];
            showBar(HRNque[0][0], temp0);
            HRNque.shift();
            delQueBlock();
        }
        for (let i in timeJsonSet) {
            waitTime = timeJson[i][0] - finalTime > 0 ? timeJson[i][0] - finalTime : 0;
            var R = 1 + waitTime / timeJson[i][1];
            if (R > keyR) {
                keyR = R;
                key = i;
            }
        }
        if (key) {
            HRNque.push([key, t]);
            addQueBlock(key, 0);
            delete timeJsonSet[key];
            finalTime += timeJson[key][1];
        }
    }
    cnt = HRNque[0][0].charCodeAt() - 65;
    if (Process[cnt].style.width) {
        Process[cnt].style.width = parseInt(Process[cnt].style.width) + 50 + "px";
        WholeProcess[cnt].getElementsByTagName('h4')[0].style.opacity = 0;
    } else {
        Process[cnt].style.width = Process[cnt].style.width + 50 + "px";
        WholeProcess[cnt].getElementsByTagName('h4')[0].style.opacity = 1;
    }
    t++;
    timerShow.innerHTML = +t;
}