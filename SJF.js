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
var SJFque = []; //存放进程名称，及服务时间
timer = setInterval(processSJF, 1000);

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

function processSJF() {
    for (let i in timeJsonSet) {
        if (t >= timeJsonSet[i][0]) {
            if (SJFque.length <= 1) {
                SJFque.push([i, timeJsonSet[i][1]]);
                addQueBlock(i, 0);
            } else {
                for (let j = 1, len = SJFque.length; j <= len; j++) {
                    if (j == len || timeJson[i][1] < SJFque[j][1]) {
                        SJFque.splice(j, 0, [i, timeJson[i][1]]); //注意splice的位置
                        addQueBlock(i, j);
                        break; //哇这点和C++不一样的呀，回头一定好好看看？
                    }
                }
            }
            if (!finalTime) {
                finalTime += timeJson[i][1];
            }
            delete timeJsonSet[i];
        }
    }
    if (t >= finalTime && SJFque.length > 0) {
        var temp0 = SJFque[0][0].charCodeAt() - 64; //从一开始不是从0开始，一开始有0占位
        //doneTime.push(t);
        doneTime[temp0] = t;
        var temp = t - timeJson[SJFque[0][0]][0];
        //cycleTime.push(temp);
        cycleTime[temp0] = temp;
        //cycle_wTime.push(temp/timeJson[SJFque[0][0]][1]+1);//这里三条不一样的是不能用push因为和FCFS不一样不一定是按照入队列顺序执行
        cycle_wTime[temp0] = temp / timeJson[SJFque[0][0]][1] + 1;
        showBar(SJFque[0][0], temp0);
        temp = temp0 = null;
        SJFque.shift();
        delQueBlock();
        if (t > 0 && SJFque.length == 0) {
            clearInterval(timer);
            timerShow.display = "none";
            document.getElementById('tableNotice').style.display = "block";
            return;
        }
        finalTime += SJFque[0][1];
    }
    //以下是控制进度条增长的部分
    if (SJFque[0] && cnt < 5) {
        cnt = SJFque[0][0].charCodeAt() - 65;
        if (Process[cnt].style.width) {
            Process[cnt].style.width = parseInt(Process[cnt].style.width) + 50 + "px";
        } else {
            Process[cnt].style.width = Process[cnt].style.width + 50 + "px";
        }
    }
    t++;
    timerShow.innerHTML = +t;
}