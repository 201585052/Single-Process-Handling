var Process = (function(){
    var t = 0;
    var finalTime = 0//当前进程的结束时间，for SJF和HRN
    var cnt = 0;
    var timer;
    var container = document.getElementById('container');
    var container2 = document.getElementById('container2');
    var timerShow = document.getElementById('timerShow');
    var queShow = document.getElementById('processque');//用于展示队列
    var WholeProcess = document.getElementsByClassName('process');
    var Process = document.getElementsByClassName('pblock');//各进程进度条
    var showTable = document.getElementById('showTable');
    var showbar = document.getElementById('showbar');
    var doneTime = [0];//完成时间即完成时刻
    var cycleTime = [0];//周转时间 = 作业完成时间-作业提交时间
    var cycle_wTime = [0];//带权周转时间 = 作业周转时间/作业实际运作时间
    var ty = 0 ;//这点的y坐标构成输出的Json 
    var timeJson = {
        "A": [0, 3],
        "B": [2, 6],
        "C": [4, 4],
        "D": [6, 5],
        "E": [8, 2]
    };
    var timeJsonSet = JSON.parse(JSON.stringify(timeJson));//用于做进程的副本，每执行完一个就删除一个
    var SJFque = []; //SJF-存放进程名称，及服务时间
    var HRNque = []; //HRN-存放进程名称及提交时间
    var RRTime = 5;
    var RRque = [];
    var RRset = {}; //用于记录当前已经加入了什么元素
    var RRres = []; //输出用于绘图的x、yJson
    /*以上为“静态”私有变量定义,接下来为DOM操作函数*/
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
    /*接着是把运行结果加到表里的函数*/
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
    /*接下来是主体算法部分*/
    return {
        FCFS:function(){
            container.style.display = 'block';
            container2.style.display = 'none';
            showbar.style.display = 'block';
            queShow.style.display = 'block';
            timer = setInterval(processGo, 1000);
            WholeProcess[cnt].getElementsByTagName('h4')[0].style.opacity = 1;
            function processGo() {
                var processChoose = "A".charCodeAt();
                processChoose += cnt;
                processChoose = String.fromCharCode(processChoose);
                if (processChoose == "F") {
                    clearInterval(timer);
                    location.reload();
                    return;
                }
                WholeProcess[cnt].getElementsByTagName('h4')[0].style.opacity = 0;
                if (timeJson[processChoose][1] && t < timeJson[processChoose][1] + doneTime[cnt]) {
                    if (Process[cnt].style.width) {
                        Process[cnt].style.width = parseInt(Process[cnt].style.width) + 50 + "px";
                    } else {
                        Process[cnt].style.width = Process[cnt].style.width + 50 + "px";
                        addQueBlock(processChoose,0);//这一部分是写好后两个后再想起来加的
                    }
                } else {
                    cnt++;
                    if (WholeProcess[cnt]) {
                        WholeProcess[cnt].getElementsByTagName('h4')[0].style.opacity = 1;
                    }
                    delQueBlock();
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
        },
        SJF:function(){
            container.style.display = 'block';
            container2.style.display = 'none';
            showbar.style.display = 'block';
            queShow.style.display = 'block';
            timer = setInterval(processSJF, 1000);
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
                        location.reload();
                        return;
                    }
                    finalTime += SJFque[0][1];
                }
                //以下是控制进度条增长的部分
                if (SJFque[0] && cnt < 5) {
                    cnt = SJFque[0][0].charCodeAt() - 65;
                    if (Process[cnt].style.width) {
                        Process[cnt].style.width = parseInt(Process[cnt].style.width) + 50 + "px";
                        WholeProcess[cnt].getElementsByTagName('h4')[0].style.opacity = 0;
                    } else {
                        Process[cnt].style.width = Process[cnt].style.width + 50 + "px";
                        WholeProcess[cnt].getElementsByTagName('h4')[0].style.opacity = 1;
                    }
                }
                t++;
                timerShow.innerHTML = +t;
            }
        },
        HRN:function(){
            container.style.display = 'block';
            container2.style.display = 'none';
            showbar.style.display = 'block';
            queShow.style.display = 'block';
            timer = setInterval(processHRN, 1000);
            function processHRN() {
                if (t > 0 && HRNque.length == 0) {
                    clearInterval(timer);
                    timerShow.display = "none";
                    document.getElementById('tableNotice').style.display = "block";
                    location.reload();
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
        },
        RR:function(){
            container.style.display = 'none';
            container2.style.display = 'block';
            showbar.style.display = 'block';
            showbar.style.top = "-750px";
            queShow.style.display = 'none';
            function RRProcess(t) {
                if (RRTime > 0) {
                    for (var i in timeJson) {
                        if (t >= timeJson[i][0] && !RRset[i]) {
                            RRque.unshift([i, timeJson[i][1]]);
                            RRset[i] = 1;
                        }
                    }
                    RRque[0][1]--;
                    ty = RRque[0][0].charCodeAt() - 64; //这里是做一个字母的数字映射
                    RRres.push([t, ty]);
                    if (RRque[0][1] == 0) {
                        var key = RRque[0][0];
                        doneTime.push(t + 1);
                        cycleTime.push(t + 1 - timeJson[key][0]);
                        cycle_wTime.push((t + 1 - timeJson[key][0]) / timeJson[key][1]);
                        showBar(key, doneTime.length - 1);
                        RRque.shift();
                        delete RRset.temp;
                        RRTime--;
                    } else {
                        RRque.push(RRque.shift());
                    }
                    RRProcess(t + 1);
                } else {
                    RRres.push([t, ty]);
                    return;
                }
            }
            RRProcess(0);
            var myChart = echarts.init(document.getElementById('container2'));
            option = {
                title: {
                    text: '轮转RR(q=1)'
                },
                tooltip: {
                    trigger: "axis",
                    formatter: function (params) {
                        var val = params[0].value[1];
                        if (val == 1) {
                            val = 'A';
                        } else if (val == 2) {
                            val = 'B';
                        } else if (val == 3) {
                            val = 'C';
                        } else if (val == 4) {
                            val = 'D';
                        } else if (val == 5) {
                            val = 'E';
                        }
                        return params[0].marker + params[0].seriesName + val + "<br />" +
                            "&nbsp&nbsp&nbsp时刻:" + params[0].value[0];
                    }
                },
                legend: {
                    data: ['调度']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    min: 0,
                    max: 20,
                    type: 'value',
                    interval: 1
                },
                yAxis: {
                    min: 0,
                    max: 5,
                    axisLabel: {
                        formatter: function (value) {
                            var texts = [];
                            if (value == 1) {
                                texts.push('A');
                            } else if (value == 2) {
                                texts.push('B');
                            } else if (value == 3) {
                                texts.push('C');
                            } else if (value == 4) {
                                texts.push('D');
                            } else if (value == 5) {
                                texts.push('E');
                            }
                            return texts;
                        }
                    }
                },
                series: [{
                    name: '调度',
                    type: 'line',
                    step: 'end',
                    data: RRres
                }]
            };
            
            myChart.setOption(option);
            setInterval(function(){
                location.reload()
            },3000);
        }
    };
})();