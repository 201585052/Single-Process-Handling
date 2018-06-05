var processPoint = [
    []
];
var timeJson = {
    "A": [0, 3],
    "B": [2, 6],
    "C": [4, 4],
    "D": [6, 5],
    "E": [8, 2]
};
var doneTime = [0]; //完成时间即完成时刻
var cycleTime = [0]; //周转时间 = 作业完成时间-作业提交时间
var cycle_wTime = [0]; //带权周转时间 = 作业周转时间/作业实际运作时间
var ty = 1; //这点的x、y坐标构成输出的Json
var RRTime = 5;
var RRque = [];
var RRset = {}; //用于记录当前已经加入了什么元素
var RRres = []; //输出用于绘图的x、yJson
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
var myChart = echarts.init(document.getElementById('container'));
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