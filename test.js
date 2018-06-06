var arr = [];
// arr.splice(1,0,["D",2]);
for(var i in arr){
    console.log(arr[i][1]);
}
if(arr[0])
console.log("yes");
// for(var i=0;i<10;i++){
//     console.log(i);
//     if(i>4){
//         break;
//     }
// }
//console.log(len);
function processSJF() {
    if(cnt == 5){
        clearInterval(timer);
    }
    var key = String.fromCharCode(65+cnt);
    if(t>=timeJson[key][0] && SJFque[0][0]!=key){
        if(SJFque.length <= 1){
            SJFque.push([key,timeJson[key][1]]);
        }
        else{
            for(let i=1;i<SJFque.length;i++){
                if(timeJson[key][1]<SJFque[i][1]){
                    SJFque.splice(i-1,0,[key,timeJson[key][1]]);
                }

            }
        }
        finalTime += timeJson[key][1];
        var newqueblock = document.createElement('div');
        //queblock.setAttribute('class','queblock');
        newqueblock.className = 'queblock';
        newqueblock.innerHTML = key;
        queShow.appendChild(newqueblock);
        //每次放新的进程进来的时候排序，这样才能统计好finaltime

    }
    if(t>=finalTime){
        cnt++;
        SJFque.shift();
        finalTime += SJFque[0][1];
        queShow.removeChild(queShow.childNodes[0]);
        SJFque.sort((x,y) => x[1]-y[1]);
        for(var i in SJFque){

        }
    }
    t++;
    if (cnt < 5) {
        timerShow.innerHTML = +t;
    } else {
        timerShow.display = "none";
        document.getElementById('tableNotice').style.display = "block";
    }
}