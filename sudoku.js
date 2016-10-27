var board = [
    {"1-4":3,"1-5":2,"1-9":1,
    "2-1":7,"2-3":1,"2-9":8,
    "3-2":4,"3-5":8,"3-9":5,
    "4-5":9,"4-7":8,"4-8":3,
    "5-4":1,"5-6":4,
    "6-2":6,"6-3":9,"6-5":5,
    "7-1":2,"7-5":1,"7-8":4,
    "8-1":4,"8-7":2,"8-9":9,
    "9-1":1,"9-5":7,"9-6":2
    },
    {"1-1":5,"1-4":4,"1-6":3,"1-7":6,"1-8":2,
    "2-2":6,"2-3":4,"2-4":5,"2-7":9,
    "3-1":3,"3-5":7,"3-6":6,"3-7":1,
    "4-2":9,"4-3":6,"4-5":2,"4-7":3,"4-9":5,
    "5-1":1,"5-3":8,"5-7":2,"5-9":7,
    "6-1":2,"6-3":5,"6-5":8,"6-7":4,"6-8":1,
    "7-3":3,"7-4":2,"7-5":6,"7-9":1,
    "8-2":7,"8-6":8,"8-7":9,"8-8":4,
    "9-2":5,"9-3":2,"9-4":7,"9-6":1,"9-9":6
    },
    {"1-1":8,"1-2":3,"1-3":9,"1-4":4,"1-8":2,
    "2-1":1,"2-4":5,"2-6":9,"2-7":3,"2-8":8,
    "3-4":2,"3-7":7,"3-8":1,
    "4-2":5,"4-3":4,"4-6":8,
    "5-1":9,"5-3":1,"5-4":7,"5-5":3,"5-6":4,"5-7":2,"5-9":6,
    "6-4":9,"6-7":8,"6-8":4,
    "7-2":4,"7-3":2,"7-6":7,
    "8-2":9,"8-3":8,"8-4":1,"8-6":6,"8-9":2,
    "9-2":1,"9-6":5,"9-7":4,"9-8":9,"9-9":7
    }
]

$(function(){
    var width = document.documentElement.clientWidth;
    var table = document.getElementsByTagName("table")[0];
    var clock = document.getElementById("clock");
    var bt = document.getElementById("bt");
    

    
    var tb_content = "";
    for (var x = 1; x <= 9; x++) {
        tb_content += "<tr>"
        for (var y = 1; y <= 9; y++) {
            tb_content += ('<td><input type = "text" value = "" autocomplete = "off" maxlength = "1" id = '+x+"-"+y+'></td>');
        };
        tb_content += "</tr>"
    }
    $("tbody").html(tb_content);

    var table_w = table.offsetWidth;
        table.style.marginLeft = (width - table_w)/2 + "px";
        clock.style.marginLeft = (width - table_w)/2 + "px";
        bt.style.marginLeft = (width - table_w)/2 + "px";

    getData();
    $(".random").click(function(){
    //点击后改变选中数组并重新渲染数据
        getData();
    });
    function getData() {
        $("td>input").val("");
        $("td>input").removeClass("err");
        clearTimeout(timeOutId);
        $("#clock>span").text("00");
        generatedata();
    };

    function generatedata() {
        var chance = Math.floor(Math.random()*board.length);
        data = board[chance];
        for (n in data) {
            $("#"+ n).val(data[n]).prop("readonly","readonly");//此处不能用attr('value'， xx)
        }

    }

    //时间表示
    var timeOutId;
    var flag = 0;//未计时
    var time;
    $(".start").click(function(){//开始计时
        if (!flag) {
            flag = 1;
            $(this).removeClass("button_on");
            $(".stop").addClass("time_on");
            var begin = new Date();
            function updateTime() {
                var now = Date.now();
                time = now - Date.parse(begin);
                var min = ("0"+Math.floor(time/1000/60)).slice(-2);
                var seconds = ("0"+(Math.floor(time/1000))%60).slice(-2);
                $("#clock>span:nth-child(1)").text(min);
                $("#clock>span:nth-child(2)").text(seconds);
                timeOutId = setTimeout(updateTime, 1000);
            };
                updateTime();
        };
    });

    $(".stop").click(function(el){
        if (flag) {//先点击再根据标识判断
            clearTimeout(timeOutId);
            $(this).removeClass("time_on");
            $(".start").addClass("button_on");
            flag = 0;
        };  
    });
    //根据x,y取得宫的方法
    function gong(x,y){
        if (x <= 3) {
            if (y <= 3) {
                return /[1-3]\-[1-3]/;
            } else if (y < 7) {
                return /[1-3]\-[4-6]/;
            }else {
                return /[1-3]\-[7-9]/;
            }
        }else if(x <= 6 && x >3) {
            if (y <= 3) {
                return /[4-6]\-[1-3]/;
            } else if (y <= 6 && y > 3) {
                return /[4-6]\-[4-6]/;
            }else {
                return /[4-6]\-[7-9]/;
            }
        }else {
            if (y <= 3) {
                return /[7-9]\-[1-3]/;
            } else if (y < 7 && y > 3) {
                return /[7-9]\-[4-6]/;
            }else {
                return /[7-9]\-[7-9]/;
            }
        }
    };

    $("td>input:not([readonly])").keyup(function(ev){
        if(!$(that).val()) {
            $(that).removeClass("err");
        }
        var x = $(this).attr("id").substr(0,1);
        var y = $(this).attr("id").substr(2,3);
        var that = this;
        var Arr = [];
        var bool;
        $("td>input").each(function(el,i,arr){//遍历每个
            var test_id = $(this).attr("id");
            var patten1 =new RegExp("^"+x+".[^"+y+"]$");
            var patten2 = new RegExp("^[^"+x+"]."+y+"$");
            var patten3 = gong(x,y);
            var bool = patten1.test(test_id) || patten2.test(test_id) || patten3.test(test_id);
            if(bool) {
                Arr.push(test_id);
            }
            
        });
        //遍历每个范围数组，当target值与其相等，则报错
        for (var i = 0; i < Arr.length; i++) {
            var target_val = $(that).val();
            var test_val = $("#"+Arr[i]).not(that).val();//除去自身;
            if (!test_val) {
                continue;//只能在循环体内使用
            };
            if (test_val == target_val) {
                $(that).addClass("err");
                return;//找到时立马返回
            }else{
                $(that).removeClass("err");
            }
        };
    });
});